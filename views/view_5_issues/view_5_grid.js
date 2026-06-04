/* =================================================
FILE: views/view_5_issues/view_5_grid.js
UPDATED: 2026-06-04 02:00:00 AM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchFacilityIssues } from './view_5_data.js';
import { setupIssuesEvents } from './view_5_modal.js';

export async function renderFacilityIssues(facility) {
    const app = document.getElementById('app');
    if (!app) return;

    const styles = `
        <style>
            .issues-container { padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing:border-box; }
            .issues-title { color:#00264d; font-size:22px; text-transform:uppercase; margin:0 0 5px 0; }
            .issues-subtitle { color:#4b5563; margin:0 0 25px 0; font-size:14px; text-transform:uppercase; }
            .issues-stack { display:flex; flex-direction:column; gap:12px; max-width:400px; margin:0 auto; }
            .issue-btn { background:#28a745; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase; letter-spacing:0.5px; width:100%; box-shadow:0 2px 4px rgba(0,0,0,0.1); margin-bottom:20px; }
            .issue-btn:hover { background:#218838; }
            .issue-feed { margin-top:10px; text-align:left; display:flex; flex-direction:column; gap:12px; max-width:400px; margin-left:auto; margin-right:auto; }
            .issue-card { background:white; padding:15px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); border-left:4px solid #00264d; cursor:pointer; position:relative; }
            .issue-card-title { font-weight:bold; color:#00264d; font-size:15px; margin-bottom:4px; }
            .issue-meta { font-size:11px; color:#6b7280; }
            .status-badge { position:absolute; right:15px; top:15px; font-size:10px; font-weight:bold; padding:3px 8px; border-radius:20px; text-transform:uppercase; }
            .status-open { background:#fff3cd; color:#856404; }
            .status-closed { background:#d4edda; color:#155724; }
            
            /* Modal Styles */
            .modal-label { display:block; font-size:11px; font-weight:bold; color:#4b5563; margin-bottom:4px; text-transform:uppercase; margin-top:12px; text-align:left; }
            .modal-input { width:100%; padding:10px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box; background:#ffffff; }
            .modal-select { width:100%; padding:10px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box; background:#ffffff; height:40px; }
            .btn-action { width:100%; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase; margin-top:10px; box-sizing:border-box; display:block; text-align:center; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="issues-container">
            
            <div style="background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 15px; display: inline-block; font-family: Arial, sans-serif;">
                📍 Base View: VIEW_5_ISSUES (Facility Issue Tracker Grid)
            </div>

            <h2 class="issues-title">Standard Facility Issues</h2>
            <p class="issues-subtitle">${facility?.name || 'FAC'}</p>
            
            <div class="issues-stack">
                <button id="createNewIssueBtn" class="issue-btn">➕ File New Issue Report</button>
            </div>

            <div id="issuesFeedDisplay" class="issue-feed">
                <span style="color:#6b7280; font-size:13px; font-style:italic; text-align:center;">Loading issues...</span>
            </div>
        </div>

        <div id="issueModal" style="display:none; position:fixed; z-index:10000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); overflow-y:auto; padding:20px 10px; box-sizing:border-box;">
            <div style="background:white; max-width:440px; margin:1.5rem auto; padding:24px; border-radius:12px; position:relative; font-family:Arial; box-shadow:0 10px 25px rgba(0,0,0,0.2); box-sizing:border-box;">
                <span id="closeIssueModal" style="position:absolute; right:20px; top:15px; font-size:24px; cursor:pointer; color:#9ca3af; font-weight:bold;">&times;</span>
                
                <h3 id="issueModalTitle" style="margin:0 0 4px 0; color:#00264d; font-size:18px; font-weight:bold; text-align:left;">Modify Issue Entry Fields</h3>
                <p id="issueModalTimestamp" style="margin:0 0 10px 0; font-size:11px; color:#6b7280; font-style:italic; text-align:left; display:none;"></p>
                
                <div style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; padding: 4px 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; border-radius: 4px; margin-bottom: 12px; display: inline-block; text-align:left;">
                    🪟 Modal Panel: VIEW_5_POPUP_CONTROLS
                </div>

                <input type="hidden" id="issueId" />
                
                <label class="modal-label">Issue Summary / Description</label>
                <textarea id="issueDescription" rows="3" class="modal-input" placeholder="Type what requires repair..."></textarea>

                <label class="modal-label">Reported By (Contact Name)</label>
                <input type="text" id="issueInitiatedBy" class="modal-input" placeholder="Type name to select or create directory row" />

                <label class="modal-label">Current Operational Status</label>
                <select id="issueStatus" class="modal-select">
                    <option value="Open">Open / Active</option>
                    <option value="Closed">Closed / Resolved</option>
                </select>

                <label class="modal-label">Urgency Priority Level</label>
                <select id="issuePriority" class="modal-select">
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                </select>

                <div style="margin-top:16px; border-top:1px dashed #e5e7eb; padding-top:12px; text-align:left;">
                    <span style="color:#28a745; font-size:11px; font-weight:bold; text-transform:uppercase; display:block; margin-bottom:4px;">Linked Issue Asset Photos</span>
                    <strong style="font-size:13px; color:#00264d; display:block; margin-bottom:6px;">Issue Photos</strong>
                    <div id="issue-image-section" style="display:none; margin-bottom:10px;"><div id="issue-image-container"></div></div>
                    <button id="addAssetPhotoBtn" class="btn-action" style="background:#28a745; color:white; margin-top:4px;">➕ Add Asset Photo Link</button>
                </div>

                <div style="margin-top:20px; display:flex; flex-direction:column; gap:2px;">
                    <button id="saveIssueBtn" class="btn-action" style="background:#00264d; color:white; font-size:14px; letter-spacing:0.5px;">Update Info</button>
                    <button id="issueFollowupsBtn" class="btn-action" style="background:#ffc107; color:#212529; font-size:14px;">💭 Follow-ups</button>
                    <button id="backToControlsBtn" class="btn-action" style="background:#6c757d; color:white; font-size:14px;">Close Panel</button>
                    
                    <button id="deleteIssueBtn" class="btn-action" style="background:#dc3545; color:white; font-size:14px; margin-top:12px; display:none;">🗑️ Delete Entire Record</button>
                </div>
            </div>
        </div>

        <div id="customAlertModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; justify-content:center; align-items:center; font-family:Arial, sans-serif; padding:15px; box-sizing:border-box;">
            <div style="background:white; border-radius:12px; max-width:380px; width:100%; padding:24px; text-align:center; box-sizing:border-box; box-shadow:0 10px 25px rgba(0,0,0,0.3);">
                <div id="alertIcon" style="font-size:36px; margin-bottom:8px;">⚠️</div>
                <h3 id="alertTitle" style="margin:0 0 6px 0; color:#00264d; font-size:18px;">Notice</h3>
                <p id="alertMessage" style="margin:0 0 20px 0; font-size:13px; color:#4b5563; line-height:1.4;"></p>
                <button id="alertCloseBtn" style="background:#00264d; color:white; border:none; padding:10px 24px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase; width:100%;">OK</button>
            </div>
        </div>
    `;

    setupIssuesEvents(facility, renderFacilityIssues);

    async function loadIssuesGridFeed() {
        const feed = document.getElementById('issuesFeedDisplay');
        if (!feed) return;

        const issues = await fetchFacilityIssues(facility.id);
        feed.innerHTML = '';

        if (!issues || issues.length === 0) {
            feed.innerHTML = '<div style="text-align:center; padding:25px; background:white; border-radius:8px; color:#6b7280; font-size:13px;">No logged problems reported at this site location.</div>';
            return;
        }

        issues.forEach(item => {
            const card = document.createElement('div');
            card.className = 'issue-card';
            
            const isClosed = (item.status === 'Closed' || item.status === 'Closed / Resolved');
            const badgeClass = isClosed ? 'status-badge status-closed' : 'status-badge status-open';
            const badgeText = isClosed ? 'Closed' : 'Open';

            card.innerHTML = `
                <div class="${badgeClass}">${badgeText}</div>
                <div class="issue-card-title">${item.description || 'Untitled Issue'}</div>
                <div class="issue-meta">
                    Priority: <strong>${item.priority || 'Medium'}</strong> | By: ${item.initiated_by || item.reported_by || 'Staff'}
                </div>
                <div class="issue-meta" style="margin-top:4px; font-size:10px; color:#9ca3af;">
                    Reported: ${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                </div>
            `;

            card.onclick = () => {
                if (window.openSelectedIssueInModal) {
                    window.openSelectedIssueInModal(item);
                }
            };

            feed.appendChild(card);
        });
    }

    await loadIssuesGridFeed();
}
