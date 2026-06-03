/* =================================================
FILE: views/view_3_contacts/view_3_modal.js
UPDATED: 2026-06-02 10:40:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { insertContact, updateContact } from './view_3_data.js';

export function setupContactsEvents(facility, refreshCallback) {
    const modal = document.getElementById('manualContactModal');
    const triggerBtn = document.getElementById('manualContactTriggerBtn');
    const closeBtn = document.getElementById('manualContactCloseBtn');
    const saveBtn = document.getElementById('manualContactSaveBtn');
    const backBtn = document.getElementById('backBtn');

    if (triggerBtn) {
        triggerBtn.onclick = () => {
            document.getElementById('editingContactId').value = '';
            document.getElementById('modalTemplateTitle').innerText = 'Create Directory Entry';
            clearFormFields();
            modal.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; };
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', { facility: facility });
            }
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const payload = {
                name: document.getElementById('manualContactName').value.trim(),
                role: document.getElementById('manualContactRole').value.trim(),
                phone: document.getElementById('manualContactPhone').value.trim(),
                email: document.getElementById('manualContactEmail').value.trim(),
                notes: document.getElementById('manualContactNotes').value.trim(),
                image_url: document.getElementById('manualContactImage').value.trim(),
                facility_id: facility.id
            };

            if (!payload.name) {
                alert("Please provide a name entry.");
                return;
            }

            const editingId = document.getElementById('editingContactId').value;
            let result = null;

            if (editingId) {
                result = await updateContact(editingId, payload);
            } else {
                result = await insertContact(payload);
            }

            if (result) {
                modal.style.display = 'none';
                clearFormFields();
                refreshCallback(facility);
            } else {
                alert("Could not update directory metadata entry row.");
            }
        };
    }
}

export function openEditContactModal(contact) {
    document.getElementById('editingContactId').value = contact.id;
    document.getElementById('modalTemplateTitle').innerText = 'Modify Directory Entry';
    
    document.getElementById('manualContactName').value = contact.name || '';
    document.getElementById('manualContactRole').value = contact.role || '';
    document.getElementById('manualContactPhone').value = contact.phone === 'N/A' ? '' : contact.phone;
    document.getElementById('manualContactEmail').value = contact.email || '';
    document.getElementById('manualContactNotes').value = contact.notes === 'No notes added.' ? '' : contact.notes;
    document.getElementById('manualContactImage').value = contact.image_url || '';
    
    document.getElementById('manualContactModal').style.display = 'flex';
}

function clearFormFields() {
    document.getElementById('manualContactName').value = '';
    document.getElementById('manualContactRole').value = '';
    document.getElementById('manualContactPhone').value = '';
    document.getElementById('manualContactEmail').value = '';
    document.getElementById('manualContactNotes').value = '';
    document.getElementById('manualContactImage').value = '';
}
