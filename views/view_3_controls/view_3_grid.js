/* =================================================
FILE: view_3_grid.js
UPDATED: 2026-06-01
================================================= */

import { fetchContacts } from './view_3_data.js';
import { openContactModal } from './view_3_modal.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export async function renderContactsDashboard({ facility }) {
    const app = document.getElementById('app');
    if (!app) return;

    const contacts = await fetchContacts(facility.id);

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; text-align:center;">
            <h1>${facility.name} Contacts</h1>
            <button id="addContactBtn" style="padding:14px 28px; background:#f5c400; color:black; border:none; border-radius:8px; cursor:pointer; margin-bottom:16px;">
                Add Contact
            </button>
            <div id="contactsGrid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; max-width:600px; margin:0 auto;"></div>
            <button id="backBtn" style="padding:12px 20px; margin-top:20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                Back to Controls
            </button>
        </div>
    `;

    const grid = document.getElementById('contactsGrid');

    contacts.forEach(c => {
        const btn = document.createElement('button');
        btn.textContent = c.name;
        btn.style.cssText = `
            padding:12px; background:#00264d; color:white; border:none; border-radius:8px; cursor:pointer;
        `;
        btn.onclick = () => {
            alert(`Contact details: ${c.name}, ${c.role}, ${c.phone}`);
        };
        grid.appendChild(btn);
    });

    document.getElementById('addContactBtn').onclick = () => {
        openContactModal({ facility, onSave: () => renderContactsDashboard({ facility }) });
    };

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view2_controls', { facility });
    };
}
