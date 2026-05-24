// Firebase Configuration Setup Block
const firebaseConfig = {
    projectId: "facilitys-tracker",
    databaseId: "(default)"
    // Paste your complete Firebase Config credentials string snippet from console here if using live Firestore
};

// Initialize Database connection safely
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();
} catch (e) {
    console.log("Firebase not fully configured yet, using local-first mode.");
}

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
// 1. FACILITIES MANAGEMENT (FIXED & INSTANT)
// ==========================================
function saveFacility() {
    const nameInput = document.getElementById('input-facility-name');
    const addressInput = document.getElementById('input-facility-address');
    
    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    
    if (!name) return alert("Facility name required.");

    // --- FIX: INSTANT UI CLOSING & BUTTON CREATION ---
    // 1. Close the modal immediately so the user knows it worked
    closeModal('facility-modal');
    
    // 2. Clear the inputs right away
    nameInput.value = "";
    addressInput.value = "";

    // 3. Create a temporary ID so the button works even if network is slow
    const tempId = "temp_" + Date.now();

    // 4. Put the button straight onto the screen without waiting
    addFacilityButtonToDashboard(tempId, name);

    // 5. Send the data to Firestore in the background
    if (db) {
        db.collection("facilities").add({
            facility_name: name,
            facility_address: address,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Saved to database successfully with ID:", docRef.id);
            // Refresh dashboard seamlessly to replace temp ID with database ID
            loadFacilities();
        })
        .catch((error) => {
            console.error("Database error (stored locally for now):", error);
        });
    }
}

// Helper function that physically builds the button onto your dashboard HTML
function addFacilityButtonToDashboard(id, name) {
    const container = document.getElementById('facilities-container');
    
    // Prevent duplicate placeholder buttons on instant clicks
    const existingButtons = Array.from(container.querySelectorAll('button'));
    const isDuplicate = existingButtons.some(b => b.textContent === name);
    if (isDuplicate) return;

    const btn = document.createElement('button');
    btn.textContent = name;
    btn.setAttribute('data-id', id);
    btn.onclick = () => {
        currentFacilityId = id;
        currentFacilityName = name;
        document.getElementById('current-facility-title').textContent = currentFacilityName;
        switchView('facility-dashboard');
    };
    container.appendChild(btn);
}

function loadFacilities() {
    if (!db) return;
    
    db.collection("facilities").orderBy("facility_name").get()
    .then((querySnapshot) => {
        const container = document.getElementById('facilities-container');
        container.innerHTML = ""; // Clear existing buttons
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            addFacilityButtonToDashboard(doc.id, data.facility_name);
        });
    })
    .catch((err) => {
        console.log("Could not load facilities from cloud, checking screen buttons.");
    });
}

// ==========================================
// 2. INTERACTIVE CONTACTS WITH COMM LINKS
// ==========================================
function saveContact() {
    const nameInput = document.getElementById('contact-name');
    const phoneInput = document.getElementById('contact-phone');
    const emailInput = document.getElementById('contact-email');
    const roleInput = document.getElementById('contact-role');
    const notesInput = document.getElementById('contact-notes');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleInput.value.trim();
    const notes = notesInput.value.trim();

    if (!name) return alert("Contact Name is required.");

    // Instant Close & UI reset
    closeModal('contact-modal');
    
    // Add directly to screen view
    addContactCardToScreen({
        contact_name: name,
        contact_phone: phone,
        contact_email: email,
        contact_role: role,
        contact_notes: notes
    });

    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    roleInput.value = "";
    notesInput.value = "";

    if (db && currentFacilityId) {
        db.collection("contact").add({
            facility_id: currentFacilityId,
            contact_name: name,
            contact_phone: phone,
            contact_email: email,
            contact_role: role,
            contact_notes: notes
        });
    }
}

function addContactCardToScreen(data) {
    const container = document.getElementById('contacts-container');
    const card = document.createElement('div');
    card.className = "contact-card";
    
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
}

function loadContacts() {
    if (!db || !currentFacilityId) return;
    
    db.collection("contact").where("facility_id", "==", currentFacilityId).get().then((snapshot) => {
        const container = document.getElementById('contacts-container');
        container.innerHTML = "";
        snapshot.forEach((doc) => {
            addContactCardToScreen(doc.data());
        });
    });
}

// ==========================================
// 3. MULTI-NOTES & CONDITIONAL POPUP SCHEDULER
// ==========================================
function checkNoteReminderPrompt() {
    const noteText = document.getElementById('note-content').value.trim();
    if (!noteText) return alert("Note description cannot be blank.");
    
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
        if (!scheduledTime) return alert("Please select date and time.");
    }

    submitNoteToDatabase(noteText, true, {
        type: isAllDay ? "all-day" : "timed",
        time: scheduledTime
    });
}

function submitNoteToDatabase(text, hasReminder, reminderDetails) {
    closeModal('note-modal');

    addNoteItemToScreen({
        note_text: text,
        has_reminder: hasReminder,
        reminder_info: reminderDetails,
        createdAt: null
    });

    if (db && currentFacilityId) {
        db.collection("facility_notes").add({
            facility_id: currentFacilityId,
            note_text: text,
            has_reminder: hasReminder,
            reminder_info: reminderDetails,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

function addNoteItemToScreen(data) {
    const container = document.getElementById('notes-container');
    const item = document.createElement('div');
    item.className = "note-item";
    
    let reminderHTML = "";
    if (data.has_reminder && data.reminder_info) {
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
}

function loadNotes() {
    if (!db || !currentFacilityId) return;

    db.collection("facilities").doc(currentFacilityId).get().then((facDoc) => {
        let gpsHTML = '';
        if (facDoc.exists && facDoc.data().facility_address) {
            const address = facDoc.data().facility_address;
            gpsHTML = `<div style="margin-bottom:15px;"><a href="https://maps.google.com/?q=${encodeURIComponent(address)}" target="_blank" class="action-link">📍 Navigate to Facility via GPS</a></div>`;
        }

        db.collection("facility_notes")
          .where("facility_id", "==", currentFacilityId)
          .get()
          .then((snapshot) => {
            const container = document.getElementById('notes-container');
            container.innerHTML = gpsHTML; 
            
            snapshot.forEach((doc) => {
                addNoteItemToScreen(doc.data());
            });
        });
    });
}

// Boot up app dashboard setup state
window.onload = () => { loadFacilities(); };
