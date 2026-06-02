/* =================================================
FILE: views/view_7_followups/view_7_grid.js
UPDATED: 2026-06-02 06:05:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchIssueFollowups } from './view_7_data.js';
import { setupFollowupsEvents } from './view_7_modal.js';

export async function renderIssueFollowups(data, issueContext = null) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;
    const issue = data?.issue ? data.issue : issueContext;

    const styles = `
        <style>
            .followups-container { padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing:border-box; }
            .followups-title { color:#00264d; font-size:22px; text-transform:uppercase; margin:0 0 5px 0; }
            .followups-subtitle { color:#4b5563; margin:0 0 25px 0; font-size:14px; }
            .followups-stack { display:flex; flex-direction:column; gap:12px; max-width:400px; margin:0 auto; }
            .followup-btn { padding:15px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px; text-transform:uppercase; box-sizing:border-box; width:100%; }
            .followup-btn-navy { background:#00264d; }
            .followup-btn-gray { background:#6b7280; }
            .followup-feed { display:flex; flex-direction:column; gap:12px; margin-top:10px; text-align:left; }
            .followup-card { background:white; padding:15px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.04); cursor:pointer; }
            .followup-card-header { display:flex; justify-content:between; align-items:center; border-bottom:1px solid #f3f4f6; padding-bottom:6px; margin-bottom:8px; }
            .followup-type-badge { font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px; background:#e0f2fe; color:#0369a1; text-transform:uppercase; }
            .followup-meta-text { font-size:12px; color:#6b7280; }
            .followup-body-desc { font-size:14px; color:#1f2937; line-height:1.4; }
            
            /* Dialog popup windows sheet */
            .followup-modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; overflow-y:auto; padding:10px; box-sizing:border-box; }
            .followup-modal-shell { position:relative; background:white; padding:20px; border-radius:12px; width:100%; max-width:420px; margin:20px auto; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.2); box-sizing:border-box; }
            .followup-modal-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; border-bottom:2px solid #e5e7eb; padding-bottom:10px; }
            .followup-form-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; text-transform:uppercase; }
            .followup-form-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; font-family:Arial; font-size:14px; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="followups-container">
            <h1 class="followups-title">Issue Follow-ups</h1>
            <p class="followups-subtitle">
                Facility: <strong>${facility?.name || ''}</strong> | Issue: <strong>${issue?.description || ''}</strong>
            </p>

            <div class="followups-stack">
                <button id="addFollowupBtn" class="followup-btn">➕ Log Action / Follow-up</button>
                <div id="followupsFeedDisplay" class="followup-feed">Loading history logs...</div>
                <button id="backBtn" class="followup-btn followup-btn-navy">⬅️ Back to Issues List</button>
            </div>

            <div id="followupModal" class="followup-modal-mask">
                <div class="followup-modal-shell">
                    <h3 id="followupModalTitle" class="followup-modal-title">Log Action Event</h3>
                    
                    <input type="hidden" id="followupId">

                    <label class="followup-form-label">Action Classification Type</label>
                    <select id="actionTypeInput" class="followup-form-input">
                        <option value="Comment">General Comment</option>
                        <option value="Inspection">Site Inspection</option>
                        <option value="Repair Attempt">Repair Attempt</option>
                        <option value="Resolution Log">Resolution / Closing Log</option>
                    </select>

                    <label class="followup-form-label">Action Performed By</label>
                    <input type="text" id="actionByInput" class="followup-form-input" placeholder="e.g. John Doe (Technician)">

                    <label class="followup-form-label">Detailed Activity Logs</label>
                    <textarea id="descriptionInput" class="followup-form-input" style="height:70px; resize:none;" placeholder="Document technical details or comments here..."></textarea>

                    <div id="followup-image-section" style="display:none; margin-top:15px; padding-top:15px; border-top:2px dashed #e5e7eb;">
                        <label class="followup-form-label" style="color:#28a745;">Linked Follow-up Asset Photos</label>
                        <div id="followup-image-container" style="margin-top:8px;"></div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:10px; margin-top:25px;">
                        <button id="saveFollowupBtn" class="followup-btn followup-btn-navy">Save Activity Entry</button>
                        <button id="closeFollowupModal" class="followup-btn followup-btn-gray">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupFollowupsEvents(facility, issue, renderIssueFollowups);

    async function loadFollowupsDisplayFeed() {
        const feed = document.getElementById('followupsFeedDisplay');
        if (!feed || !issue?.id) return;

        const followups = await fetchIssueFollowups(issue.id);
        feed.innerHTML = '';

        if (!followups || followups.length === 0) {
            feed.innerHTML = '<div style="text-align:center; padding:20px; background:white; border-radius:8px; color:#6b7280; font-size:13px;">No historic activity logs documented for this issue thread.</div>';
            return;
        }

        followups.forEach(f => {
            const card = document.createElement('div');
            card.className = 'followup-card';
            card.innerHTML = `
                <div class="followup-card-header">
                    <span class="followup-type-badge">${f.action_type || 'Comment'}</span>
                    <span class="followup-meta-text">By: <strong>${f.action_by || 'N/A'}</strong> on ${f.timestamp ? new Date(f.timestamp).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div class="followup-body-desc">${f.description || ''}</div>
            `;
            card.onclick = () => {
                if (window.openSelectedFollowupInModal) {
                    window.openSelectedFollowupInModal(f);
                }
            };
            feed.appendChild(card);
        });
    }

    await loadFollowupsDisplayFeed();
}
