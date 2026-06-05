/* =================================================
FILE: views/view_5_issues/view_5_grid.js
UPDATED: 2026-06-04 10:30:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchFacilityIssues } from './view_5_data.js';
import { setupIssuesEvents, openIssueModal } from './view_5_modal.js';

export async function renderFacilityIssues(facilityContext) {
    const app = document.getElementById('app');
    if (!app) return;

    // Normalize facility object context structure cleanly
    const facility = facilityContext?.facility ? facilityContext.facility : facilityContext;
    
    // Track the currently active selected issue object for deletion context scoping
    let activeSelectedIssue = null;

    const styles = `
        <style>
            .issues-container { padding: 20px; font-family: Arial, sans-serif; background: #f3f4f6; min-height: 100vh; text-align: center; box-sizing: border-box; }
            .issues-title { color: #00264d; font-size: 22px; text-transform: uppercase; margin: 0 0 5px 0; }
            .issues-subtitle { color: #4b5563; margin: 0 0 20px 0; font-size: 14px; text-transform: uppercase; }
            .issue-btn-main { background: #28a745; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; text-transform: uppercase; width: 100%; max-width: 400px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .issue-btn-main:hover { background: #218838; }
            .issue-list-feed { display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto 25px auto; text-align: left; }
            .issue-card-item { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #00264d; cursor: pointer; position: relative; }
            .issue-card-item:hover { transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0,0,0,0.12); }
            .issue-card-title { font-size: 15px; font-weight: bold; color: #00264d; margin: 0 0 4px 0; }
            .issue-card-meta { font-size: 11px; color: #6b7280; }
            .issue-card-badge { position: absolute; right: 15px; top: 15px; background: #fff3cd; color: #856404; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
            .issue-btn-back { background: #00264d; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; text-transform: uppercase; width: 100%; max-width: 400px; }
            .issue-btn-back:hover { background: #001a33; }
            .issue-modal-btn-danger { background: #dc2626; color: white; border: none; padding: 11px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px; text-transform: uppercase; width: 100%; margin-top: 8px; box-sizing: border-box; }
            .issue-modal-btn-danger:hover { background: #b91c1c; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="issues-container">
            <div style="background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 20px; display: inline-block;">
                📍 Base View: VIEW_5_ISSUES (Facility Issue Tracker Grid)
            </div>

            <h2 class="issues-title">Standard Facility Issues</h2>
            <p class="issues-subtitle">${facility?.name || 'GMS'}</p>

            <button id="fileNewIssueReportBtn" class="issue-btn-main">➕ File New Issue Report</button>

            <div id="facilityIssuesFeed" class="issue-list-feed">
                <span style="color:#6b7280; font-size:13px; font-style:italic; text-align:center;">Loading tracking items...</span>
            </div>

            <button id="backToControlsBtn" class="issue-btn-back">⬅️ Back To Controls</button>
        </div>

        <div id="issueModal" style="display:none; position:fixed; z-index:10000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); box-sizing:border-box;">
            <div style="background:white; max-width:380px; margin:8% auto; padding:20px; border-radius:10px; position:relative; font-family:Arial; box-sizing:border-box;">
                <span id="closeIssueModal" style="position:absolute; right:15px; top:10px; font-size:22px; cursor:pointer; color:#9ca3af; font-weight:bold;">&times;</span>
                <h3 id="issueModalTitle" style="margin:0 0 5px 0; color:#00264d; font-size:16px; text-transform:uppercase;">Maintenance Request</h3>
                
                <input type="hidden" id="issueId" />
                
                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-top:12px; margin-bottom:4px; text-transform:uppercase;">Issue Request Title</label>
                <input type="text" id="issueTitleInput" style="width:100%; padding:9px; margin-bottom:10px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;" />

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Assign / Link Contact</label>
                <div style="display:flex; gap:6px; margin-bottom:10px;">
                    <select id="issueContactSelect" style="flex-grow:1; padding:9px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; background:#f9fafb; max-width:75%;"></select>
                    <button id="addInlineContactLink" style="background:#0369a1; color:white; border:none; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; padding:0 8px;">+ New</button>
                </div>

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Priority Severity</label>
                <select id="issuePriorityInput" style="width:100%; padding:9px; margin-bottom:10px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; background:#f9fafb;">
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Severity</option>
                    <option value="High">High Urgency</option>
                </select>

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Workflow Status</label>
                <select id="issueStatusInput" style="width:100%; padding:9px; margin-bottom:10px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; background:#f9fafb;">
                    <option value="Open">Open / Unresolved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Closed / Resolved</option>
                </select>

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Problem Description</label>
                <textarea id="issueDescInput" rows="3" style="width:100%; padding:9px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; font-family:Arial; box-sizing:border-box; resize:vertical;"></textarea>

                <div id="issue-image-container" style="margin-bottom:15px;"></div>

                <button id="saveIssueBtn" style="width:100%; background:#28a745; color:white; border:none; padding:11px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px; text-transform:uppercase;">Save Request</button>
                <button id="deleteIssueRequestBtn" class="issue-modal-btn-danger" style="display:none;">🗑️ Delete Request</button>
            </div>
        </div>
    `;

    // 1. Wire up the top-level button event hooks
    document.getElementById('fileNewIssueReportBtn').onclick = () => {
        activeSelectedIssue = null;
        openIssueModal(facility, null);
        document.getElementById('issueModalTitle').innerText = 'Maintenance Request';
        document.getElementById('deleteIssueRequestBtn').style.display = 'none';
    };

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_2_controls', { facility: facility });
    };

    // Global unified listener setup for the deletion button to prevent asynchronous bubble leaks
// Global unified listener setup for the deletion button to prevent asynchronous bubble leaks
    document.getElementById('deleteIssueRequestBtn').onclick = async () => {
        if (!activeSelectedIssue) return;
        
        const targetTitle = activeSelectedIssue.issue_title || activeSelectedIssue.title || 'Maintenance Request';
        
        if (confirm(`Are you completely sure you want to permanently delete the issue "${targetTitle}"? This will clear all recorded progress records.`)) {
            try {
                if (window.supabase) {
                    // 1. First, clear out any linked child rows from the followups table to stop constraint errors
                    await window.supabase
                        .from('facility_issues_followup')
                        .delete()
                        .eq('issue_id', activeSelectedIssue.id);

                    // 2. Also clear alternative followup tables just in case
                    await window.supabase
                        .from('issue_followups')
                        .delete()
                        .eq('issue_id', activeSelectedIssue.id);

                    // 3. Now delete the main parent issue safely
                    const { error } = await window.supabase
                        .from('facility_issues')
                        .delete()
                        .eq('id', activeSelectedIssue.id);

                    if (error) throw error;
                } else if (window.crudEngine && window.crudEngine.deleteRow) {
                    await window.crudEngine.deleteRow('facility_issues', activeSelectedIssue.id);
                } else if (window.deleteFacilityIssueRecord) {
                    await window.deleteFacilityIssueRecord(activeSelectedIssue.id);
                }
                
                // Close overlay cleanly, then immediately re-pull clean context metrics from data tier
                document.getElementById('issueModal').style.display = 'none';
                await loadIssuesFeedList();
            } catch (err) {
                console.error("Database Delete Error Details:", err);
                alert("Failed to successfully remove the selected maintenance issue database entry.");
            }
        }
    };
    // 2. Initialize input interaction parameters from modal layer
    setupIssuesEvents(facility, renderFacilityIssues);

    // 3. Build and render the underlying issues card elements feed async
    async function loadIssuesFeedList() {
        const feedContainer = document.getElementById('facilityIssuesFeed');
        if (!feedContainer || !facility?.id) return;

        const issues = await fetchFacilityIssues(facility.id);
        feedContainer.innerHTML = '';

        if (!issues || issues.length === 0) {
            feedContainer.innerHTML = `
                <div style="text-align:center; padding:20px; background:white; border-radius:8px; color:#6b7280; font-size:13px;">
                    No tracked issues documented for this facility.
                </div>`;
            return;
        }

        issues.forEach(issueItem => {
            const card = document.createElement('div');
            card.className = 'issue-card-item';

            // Check variants to clean up reporter text assignments
            const reporter = issueItem.reported_by || issueItem.initiated_by || issueItem.reported_by_text || 'Staff';
            
            // Extract the actual custom issue context title cleanly
            const issueTitle = issueItem.issue_title || issueItem.title || 'Maintenance Request';

            let dateString = 'Recent';
            if (issueItem.created_at) {
                try {
                    dateString = new Date(issueItem.created_at).toLocaleDateString();
                } catch (e) {}
            }

            card.innerHTML = `
                <span class="issue-card-badge">${issueItem.status || 'Open'}</span>
                <div class="issue-card-title">${issueTitle}</div>
                <div class="issue-card-meta">Priority: <strong>${issueItem.severity || 'Medium'}</strong> | By: ${reporter}</div>
                <div class="issue-card-meta" style="margin-top:2px; color:#9ca3af;">Reported: ${dateString}</div>
            `;

            // Clicking an individual card context opens the modal with updated issue titles and delete hooks
            card.onclick = () => {
                activeSelectedIssue = issueItem;
                openIssueModal(facility, issueItem);
                
                // Dynamically transform modal heading text target to explicitly show issue details title
                const modalHeaderEl = document.getElementById('issueModalTitle');
                if (modalHeaderEl) {
                    modalHeaderEl.innerText = issueTitle;
                }

                // Show the custom delete action button safely
                const deleteBtn = document.getElementById('deleteIssueRequestBtn');
                if (deleteBtn) {
                    deleteBtn.style.display = 'block';
                }
            };

            feedContainer.appendChild(card);
        });
    }

    await loadIssuesFeedList();
}
