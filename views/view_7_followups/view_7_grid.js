/* =================================================
FILE: views/view_7_followups/view_7_grid.js
UPDATED: 2026-06-04 08:01:00 PM

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
            .followup-card-header { display:flex; justify-content:between; align-items:center; margin-bottom:8px; border-bottom:1px dashed #e5e7eb; padding-bottom:4px; gap:8px; }
            .followup-type-badge { background:#e0f2fe; color:#0369a1; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase; }
            .followup-meta-text { font-size:11px; color:#6b7280; flex-grow:1; text-align:right; }
            .followup-body-desc { font-size:13px; color:#1f2937; line-height:1.4; word-break:break-word; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="followups-container">
            
            <div style="background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 20px; display: inline-block; font-family: Arial, sans-serif;">
                📍 Base View: VIEW_7_FOLLOWUPS (Logs Dashboard)
            </div>

            <h2 class="followups-title">Issue Logs</h2>
            <p class="followups-subtitle">Thread ID: #${issue?.id || 'N/A'} - ${issue?.title || 'Details View'}</p>
            
            <div class="followups-stack">
                <button id="addNewFollowupBtn" class="followup-btn">➕ Add Activity Log</button>
                <button id="backToIssuesBtn" class="followup-btn followup-btn font-weight-bold followup-btn-secondary">⬅️ Back To Facility Issues</button>
            </div>

            <div id="followupsFeedDisplay" class="followup-feed">
                <span style="color:#6b7280; font-size:13px; font-style:italic; text-align:center;">Loading historical logs...</span>
            </div>
        </div>

        <div id="followupModal" style="display:none; position:fixed; z-index:10000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); box-sizing:border-box;">
            <div style="background:white; max-width:380px; margin:10% auto; padding:20px; border-radius:10px; position:relative; font-family:Arial; box-sizing:border-box;">
                <span id="closeFollowupModal" style="position:absolute; right:15px; top:10px; font-size:22px; cursor:pointer; color:#9ca3af; font-weight:bold;">&times;</span>
                <h3 id="followupModalTitle" style="margin:0 0 5px 0; color:#00264d; font-size:16px; text-transform:uppercase;">Log Action Event</h3>
                
                <div style="background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 4px 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; border-radius: 4px; margin-bottom: 15px; display: inline-block;">
                    🪟 Modal Panel: VIEW_7_POPUP_CONTROLS
                </div>

                <input type="hidden" id="followupId" />
                
                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Action Category</label>
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

                <div id="followup-image-section" style="margin-bottom:15px; padding:10px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; display:none;">
                    <div id="followup-image-container"></div>
                </div>

                <button id="saveFollowupBtn" style="width:100%; background:#28a745; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase; margin-bottom:10px;">Save Activity Entry</button>
                
                <button id="deleteFollowupBtn" style="width:100%; background:#dc3545; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase; display:none;">🗑️ Delete Action Log</button>
            </div>
        </div>
    `;

    // Wired button navigation
    document.getElementById('backToIssuesBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_5_issues', { facility: facility });
        }
    };

    // Toggle Modal Opening
    const modalWrapper = document.getElementById('followupModal');
    document.getElementById('addNewFollowupBtn').onclick = () => {
        document.getElementById('followupId').value = '';
        document.getElementById('actionByInput').value = '';
        document.getElementById('descriptionInput').value = '';
        document.getElementById('actionTypeInput').value = 'Comment';
        document.getElementById('deleteFollowupBtn').style.display = 'none';
        document.getElementById('followupModalTitle').innerText = 'Log Action Event';
        modalWrapper.style.display = 'block';
    };

    document.getElementById('closeFollowupModal').onclick = () => {
        modalWrapper.style.display = 'none';
    };

    // Intercept Modal Save Trigger to present notification options seamlessly
    document.getElementById('saveFollowupBtn').addEventListener('click', () => {
        setTimeout(() => {
            const isModalStillOpen = modalWrapper.style.display === 'block';
            if (!isModalStillOpen) {
                handlePostSaveNotificationPipeline(issue);
            }
        }, 800);
    });

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
                    <span class="followup-type-badge">${f.action_type || f.followup_title || 'Comment'}</span>
                    <span class="followup-meta-text">By: <strong>${f.action_by || f.initiated_by_text || 'N/A'}</strong> on ${f.timestamp || f.created_at ? new Date(f.timestamp || f.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div class="followup-body-desc">${f.description || f.followup_notes_text || ''}</div>
            `;
            card.onclick = () => {
                if (window.openSelectedFollowupInModal) {
                    window.openSelectedFollowupInModal(f);
                } else {
                    document.getElementById('followupId').value = f.id || '';
                    document.getElementById('actionTypeInput').value = f.action_type || 'Comment';
                    document.getElementById('actionByInput').value = f.action_by || f.initiated_by_text || '';
                    document.getElementById('descriptionInput').value = f.description || f.followup_notes_text || '';
                    document.getElementById('deleteFollowupBtn').style.display = 'block';
                    document.getElementById('followupModalTitle').innerText = 'Edit Action Log';
                    modalWrapper.style.display = 'block';
                }
            };
            feed.appendChild(card);
        });
    }

    // Smart Pipeline Checklist implementation
    function handlePostSaveNotificationPipeline(activeIssue) {
        const creatorName = activeIssue?.reported_by || activeIssue?.initiated_by || 'Staff Member';
        
        const notifyPrompt = confirm(`Activity Log Saved!\nWould you like to inform the creator of this issue (${creatorName})?`);
        if (!notifyPrompt) return;

        const methodPicker = prompt(
            `How would you like to notify them?\n\nType "1" for 📱 Text (SMS)\nType "2" for 📧 Email\nType "3" for 📞 Phone Call`, 
            "1"
        );

        const todayTimestamp = new Date().toLocaleDateString();
        const notificationMessageBody = `Hi ${creatorName}, here is a quick maintenance update regarding your reported issue (#${activeIssue?.id || 'Update'}). Status Logged on ${todayTimestamp}: "${activeIssue?.title || 'Details Tracker'}".`;

        // Safe Fallback lookup parsing context
        const contactPhone = activeIssue?.contact_phone || activeIssue?.phone || '';
        const contactEmail = activeIssue?.contact_email || activeIssue?.email || '';

        if (methodPicker === "1") {
            // Native Device Hook up for SMS
            window.location.href = `sms:${contactPhone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(notificationMessageBody)}`;
        } else if (methodPicker === "2") {
            // Native Device Hook up for Mailboxes
            window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Maintenance Thread Progress Update')}&body=${encodeURIComponent(notificationMessageBody)}`;
        } else if (methodPicker === "3") {
            // Direct Dialer Device Line
            window.location.href = `tel:${contactPhone.replace(/[^0-9+]/g, '')}`;
        }
    }

    await loadFollowupsDisplayFeed();
}
