/* =================================================
FILE: controls_v5_grid.js
UPDATED: 2026-05-30 06:00 AM
================================================= */
import { getFacilityContacts, getFacilityIssues } from './controls_v5_data.js';
import { setupIssueModals } from './controls_v5_modal.js';

export async function renderFacilityIssues(data) {
    const facility = data?.facility ? data.facility : data;
    if (!facility || !facility.id) return;

    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="padding:20px;font-family:Arial;background:#f3f4f6;min-height:100vh;text-align:center;">
            <h1 style="color:#00264d;font-size:22px;text-transform:uppercase;">Standard Facility Issues</h1>
            <p style="color:#4b5563;margin-bottom:25px;">${facility.Name}</p>

            <div style="display:flex;flex-direction:column;gap:15px;max-width:400px;margin:0 auto;">
                <button id="createNewIssueBtn" style="padding:15px;background:#28a745;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">+ REPORT NEW ISSUE</button>
                <button id="backToControlsBtn" style="padding:12px;background:#00264d;color:white;border:none;border-radius:8px;cursor:pointer;">BACK TO CONTROLS</button>
                <div id="issuesList" style="margin-top:20px;display:flex;flex-direction:column;gap:12px;text-align:left;">
                    <div style="text-align:center;color:#94a3b8;font-style:italic;">Loading issues...</div>
                </div>
            </div>

            <div style="margin-top:50px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px;">
                File: controls_v5_grid.js | Updated: 2026-05-30 06:00 AM
            </div>
        </div>
    `;

    setupIssueModals(facility);
    await loadIssues(facility);
}

async function loadIssues(facility) {
    const list = document.getElementById('issuesList');
    list.innerHTML = '<div style="text-align:center;color:#94a3b8;font-style:italic;">Loading issues...</div>';
    const { data } = await getFacilityIssues(facility.id);
    if (!data || data.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#94a3b8;font-style:italic;">No active standard issues reported yet.</div>';
        return;
    }
    list.innerHTML = data.map(item => `
        <div class="issue-card" style="background:white;padding:15px;border-radius:10px;border-left:5px solid ${item.open_issue ? '#dc2625':'#28a745'};cursor:pointer;display:flex;align-items:center;gap:12px;" id="facility-issue-item-${item.id}">
            <div style="width:40px;height:40px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:18px;color:#94a3b8;font-weight:bold;flex-shrink:0;">👤</div>
            <div style="flex:1;">
                <strong style="display:block;color:#00264d;font-size:15px;">${item.issue}</strong>
                <span style="font-size:12px;color:#6b7280;">By: ${item.initiated_by || 'Unknown'}</span>
            </div>
            <span style="font-size:10px;color:#94a3b8;white-space:nowrap;">${new Date(item.created_at).toLocaleDateString()}</span>
        </div>`).join('');

    data.forEach(item => {
        const el = document.getElementById(`facility-issue-item-${item.id}`);
        if (el) el.onclick = () => window.editIssue(item);
    });
}
