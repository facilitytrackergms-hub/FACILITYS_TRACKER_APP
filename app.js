/**
 * File Version Tag: app.js - May 24, 2026, 7:42 PM
 * Description: Core frontend operational script with dual Cloud-Sync and LocalStorage backup
 */

// =========================================================================
// 1. FIREBASE CONFIGURATION (ACTION REQUIRED)
// =========================================================================
// GO TO YOUR FIREBASE CONSOLE, COPY YOUR WEB APP CONFIG AND PASTE IT HERE:
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "facilitys-tracker.firebaseapp.com",
    projectId: "facilitys-tracker",
    storageBucket: "facilitys-tracker.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseId: "(default)"
};

// Initialize Database connection safely
let db = null;
try {
    if (typeof firebase !== 'undefined' && firebase.apps && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("Firebase connected successfully.");
    }
} catch (e) {
    console.warn("Firebase config is blank or incomplete. Using LocalStorage fallback storage.", e);
}

// Application State Tracking Variables
let currentFacilityId = null;
let currentFacilityName = "";

// Simple View Swap Controller Router Utilities
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    
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
// 2. FACILITIES MANAGEMENT (WITH REFRESH FIX)
// ==========================================
function saveFacility() {
    const nameInput = document.getElementById('input-facility-name');
    const addressInput = document.getElementById('input-facility-address');
    
    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    
    if (!name) return alert("Facility name required.");

    // Close modal and reset fields immediately
    closeModal('facility-modal');
    nameInput.value = "";
    addressInput.value = "";

    const facilityId = "fac_" + Date.now();
    const newFacility = {
        id: facilityId,
        facility_name: name,
        facility_address: address,
        createdAt: new Date().toISOString()
    };

    // --- SAVE TO LOCAL STORAGE IMMEDIATELY ---
    let localFacilities = JSON.parse(localStorage.getItem('local_facilities')) || [];
    localFacilities.push(newFacility);
    localStorage.setItem('local_facilities', JSON.stringify(localFacilities));

    // Show it on the dashboard right away
    addFacilityButtonToDashboard(facilityId, name, address);

    // --- SYNC TO FIRESTORE CLOUD ---
    if (db) {
        db.collection("facilities").doc(facilityId).set({
            facility_name: name,
            facility_address: address,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => console.log("Facility synced to cloud successfully."))
        .catch(err => console.error("Cloud busy, backed up safely in local browser storage.", err));
    }
}

function addFacilityButtonToDashboard(id, name, address) {
    const container = document.getElementById('facilities-container');
    
    // Prevent rendering duplicates
    const existingButtons = Array.from(container.querySelectorAll('button'));
    const isDuplicate = existingButtons.some(b => b.textContent === name);
    if (isDuplicate) return;

    const btn = document.createElement('button');
    btn.textContent = name;
    btn.setAttribute('data-id', id);
    btn.setAttribute('data-address', address || '');
    btn.onclick = () => {
        currentFacilityId = id;
        currentFacilityName = name;
        document.getElementById('current-facility-title').textContent = currentFacilityName;
        switchView('facility-dashboard');
    };
    container.appendChild(btn);
}

function loadFacilities() {
    const container = document.getElementById('facilities-container');
    container.innerHTML = "";

    // 1. Always load Local Storage buttons instantly so screen is never blank on refresh
    const localFacilities = JSON.parse(localStorage.getItem('local_facilities')) || [];
    localFacilities.forEach(fac => {
        addFacilityButtonToDashboard(fac.id || fac.facility_id, fac.facility_name, fac.facility_address);
    });

    // 2. Fetch from cloud database in background to sync missing additions
    if (db) {
        db.collection("facilities").orderBy("facility_name").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                addFacilityButtonToDashboard(doc.id, data.facility_name, data.facility_address);
            });
        })
        .catch(err => console.log("Offline mode: Running purely off backup local storage records."));
    }
}

// ==========================================
// 3. INTERACTIVE CONTACTS MANAGEMENT
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
    
    const contactData = {
        facility_id: currentFacilityId,
        contact_name: name,
        contact_phone: phone,
        contact_email: email,
        contact_role: role,
        contact_notes: notes
    };

    // Save to LocalStorage Backup
    let localContacts = JSON.parse(localStorage.getItem('local_contacts')) || [];
    localContacts.push(contactData);
    localStorage.setItem('local_contacts', JSON.stringify(localContacts));

    // Show on screen instantly
    addContactCardToScreen(contactData);

    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    roleInput.value = "";
    notesInput.value = "";

    if (db && currentFacilityId) {
        db.collection("contact").add(contactData);
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
    const container = document.getElementById('contacts-container');
    container.innerHTML = "";

    // Load from Local Backup first
    const localContacts = JSON.parse(localStorage.getItem('local_contacts')) || [];
    localContacts.filter(c => c.facility_id === currentFacilityId).forEach(c => {
        addContactCardToScreen(c);
    });

    if (db && currentFacilityId) {
        db.collection("contact").where("facility_id", "==", currentFacilityId).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                addContactCardToScreen(doc.data());
            });
        });
    }
}

// ==========================================
// 4. MULTI-NOTES & REMINDERS WORKFLOW
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

    const noteData = {
        facility_id: currentFacilityId,
        note_text: text,
        has_reminder: hasReminder,
        reminder_info: reminderDetails,
        createdAt: new Date().toISOString()
    };

    // Save to local machine storage array backup
    let localNotes = JSON.parse(localStorage.getItem('local_notes')) || [];
    localNotes.push(noteData);
    localStorage.setItem('local_notes', JSON.stringify(localNotes));

    addNoteItemToScreen(noteData);

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
    
    const timestamp = data.createdAt ? new Date(data.createdAt).toLocaleString() : 'Just Now';
    
    item.innerHTML = `
        <p style="margin:0; font-size:15px; line-height:1.5;">${data.note_text}</p>
        ${reminderHTML}
        <div class="note-meta">Posted: ${timestamp}</div>
    `;
    container.appendChild(item);
}

function loadNotes() {
    const container = document.getElementById('notes-container');
    const currentBtn = document.querySelector(`button[data-id="${currentFacilityId}"]`);
    let gpsHTML = '';
    
    if (currentBtn && currentBtn.getAttribute('data-address')) {
        const address = currentBtn.getAttribute('data-address');
        gpsHTML = `<div style="margin-bottom:15px;"><a href="https://maps.google.com/?q=${encodeURIComponent(address)}" target="_blank" class="action-link">📍 Navigate to Facility via GPS</a></div>`;
    }
    
    container.innerHTML = gpsHTML;

    // Load from Local Backup first
    const localNotes = JSON.parse(localStorage.getItem('local_notes')) || [];
    localNotes.filter(n => n.facility_id === currentFacilityId).forEach(n => {
        addNoteItemToScreen(n);
    });

    if (!db || !currentFacilityId) return;

    db.collection("facility_notes")
      .where("facility_id", "==", currentFacilityId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
            const cloudData = doc.data();
            if (cloudData.createdAt && cloudData.createdAt.seconds) {
                cloudData.createdAt = new Date(cloudData.createdAt.seconds * 1000).toISOString();
            }
            addNoteItemToScreen(cloudData);
        });
    });
}

// Boot up app on page load
window.onload = () => { loadFacilities(); };
