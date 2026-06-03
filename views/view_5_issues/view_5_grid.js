/* =================================================
FILE: views/view_5_issues/view_5_grid.js
UPDATED: 2026-06-02 05:55:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchFacilityIssues } from './view_5_data.js';
import { setupIssuesEvents } from './view_5_modal.js';

export async function renderFacilityIssues(data) {
    const facility = data?.facility ? data.facility : data;
    const autoOpen = data?.autoOpenModal || false;
    const prefillData = data?.prefill || null;

    if (!facility || !facility.id) {
        console.error("Facility object is missing or invalid inside issue tracker view.");
        return;
    }

    const app = document.getElementById('app');

    const styles = `
        <style>
            .issues-container { padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing:border-box; }
            .issues-title { color:#00264d; font-size:22px; text-transform:uppercase; margin:0 0 5px 0; }
            .issues-subtitle { color:#4b5563; margin:0 0 25px 0; }
            .issues-stack { display:flex; flex-direction:column; gap:15px; max-width:400px; margin:0 auto; }
            .issue-btn { padding:15px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px; text-transform:uppercase; box-sizing:border-box; width:100%; }
            .issue-btn-navy { background:#00264d; }
            .issue-list { display:flex; flex-direction:column; gap:12px; margin-top:10px; text-align:left; }
            .issue-item-card { background:white; padding:15px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.04); position:relative; cursor:pointer; }
            .issue-item-title { font-weight:bold; color:#00264d; font-size:15px; padding-right:60px; }
            .issue-item-meta { font-size:12px; color:#6b7280; margin-top:4px; }
            .issue-item-status { position:absolute; top:15px; right:15px; font-size:11px; padding:3px 8px; border-radius:12px; font-weight:bold; text-transform:uppercase; }
            .status-open { background:#fef3c7; color:#d97706; }
            .status-closed { background:#d1fae5; color:#059669; }
            .status-pending { background:#e0f2fe; color:#0284c7; }
            
            /* Dialog Modal Overlay Sheets */
            .issue-modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; overflow-y:auto; padding:10px; box-sizing:border-box; }
            .issue-modal-shell { position:relative; background:white; padding:20px; border-radius:12px; width:100%; max-width:450px; margin:20px auto; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.2); box-sizing:border-box; }
            .issue-modal-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; border-bottom:2px solid #e5e7eb; padding-bottom:10px; }
            .issue-form-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; text-transform:uppercase; }
            .issue-form-field { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; font-family:Arial; font-size:14px; }
            
            /* Custom Alert Modal Window */
            .alert-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:200; justify-content:center; align-items:center; }
            .alert-box { background:white; padding:25px; border-radius:10px; text-align:center; max-width:300px; width:90%; box-shadow:0 4px 15px rgba(0,0,0,0.2); }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="issues-container">
            <h1 class="issues-title">Standard Facility Issues</h1>
            <p class="issues-subtitle">${facility.name || 'Facility'}</p>

            <div class="issues-stack">
                <button id="createNewIssueBtn" class="issue-btn">➕ File New Issue Report</button>
                <div id="issuesFeedDisplay" class="issue-list">Loading issues...</div>
                <button id="backToControlsBtn" class="issue-btn issue-btn-navy">⬅️ Back to Controls</button>
            </div>

            <div id="issueModal" class="issue-modal-mask">
                <div class="issue-modal-shell">
                    <h3 id="issueModalTitle" class="issue-modal-title">Issue Details</h3>
                    
                    <input type="hidden" id="issueId">

                    <label class="issue-form-label">Issue Summary / Description</label>
                    <textarea id="issueDescription" class="issue-form-field" style="height:60px; resize:none;" placeholder="Describe the maintenance threat or breakdown..."></textarea>

                    <label class="issue-form-label">Reported By (Contact Name)</label>
                    <input type="text" id="issueInitiatedBy" class="issue-form-field" placeholder="Type name to select or create directory row">

                    <label class="issue-form-label">Current Operational Status</label>
                    <select id="issueStatus" class="issue-form-field">
                        <option value="Open">Open / Active</option>
                        <option value="Pending">Pending / Deferred</option>
                        <option value="Closed">Closed / Resolved</option>
                    </select>

                    <label class="issue-form-label">Urgency Priority Level</label>
                    <select id="issuePriority" class="issue-form-field">
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Emergency">Emergency Threat</option>
                    </select>

                    <div id="issue-image-section" style="display:none; margin-top:15px; padding-top:15px; border-top:2px dashed #e5e7eb;">
                        <label class="issue-form-label" style="color:#28a745;">Linked Issue Asset Photos</label>
                        <div id="issue-image-container" style="margin-top:8px;"></div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:10px; margin-top:25px;">
                        <button id="saveIssueBtn" class="issue-btn issue-btn-navy" style="width:100%;">Save Issue Report</button>
                        <button id="issueFollowupsBtn" class="issue-btn" style="background:#f5c400; color:#111; display:none; width:100%;">
                            💬 View Issue Follow-ups
                        </button>
                        <button id="closeIssueModal" class="issue-btn" style="background:#6b7280; width:100%;">Close Panel</button>
                    </div>
                </div>
            </div>

            <div id="customAlertModal" class="alert-mask">
                <div class="alert-box">
                    <div id="alertIcon" style="font-size:40px; margin-bottom:10px;"></div>
                    <h3 id="alertTitle" style="margin:0 0 8px 0; color:#00264d;">Notice</h3>
                    <p id="alertMessage" style="margin:0 0 20px 0; font-size:14px; color:#4b5563; line-height:1.4;"></p>
                    <button id="alertCloseBtn" class="issue-btn issue-btn-navy" style="padding:10px 20px; font-size:12px;">OK</button>
                </div>
            </div>
        </div>
    `;

    setupIssuesEvents(facility, renderFacilityIssues, autoOpen, prefillData);

    async function loadIssuesDisplayList() {
        const feed = document.getElementById('issuesFeedDisplay');
        if (!feed) return;

        const issues = await fetchFacilityIssues(facility.id);
        feed.innerHTML = '';

        if (!issues || issues.length === 0) {
            feed.innerHTML = '<div style="text-align:center; padding:20px; background:white; border-radius:8px; color:#6b7280; font-size:13px;">No listed issues documented for this site profile.</div>';
            return;
        }

        issues.forEach(issue => {
            const card = document.createElement('div');
            card.className = 'issue-item-card';
            
            const statusStr = (issue.status || 'Open').toLowerCase();
            let badgeClass = 'status-open';
            if (statusStr === 'closed') badgeClass = 'status-closed';
            if (statusStr === 'pending') badgeClass = 'status-pending';

            card.innerHTML = `
                <div class="issue-item-title">${issue.description || 'No description logged'}</div>
                <div class="issue-item-meta">Priority: <strong>${issue.priority || 'Medium'}</strong> | By: ${issue.reported_by || issue.initiated_by || 'Staff'}</div>
                <div class="issue-item-meta" style="font-size:10px; color:#9ca3af; margin-top:2px;">Reported: ${issue.created_at ? new Date(issue.created_at).toLocaleDateString() : 'N/A'}</div>
                <span class="issue-item-status ${badgeClass}">${issue.status || 'Open'}</span>
            `;
            
            card.onclick = () => {
                if (window.openSelectedIssueInModal) {
                    window.openSelectedIssueInModal(issue);
                }
            };
            
            feed.appendChild(card);
        });
    }

    await loadIssuesDisplayList();
}
