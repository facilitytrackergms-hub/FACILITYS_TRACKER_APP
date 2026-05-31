/* =================================================
FILE: controls_v3_grid.js
UPDATED: 2026-05-30 05:40 AM
================================================= */
import { getContacts, getContactIssues, getContactImages } from './controls_v3_data.js';
import { openContactDetail } from './controls_v3_modal.js';

export async function renderContacts(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; min-height:100vh; text-align:center; background:#f3f4f6;">
            <h1 style="font-size:22px; margin-bottom:5px; color:#00264d; text-transform:uppercase;">${facility?.Name || 'FACILITY'} CONTACTS</h1>
            <p style="color:#6b7280; margin-bottom:20px;">Manage contacts and personnel profiles</p>

            <div style="margin-bottom:25px; display:flex; gap:10px; justify-content:center;">
                <button id="addManualContactBtn" style="padding:14px 20px; border:none; border-radius:8px; background:#28a745; color:white; font-weight:bold; cursor:pointer;">+ ADD NEW CONTACT</button>
                <button id="backBtn" style="padding:14px 20px; border:none; border-radius:8px; background:#00264d; color:white; font-weight:bold; cursor:pointer;">BACK TO CONTROLS</button>
            </div>

            <div id="contactsGrid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:15px;">
                <div style="grid-column:1/-1; padding:40px; color:#666;">Loading Contacts...</div>
            </div>

            <div style="margin-top:50px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px;">
                File: controls_v3_grid.js | Updated: 2026-05-30 05:40 AM
            </div>
        </div>
    `;

    await loadContactsGridData(facility);
}
