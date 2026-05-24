// Firebase Configurations Setup Configuration Block
const firebaseConfig = {
    projectId: "facilitys-tracker",
    databaseId: "(default)"
    // Paste your complete Firebase Config credentials string snippet from console here
};

// Initialize Database connection interfaces
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Application State Tracking Variables
let currentFacilityId = null;
let currentFacilityName = "";

// Simple View Swap Controller Router Utilities
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    
    // Realtime UI updates when jumping context views
    if (viewId === 'main-dashboard') {
        loadFacilities();
    } else if (viewId === 'contact-dashboard') {
        loadContacts();
    } else if (viewId === 'notes-dashboard') {
        loadNotes();
    }
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    if (modalId === 'note-modal') {
        // Reset note multi-step workflow states completely on initialization
        document.getElementById('note-step-text').classList.remove('hidden');
        document.getElementById('note-step-reminder-prompt').classList.add('hidden');
        document.getElementById('note-step-reminder-config').classList.add('hidden');
        document.getElementById('note-content').value = "";
        document.getElementById('reminder-all-day').checked = false;
        toggleReminderTimeVisibility(false);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// ==========================================
// 1. FACILITIES MANAGEMENT
// ==========================================
function saveFacility() {
    const name = document.getElementById('input-facility-name').value.trim();
    const address = document.getElementById('input-facility-address').value.trim();
    
    if(!name) return alert("Facility name required.");

    db.collection("facilities").add({
        facility_name: name,
        facility_address: address,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        closeModal('facility-modal');
        document.getElementById('input-facility-name').value = "";
        document.getElementById('input-facility-address').value = "";
        loadFacilities();
    });
}

function loadFacilities() {
    db.collection("facilities").orderBy("facility_name").get().then((querySnapshot) => {
        const container = document.getElementById('facilities-container');
        container.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const btn = document.createElement('button');
            btn.textContent = data.facility_name;
            btn.onclick = () => {
                currentFacilityId = doc.id;
                currentFacilityName = data.facility_name;
                document.getElementById('current-facility-title').textContent = currentFacilityName;
                switchView('facility-dashboard');
            };
            container.appendChild(btn);
        });
    });
}

// ==========================================
// 2. INTERACTIVE CONTACTS WITH COMM LINKS
// ==========================================
function saveContact() {
    if (!currentFacilityId) return;
    
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const role = document.getElementById('contact-role').value.trim();
    const notes = document.getElementById('contact-notes').value.trim();

    if(!name) return alert("Contact Name is required.");

    db.collection("contact").add({
        facility_id: currentFacilityId,
        contact_name: name,
        contact_phone: phone,
        contact_email: email,
        contact_role: role,
        contact_notes: notes
    })
    .then(() => {
        closeModal('contact-modal');
        // Clear inputs layout properties
        document.getElementById('contact-name').value = "";
        document.getElementById('contact-phone').value = "";
        document.getElementById('contact-email').value = "";
        document.getElementById('contact-role').value = "";
        document.getElementById('contact-notes').value = "";
        loadContacts();
    });
}

function loadContacts() {
    db.collection("contact").where("facility_id", "==", currentFacilityId).get().then((snapshot) => {
        const container = document.getElementById('contacts-container');
        container.innerHTML = "";
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = "contact-card";
            
            // Generate link structures dynamically based on user rules
            const phoneHTML = data.contact_phone ? `<a href="tel:${data.contact_phone}" class="action-link">📞 ${data.contact_phone}</a>` : '';
            const emailHTML = data.contact_email ? `<a href="mailto:${data.contact_email}" class="action-link">✉️ ${data.contact_email}</a>` : '';
            const roleHTML = data.contact_role ? `<span class="role-badge">${data.contact_role}</span>` : '';
            
            card.innerHTML = `
                <h4>${data.contact_name}</h4>
                ${roleHTML}
                ${phoneHTML}
                ${emailHTML}
                <p style="margin-top:10px; font-size:14px; color:#475569;">${data.contact_notes || ''}</p>
            `;
            container.appendChild(card);
        });
    });
}

