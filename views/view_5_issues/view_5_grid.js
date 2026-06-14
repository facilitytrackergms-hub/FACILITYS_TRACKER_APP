/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_grid.js
SUPABASE TBL : facility_issues
VIEW NAME    : Maintenance Requests
POP-UP TITLE : Report Maintenance Issue
LAST UPDATED : 2026-06-14 @ EVENT DELEGATION SUBMISSION FIX
================================================================*/

import { fetchFacilityIssues, insertFacilityIssue, deleteFacilityIssue } from './view_5_data.js';
import { openIssueModal, setupIssuesEvents } from './view_5_modal.js';
import { fetchContacts } from '../view_3_contacts/view_3_data.js';

export async function renderFacilityIssues(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;
    const prefilledReporterName = data?.prefilledReporterName || '';
    const openFormInstantly = data?.openFormInstantly || false;

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
            .btn-delete-danger { background:red !important; color:white !important; font-weight:bold !important; }
            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); max-height:90vh; overflow-y:auto; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .custom-confirm-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:100; padding:15px; }
            .custom-confirm-box { background:white; border-radius:10px; padding:20px; width:100%; max-width:360px; text-align:center; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="issues-view-container">
            <div class="issues-card-wrapper">
                <h1 class="issues-view-title">Maintenance Requests</h1>
                <p class="issues-view-subtitle">${facility?.name || ''}</p>
                <button id="addIssueTriggerBtn" class="issues-view-btn btn-emerald">➕ Create Maintenance Request</button>
                <button id="backToControlsBtn" class="issues-view-btn btn-navy" style="margin-bottom:12px;">⬅️ Back to Controls</button>
                <div id="issuesListElement" class="issues-list-layout">Loading issues...</div>
            </div>
            <div id="issueFormModal" class="modal-mask">
                <div class="modal-shell">
                    <h3>Report Maintenance Issue</h3>
                    <label class="form-field-label">Issue Title</label>
                    <input type="text" id="issueFormTitle" class="form-field-input">
                    <label class="form-field-label">Description</label>
                    <textarea id="issueFormDesc" class="form-field-input" style="height:70px;"></textarea>
                    <label class="form-field-label">Reported By</label>
                    <input type="text" id="issueFormReporter" class="form-field-input">
                    <button id="submitIssueFormBtn" class="issues-view-btn btn-navy" style="margin-top:20px;">Submit Request</button>
                    <button id="closeIssueFormBtn" class="issues-view-btn btn-gray" style="margin-top:8px;">Cancel</button>
                </div>
            </div>
            <div id="issueModal" class="modal-mask">
                <div class="modal-shell">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3>Issue Dashboard</h3>
                        <button id="deleteIssueRequestBtn" style="background:none; border:none; font-size:24px; cursor:pointer; color:red;">🗑️</button>
                    </div>
                    <input type="hidden" id="issueId">
                    <button id="closeIssueModal" class="issues-view-btn btn-gray" style="margin-top:20px;">Back to Issues</button>
                </div>
            </div>
            <div id="view_5_grid_contact_confirm_dialog" class="custom-confirm-mask">
                <div class="custom-confirm-box">
                    <p>Do you really want to delete this maintenance request?</p>
                    <button id="view_5_grid_confirm_yes" class="btn-delete-danger" style="padding:10px;">Yes</button>
                    <button id="view_5_grid_confirm_no" class="btn-gray" style="padding:10px;">No</button>
                </div>
            </div>
        </div>
    `;

    // DELEGATED EVENT BINDING: This works even if the DOM is refreshed
    app.addEventListener('click', async (e) => {
        // Submit Logic
        if (e.target.id === 'submitIssueFormBtn') {
            const title = document.getElementById('issueFormTitle').value;
            const description = document.getElementById('issueFormDesc').value;
            const reported_by = document.getElementById('issueFormReporter').value;
            if (!title.trim()) return;
            const res = await insertFacilityIssue({ facility_id: facility.id, title, description, reported_by });
            if (!res?.error) {
                document.getElementById('issueFormModal').style.display = 'none';
                await loadIssuesListData();
            }
        }
        // Delete Logic
        if (e.target.id === 'deleteIssueRequestBtn') document.getElementById('view_5_grid_contact_confirm_dialog').style.display = 'flex';
        if (e.target.id === 'view_5_grid_confirm_no') document.getElementById('view_5_grid_contact_confirm_dialog').style.display = 'none';
        if (e.target.id === 'view_5_grid_confirm_yes') {
            const id = document.getElementById('issueId').value;
            await deleteFacilityIssue(id);
            document.getElementById('view_5_grid_contact_confirm_dialog').style.display = 'none';
            document.getElementById('issueModal').style.display = 'none';
            await loadIssuesListData();
        }
        // UI Navigation Logic
        if (e.target.id === 'addIssueTriggerBtn') document.getElementById('issueFormModal').style.display = 'flex';
        if (e.target.id === 'closeIssueFormBtn') document.getElementById('issueFormModal').style.display = 'none';
        if (e.target.id === 'closeIssueModal') document.getElementById('issueModal').style.display = 'none';
        if (e.target.id === 'backToControlsBtn') if (window.navigateTo) window.navigateTo('view_2_controls', { facility });
    });

    // Initial Load Logic
    if (openFormInstantly) {
        document.getElementById('issueFormModal').style.display = 'flex';
        document.getElementById('issueFormReporter').value = prefilledReporterName;
    }

    async function loadIssuesListData() {
        const listElement = document.getElementById('issuesListElement');
        const issues = await fetchFacilityIssues(facility.id);
        listElement.innerHTML = '';
        issues?.forEach(issue => {
            const row = document.createElement('div');
            row.className = 'issue-list-item';
            row.onclick = () => {
                document.getElementById('issueId').value = issue.id;
                document.getElementById('issueModal').style.display = 'flex';
            };
            row.innerHTML = `<div>${issue.title}</div>`;
            listElement.appendChild(row);
        });
    }

    await loadIssuesListData();
}
