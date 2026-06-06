/* =================================================
FILE: views/view_5_issues/view_5_grid.js
UPDATED: 2026-06-05 09:25:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
const __FILENAME = 'view_5_grid.js';

import { fetchFacilityIssues, insertFacilityIssue } from './view_5_data.js';

export async function renderFacilityIssues(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    const styles = `
        <style>
            .issues-view-container { padding:20px; font-family:Arial; min-height:100vh; background:#f3f4f6; text-align:center; box-sizing:border-box; }
            .issues-card-wrapper { max-width:500px; margin:0 auto; background:white; border-radius:12px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05); }
            .issues-view-title { color:#00264d; font-size:24px; font-weight:bold; margin-bottom:5px; text-transform:uppercase; }
            .issues-view-subtitle { color:#6b7280; font-size:14px; margin-bottom:20px; }
            .issues-view-btn { width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px; text-transform:uppercase; box-sizing:border-box; }
            .btn-navy { background:#00264d; color:white; }
            .btn-emerald { background:#10b981; color:white; margin-bottom:12px; }
            .btn-gray { background:#9ca3af; color:white; }
            .issues-list-layout { margin:20px 0; text-align:left; display:flex; flex-direction:column; gap:10px; }
            .issue-list-item { background:#f9fafb; border:1px solid #e5e7eb; padding:15px; border-radius:8px; cursor:pointer; }
            .issue-list-title { font-weight:bold; color:#00264d; font-size:15px; }
            .issue-list-meta { font-size:12px; color:#6b7280; margin-top:4px; }
            
            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; }
            .modal-shell-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; margin-bottom:15px; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-bottom:15px; text-align:center; padding:4px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="issues-view-container">
            <div class="issues-card-wrapper">
                <h1 class="issues-view-title">Maintenance Requests</h1>
                <p class="issues-view-subtitle">${facility?.name || ''}</p>

                <div class="view-build-stamp">
                    File: views/view_5_issues/view_5_grid.js<br>Updated: 2026-06-05 09:25:00 PM
                </div>

                <button id="addIssueTriggerBtn" class="issues-view-btn btn-emerald">➕ Create Maintenance Request</button>
                <div id="issuesListElement" class="issues-list-layout">Loading issues...</div>
                <button id="backToControlsBtn" class="issues-view-btn btn-navy">⬅️ Back to Controls</button>
            </div>

            <div id="issueFormModal" class="modal-mask">
                <div class="modal-shell">
                    <h3 class="modal-shell-title">Report Maintenance Issue</h3>
                    
                    <label class="form-field-label">Issue Title / Subject</label>
                    <input type="text" id="issueFormTitle" class="form-field-input" placeholder="e.g. Broken AC in Lounge">

                    <label class="form-field-label">Description / Details</label>
                    <textarea id="issueFormDesc" class="form-field-input" style="height:70px; resize:none;"></textarea>

                    <label class="form-field-label">Reported By</label>
                    <input type="text" id="issueFormReporter" class="form-field-input" placeholder="Your Full Name">

                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="submitIssueFormBtn" class="issues-view-btn btn-navy">Submit Request</button>
                        <button id="closeIssueFormBtn" class="issues-view-btn btn-gray">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('issueFormModal');

    document.getElementById('addIssueTriggerBtn').onclick = () => {
        document.getElementById('issueFormTitle').value = '';
        document.getElementById('issueFormDesc').value = '';
        document.getElementById('issueFormReporter').value = '';
        modal.style.display = 'flex';
    };

    document.getElementById('closeIssueFormBtn').onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_2_controls', { facility: facility });
    };

    document.getElementById('submitIssueFormBtn').onclick = async () => {
        const title = document.getElementById('issueFormTitle').value.trim();
        const desc = document.getElementById('issueFormDesc').value.trim();
        const reporter = document.getElementById('issueFormReporter').value.trim();

        if (!title || !reporter) {
            alert("Subject and Reporter fields are required.");
            return;
        }

        const inserted = await insertFacilityIssue({
            facility_id: facility.id,
            title: title,
            description: desc,
            reported_by: reporter,
            status: 'Open'
        });

        if (inserted) {
            modal.style.display = 'none';
            await loadIssuesListData();
        } else {
            alert("Could not register maintenance request data.");
        }
    };

    async function loadIssuesListData() {
        if (!facility?.id) return;
        const listElement = document.getElementById('issuesListElement');
        if (!listElement) return;

        const issues = await fetchFacilityIssues(facility.id);
        listElement.innerHTML = '';

        if (!issues || issues.length === 0) {
            listElement.innerHTML = '<div style="text-align:center; color:#9ca3af; font-size:14px; padding:20px;">No ongoing requests logged.</div>';
            return;
        }

        issues.forEach(issue => {
            const row = document.createElement('div');
            row.className = 'issue-list-item';
            row.innerHTML = `
                <div class="issue-list-title">${issue.title}</div>
                <div class="issue-list-meta">Status: <b>${issue.status || 'Open'}</b> | Reported by: ${issue.reported_by || 'Unknown'}</div>
            `;
            listElement.appendChild(row);
        });
    }

    // FIXED: Intercept contextual payloads sent from the profile view
    if (data?.openFormInstantly) {
        document.getElementById('issueFormTitle').value = '';
        document.getElementById('issueFormDesc').value = '';
        
        // Auto-assign the reporter input value cleanly 
        if (data?.prefilledReporterName) {
            document.getElementById('issueFormReporter').value = data.prefilledReporterName;
        }
        
        modal.style.display = 'flex';
    }

    await loadIssuesListData();
}
