/* =================================================
FILE: view_3_modal.js
UPDATED: 2026-06-01
================================================= */

import { insertContact } from './view_3_data.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export function openContactModal({ facility, onSave }) {
    const existing = document.getElementById('contactModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'contactModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>Add New Contact</h2>
            <input id="contactName" placeholder="Name" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="contactRole" placeholder="Role" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="contactPhone" placeholder="Phone" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="contactEmail" placeholder="Email" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="contactNotes" placeholder="Notes" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <div style="margin-top:12px;">
                <button id="saveContactBtn" style="padding:12px 20px; background:#f5c400; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">Save Contact</button>
                <button id="closeContactBtn" style="padding:12px 20px; background:#6b7280; border:none; border-radius:8px; cursor:pointer;">Close</button>
            </div>
            <div id="contactImageContainer" style="margin-top:12px;"></div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeContactBtn').onclick = () => modal.remove();

    document.getElementById('saveContactBtn').onclick = async () => {
        const name = document.getElementById('contactName').value.trim();
        const role = document.getElementById('contactRole').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const notes = document.getElementById('contactNotes').value.trim();

        if (!name) return alert('Contact name is required.');

        const newContact = await insertContact({ name, role, phone, email, notes, facility_id: facility.id });
        if (!newContact) return alert('Error saving contact.');

        const imgContainer = document.getElementById('contactImageContainer');
        renderImageManagerSection(imgContainer, 'contact', newContact.id, { title: 'Contact Image' });

        modal.remove();
        if (onSave) onSave();
    };
}
