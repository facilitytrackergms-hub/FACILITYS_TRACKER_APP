/* =================================================
FILE: views/view_3_contacts/view_3_modal.js
UPDATED: 2026-06-05 09:21:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
const __FILENAME = 'view_3_modal.js';
import { insertContact, updateContact } from './view_3_data.js';
import { supabase } from '../../js/supabaseClient.js';

export function setupContactsEvents(facility, refreshCallback) {
    const modal = document.getElementById('manualContactModal');
    const closeBtn = document.getElementById('manualContactCloseBtn');
    const saveBtn = document.getElementById('customSaveContactBtn');
    const triggerBtn = document.getElementById('manualContactTriggerBtn');

    if (triggerBtn) {
        triggerBtn.onclick = () => {
            clearFormFields();
            document.getElementById('modalTemplateTitle').innerText = "Create Directory Entry";
            document.getElementById('editingContactId').value = "";
            modal.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const name = document.getElementById('manualContactName').value.trim();
            const role = document.getElementById('manualContactRole').value.trim();
            const phone = document.getElementById('manualContactPhone').value.trim();
            const email = document.getElementById('manualContactEmail').value.trim();
            const notes = document.getElementById('manualContactNotes').value.trim();
            const imageUrl = document.getElementById('manualContactImage') ? document.getElementById('manualContactImage').value.trim() : '';
            const editingId = document.getElementById('editingContactId').value;

            if (!name) {
                alert("Please provide at least a name.");
                return;
            }

            const payload = {
                facility_id: Number(facility.id),
                name,
                role: role || 'Staff',
                phone: phone || 'N/A',
                email: email || '',
                image_url: imageUrl || '',
                notes: notes || ''
            };

            let success = false;
            if (editingId) {
                const res = await updateContact(editingId, payload);
                if (res) success = true;
            } else {
                const res = await insertContact(payload);
                if (res) success = true;
            }

            if (success) {
                modal.style.display = 'none';
                if (refreshCallback) await refreshCallback(facility);
            } else {
                alert("Could not process directory database save request.");
            }
        };
    }
}

export function openEditContactModal(contact) {
    const modal = document.getElementById('manualContactModal');
    if (!modal) return;

    document.getElementById('modalTemplateTitle').innerText = "Modify Contact Details";
    document.getElementById('editingContactId').value = contact.id;

    if (document.getElementById('manualContactName')) document.getElementById('manualContactName').value = contact.name || '';
    if (document.getElementById('manualContactRole')) document.getElementById('manualContactRole').value = contact.role || '';
    if (document.getElementById('manualContactPhone')) document.getElementById('manualContactPhone').value = contact.phone || '';
    if (document.getElementById('manualContactEmail')) document.getElementById('manualContactEmail').value = contact.email || '';
    if (document.getElementById('manualContactNotes')) document.getElementById('manualContactNotes').value = contact.notes || '';
    if (document.getElementById('manualContactImage')) document.getElementById('manualContactImage').value = contact.image_url || '';

    modal.style.display = 'flex';
}

function clearFormFields() {
    if (document.getElementById('manualContactName')) document.getElementById('manualContactName').value = '';
    if (document.getElementById('manualContactRole')) document.getElementById('manualContactRole').value = '';
    if (document.getElementById('manualContactPhone')) document.getElementById('manualContactPhone').value = '';
    if (document.getElementById('manualContactEmail')) document.getElementById('manualContactEmail').value = '';
    if (document.getElementById('manualContactNotes')) document.getElementById('manualContactNotes').value = '';
    if (document.getElementById('manualContactImage')) document.getElementById('manualContactImage').value = '';
}
