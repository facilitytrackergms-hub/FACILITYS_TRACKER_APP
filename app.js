/**
 * File Version Tag: app.js - May 24, 2026, 7:29 PM
 * Description: Core frontend operational router logic script 
 */

// Firebase Configurations Setup Configuration Block
const firebaseConfig = {
    projectId: "facilitys-tracker",
    databaseId: "(default)"
};

// Initialize Database connection interfaces safely
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();
} catch (e) {
    console.log("Firebase not fully configured yet, running local simulation mode.");
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
// 1. FACILITIES MANAGEMENT (INSTANT BUTTON FIX)
// ==========================================
function saveFacility() {
    const nameInput = document.getElementById('input-facility-name');
    const addressInput = document.getElementById('input-facility-address');
    
    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    
    if (!name) return alert("Facility name required.");

    // Close the modal instantly and clear input values
    closeModal('facility-modal');
    nameInput.value = "";
    addressInput.value = "";

    // Generate quick runtime tracking identifier reference
    const tempId = "temp_" + Date.now();

    // Create the dashboard view action element immediately
    addFacilityButtonToDashboard(tempId, name);

    if (db) {
        db.collection("facilities").add({
            facility_name: name,
            facility_address: address,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Database entry synchronized with reference ID:", docRef.id);
            loadFacilities();
        })
        .catch((error) => {
            console.error("Database connection fallback notice:", error);
        });
    }
}

function addFacilityButtonToDashboard(id, name) {
    const container = document.getElementById('facilities-container');
    
    // Check duplication profiles to stop unnecessary stacked renderings
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
        container.innerHTML = "";
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            addFacilityButtonToDashboard(doc.id, data.facility_name);
        });
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

    closeModal('contact-modal');
    
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
        if (!scheduledTime) return alert("Please select date and time target.");
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

// Boot up setup state logic maps automatically
window.onload = () => { loadFacilities(); };
