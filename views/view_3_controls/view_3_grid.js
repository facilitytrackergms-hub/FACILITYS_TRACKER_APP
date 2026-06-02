/* =================================================
FILE: view_3_grid.js
UPDATED: 2026-06-01
================================================= */
import { fetchContacts } from './view_3_data.js';
import { openContactModal } from './view_3_modal.js';

export async function renderContacts() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<p>Loading contacts...</p>';
    const contacts = await fetchContacts();

    if (!contacts || contacts.length === 0) {
        app.innerHTML = '<p>No contacts found.</p>';
        return;
    }

    app.innerHTML = '<div id="contactsContainer" style="display:flex; flex-wrap:wrap; gap:12px;"></div>';
    const container = document.getElementById('contactsContainer');

    contacts.forEach(contact => {
        const card = document.createElement('div');
        card.style.cssText = 'border:1px solid #ccc; padding:12px; border-radius:8px; width:200px; cursor:pointer;';

        card.innerHTML = `
            <h3>${contact.name_text}</h3>
            <p>Role: ${contact.role_text}</p>
            <p>Facility ID: ${contact.facility_id || 'N/A'}</p>
        `;
        card.onclick = () => openContactModal(contact, true);
        container.appendChild(card);
    });

    const addBtn = document.createElement('button');
    addBtn.innerText = "Add Contact";
    addBtn.style.cssText = "margin-top:12px; padding:10px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;";
    addBtn.onclick = () => openContactModal(null, false);
    app.appendChild(addBtn);
}