// ==========================================
// 3. MULTI-NOTES & CONDITIONAL POPUP SCHEDULER
// ==========================================
function checkNoteReminderPrompt() {
    const noteText = document.getElementById('note-content').value.trim();
    if (!noteText) return alert("Note description cannot be blank.");
    
    // Progress modal tracking to confirmation layer step
    document.getElementById('note-step-text').classList.add('hidden');
    document.getElementById('note-step-reminder-prompt').classList.remove('hidden');
}

function saveNoteWithoutReminder() {
    const noteText = document.getElementById('note-content').value.trim();
    submitNoteToDatabase(noteText, false, null);
}

function showReminderOptions() {
    document.getElementById('note-step-reminder-prompt').classList.add('hidden');
    document.getElementById('note-step-reminder-config').classList.remove('hidden');
}

function backToReminderPrompt() {
    document.getElementById('note-step-reminder-config').classList.add('hidden');
    document.getElementById('note-step-reminder-prompt').classList.remove('hidden');
}

function toggleReminderTimeVisibility(isAllDay) {
    if (isAllDay) {
        document.getElementById('reminder-date-wrapper').classList.remove('hidden');
        document.getElementById('reminder-datetime-wrapper').classList.add('hidden');
    } else {
        document.getElementById('reminder-date-wrapper').classList.add('hidden');
        document.getElementById('reminder-datetime-wrapper').classList.remove('hidden');
    }
}

function saveNoteWithReminder() {
    const noteText = document.getElementById('note-content').value.trim();
    const isAllDay = document.getElementById('reminder-all-day').checked;
    let scheduledTime = "";

    if (isAllDay) {
        scheduledTime = document.getElementById('reminder-date').value;
        if (!scheduledTime) return alert("Please pick an event date.");
    } else {
        scheduledTime = document.getElementById('reminder-datetime').value;
        if (!scheduledTime) return alert("Please select date and timeline target.");
    }

    submitNoteToDatabase(noteText, true, {
        type: isAllDay ? "all-day" : "timed",
        time: scheduledTime
    });
}

function submitNoteToDatabase(text, hasReminder, reminderDetails) {
    db.collection("facilities").doc(currentFacilityId).get().then((docSnapshot) => {
        let currentAddress = "";
        if (docSnapshot.exists && docSnapshot.data().facility_address) {
            currentAddress = docSnapshot.data().facility_address;
        }

        db.collection("facility_notes").add({
            facility_id: currentFacilityId,
            note_text: text,
            has_reminder: hasReminder,
            reminder_info: reminderDetails,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            closeModal('note-modal');
            loadNotes();
        });
    });
}

function loadNotes() {
    // First, look up the target facility's metadata to extract its address
    db.collection("facilities").doc(currentFacilityId).get().then((facDoc) => {
        let gpsHTML = '';
        if (facDoc.exists && facDoc.data().facility_address) {
            const address = facDoc.data().facility_address;
            // Build absolute static Google Maps search tracking reference query string URL
            gpsHTML = `<div style="margin-bottom:15px;"><a href="https://maps.google.com/?q=${encodeURIComponent(address)}" target="_blank" class="action-link">📍 Navigate to Facility via GPS</a></div>`;
        }

        db.collection("facility_notes")
          .where("facility_id", "==", currentFacilityId)
          .orderBy("createdAt", "desc")
          .get()
          .then((snapshot) => {
            const container = document.getElementById('notes-container');
            // Populate container with GPS route button at top of note timeline
            container.innerHTML = gpsHTML; 
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                const item = document.createElement('div');
                item.className = "note-item";
                
                let reminderHTML = "";
                if(data.has_reminder && data.reminder_info) {
                    const info = data.reminder_info;
                    reminderHTML = `<div class="reminder-indicator">⏰ Reminder: ${info.time} (${info.type === 'all-day' ? 'All Day' : 'Timed Event'})</div>`;
                }
                
                const timestamp = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'Just Now';
                
                item.innerHTML = `
                    <p style="margin:0; font-size:15px; line-height:1.5;">${data.note_text}</p>
                    ${reminderHTML}
                    <div class="note-meta">Posted: ${timestamp}</div>
                `;
                container.appendChild(item);
            });
        });
    });
}

// Boot up setup state logic maps automatically
window.onload = () => { loadFacilities(); };
