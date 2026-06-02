/* =================================================
FILE: view_3_modal.js
UPDATED: 2026-06-01
================================================= */
import { insertContact, updateContact } from './view_3_data.js';

export function openContactModal(contact, isEdit) {
    let existing = document.getElementById('contactModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'contactModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; justify-content:center; align-items:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:24px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>${isEdit ? 'Edit Contact' : 'Add Contact'}</h2>
            <input id="contactName" placeholder="Name" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${contact?.name_text || ''}">
            <input id="contactRole" placeholder="Role" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${contact?.role_text || ''}">
            <input id="contactFacility" placeholder="Facility ID (UUID)" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${contact?.facility_id || ''}">
            <div style="margin-top:12px;">
                <button id="saveContactBtn" style="padding:12px 20px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">
                    ${isEdit ? 'Update' : 'Save'}
                </button>
                <button id="closeContactBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeContactBtn').onclick = () => modal.remove();

    document.getElementById('saveContactBtn').onclick = async () => {
        const name = document.getElementById('contactName').value.trim();
        const role = document.getElementById('contactRole').value.trim();
        const facilityId = document.getElementById('contactFacility').value.trim();

        if (!name) return alert('Contact name is required.');

        if (isEdit && contact?.id) {
            await updateContact(contact.id, { name, role, facility_id: facilityId });
        } else {
            await insertContact({ name, role, facility_id: facilityId });
        }

        modal.remove();
        const { renderContacts } = await import('./view_3_grid.js');
        renderContacts();
    };
}
