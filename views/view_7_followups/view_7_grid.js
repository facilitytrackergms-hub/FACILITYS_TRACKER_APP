/* =================================================
FILE: views/view_7_followups/view_7_grid.js
UPDATED: 2026-06-04 08:15:00 PM

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
            .followup-btn { background:#00264d; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; width:100%; box-shadow:0 2px 4px rgba(0,0,0,0.1); }
            .followup-btn:hover { background:#001a33; }
            .followup-btn-secondary { background:#4b5563; color:white; margin-top:8px; }
            .followup-btn-secondary:hover { background:#374151; }
            .followup-feed { margin-top:25px; text-align:left; display:flex; flex-direction:column; gap:10px; max-width:400px; margin-left:auto; margin-right:auto; }
            .followup-card { background:white; padding:15px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); border-left:4px solid #00264d; cursor:pointer; transition:transform 0.1s ease; }
            .followup-card:hover { transform:translateY(-1px); box-shadow:0 3px 6px rgba(0,0,0,0.12); }
            .followup-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px dashed #e5e7eb; padding-bottom:4px; gap:8px; }
            .followup-type-badge { background:#e0f2fe; color:#0369a1; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase; }
            .followup-meta-text { font-size:11px; color:#6b7280; flex-grow:1; text-align:right; }
            .followup-body-desc { font-size:13px; color:#1f2937; line-height:1.4; word-break:break-word; }
            .followup-thumb-img { width:100%; max-height:180px; object-fit:cover; border-radius:6px; margin-top:10px; border:1px solid #e5e7eb; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="followups-container">
            <div style="background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 20px; display: inline-block;">
                📍 Base View: VIEW_7_FOLLOWUPS (Logs Dashboard)
            </div>

            <h2 class="followups-title">Issue Logs</h2>
            <p class="followups-subtitle">Thread ID: #${issue?.id || 'N/A'} - ${issue?.title || 'Details View'}</p>
            
            <div class="followups-stack">
                <button id="addNewFollowupBtn" class="followup-btn">➕ Add Activity Log</button>
                <button id="backToIssuesBtn" class="followup-btn followup-btn-secondary">⬅️ Back To Facility Issues</button>
            </div>

            <div id="followupsFeedDisplay" class="followup-feed">
                <span style="color:#6b7280; font-size:13px; font-style:italic; text-align:center;">Loading historical logs...</span>
            </div>
        </div>

        <div id="followupModal" style="display:none; position:fixed; z-index:10000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); box-sizing:border-box;">
            <div style="background:white; max-width:380px; margin:5% auto; padding:20px; border-radius:10px; position:relative; font-family:Arial; box-sizing:border-box;">
                <span id="closeFollowupModal" style="position:absolute; right:15px; top:10px; font-size:22px; cursor:pointer; color:#9ca3af; font-weight:bold;">&times;</span>
                <h3 id="followupModalTitle" style="margin:0 0 5px 0; color:#00264d; font-size:16px; text-transform:uppercase;">Log Action Event</h3>
                
                <input type="hidden" id="followupId" />
                <input type="hidden" id="followupImageUrl" value="" />
                
                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-top:12px; margin-bottom:4px; text-transform:uppercase;">Action Category</label>
                <select id="actionTypeInput" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; background:#f9fafb;">
                    <option value="Comment">Comment / Note</option>
                    <option value="Inspection">Site Inspection</option>
                    <option value="Repair Step">Repair Action Item</option>
                    <option value="Resolution">Final Resolution Code</option>
                </select>

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Executed By / Reporter</label>
                <input type="text" id="actionByInput" placeholder="Enter full identity name" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;" />

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Detailed Description Summary</label>
                <textarea id="descriptionInput" rows="4" placeholder="Describe findings, progress updates, or changes made..." style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; font-family:Arial; resize:vertical; box-sizing:border-box;"></textarea>

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Follow-up Media Capture</label>
                <div id="followup-image-section" style="margin-bottom:15px; padding:10px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px;">
                    <div id="followup-image-container"></div>
                </div>

                <button id="saveFollowupBtn" style="width:100%; background:#28a745; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase;">Save Activity Entry</button>
            </div>
        </div>
    `;

    document.getElementById('backToIssuesBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_5_issues', { facility: facility });
    };

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
            
            const imageMarkup = f.followup_image_url ? `<img src="${f.followup_image_url}" class="followup-thumb-img" alt="Attached evidence">` : '';
            
            card.innerHTML = `
                <div class="followup-card-header">
                    <span class="followup-type-badge">${f.followup_title || 'Comment'}</span>
                    <span class="followup-meta-text">By: <strong>${f.initiated_by_text || 'N/A'}</strong></span>
                </div>
                <div class="followup-body-desc">${f.followup_notes_text || ''}</div>
                ${imageMarkup}
            `;
            
            card.onclick = () => {
                if (window.openSelectedFollowupInModal) window.openSelectedFollowupInModal(f);
            };
            feed.appendChild(card);
        });
    }

    await loadFollowupsDisplayFeed();
}

// Global hook triggered from modal saving routine to prompt alerts cleanly
window.triggerNotificationPipelinePrompt = function(savedLog, currentIssue) {
    const creator = savedLog.reported_by_name || currentIssue.reported_by || currentIssue.initiated_by || 'Staff Member';
    const phone = currentIssue.contact_phone || currentIssue.phone || '';
    const email = currentIssue.contact_email || currentIssue.email || '';
    
    const wantsToNotify = confirm(`Activity Log Saved!\nWould you like to inform the creator of this issue (${creator})?`);
    if (!wantsToNotify) return;

    const method = prompt(`How would you like to notify them?\n\nType "1" for 📱 Text (SMS)\nType "2" for 📧 Email\nType "3" for 📞 Phone Call`, "1");
    
    let message = `Hi ${creator}, update on your issue (#${currentIssue.id || 'Log'}): "${savedLog.followup_title} - ${savedLog.followup_notes_text}".`;
    if (savedLog.followup_image_url) {
        message += ` View Photo Proof: ${savedLog.followup_image_url}`;
    }

    if (method === "1") {
        window.location.href = `sms:${phone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(message)}`;
    } else if (method === "2") {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent('Maintenance Progress Update')}&body=${encodeURIComponent(message)}`;
    } else if (method === "3") {
        window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
    }
};
