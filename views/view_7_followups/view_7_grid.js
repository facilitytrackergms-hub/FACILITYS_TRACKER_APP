/* =================================================
FILE: view_7_grid.js
UPDATED: 2026-06-01
================================================= */
import { fetchFollowups } from './view_7_data.js';
import { openFollowupModal } from './view_7_modal.js';

export async function renderFollowups(issueId) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<p>Loading follow-ups...</p>';
    const followups = await fetchFollowups(issueId);

    if (!followups || followups.length === 0) {
        app.innerHTML = '<p>No follow-ups found for this issue.</p>';
        return;
    }

    app.innerHTML = '<div id="followupsContainer" style="display:flex; flex-direction:column; gap:12px;"></div>';
    const container = document.getElementById('followupsContainer');

    followups.forEach(fu => {
        const card = document.createElement('div');
        card.style.cssText = 'border:1px solid #ccc; padding:12px; border-radius:8px; cursor:pointer;';

        card.innerHTML = `
            <h4>${fu.followup_title}</h4>
            <p>${fu.followup_notes_text || ''}</p>
            <p>By: ${fu.initiated_by_text || 'N/A'}</p>
        `;
        card.onclick = () => openFollowupModal(fu, issueId, true);
        container.appendChild(card);
    });

    const addBtn = document.createElement('button');
    addBtn.innerText = "Add Follow-up";
    addBtn.style.cssText = "margin-top:12px; padding:10px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;";
    addBtn.onclick = () => openFollowupModal(null, issueId, false);
    app.appendChild(addBtn);
}
