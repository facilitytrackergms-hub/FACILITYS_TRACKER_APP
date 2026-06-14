/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_grid.js
SUPABASE TBL : facility_issues
VIEW NAME    : Maintenance Requests
POP-UP TITLE : Report Maintenance Issue
LAST UPDATED : 2026-06-14 @ FINAL LOCKED UPDATE
================================================================*/

import { fetchFacilityIssues, insertFacilityIssue, deleteFacilityIssue, updateFacilityIssue } from './view_5_data.js';
import { openIssueModal, setupIssuesEvents } from './view_5_modal.js';
import { fetchContacts } from '../view_3_contacts/view_3_data.js';

export async function renderFacilityIssues(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;
    const prefilledReporterName = data?.prefilledReporterName || '';
    const openFormInstantly = data?.openFormInstantly || false;
    let localContactsCache = [];

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
            .btn-delete-danger { background:red !important; color:yellow !important; font-weight:bold !important; border:2px solid #b30000 !important; }

            .issues-list-layout { margin:20px 0; text-align:left; display:flex; flex-direction:column; gap:10px; }
            .issue-list-item { background:#f9fafb; border:1px solid #e5e7eb; padding:15px; border-radius:8px; cursor:pointer; }
            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; max-height:90vh; overflow-y:auto; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .combobox-container { position:relative; display:block; width:100%; }
            .combobox-select-underlay { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; background:white; }
            .combobox-input-overlay { position:absolute; top:5px; left:1px; width:calc(100% - 32px); margin:0; padding:10px; border:none; outline:none; }
            .custom-confirm-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:100; padding:15px; }
            .custom-confirm-box { background:white; border-radius:10px; padding:20px; width:100%; max-width:360px; text-align:center; }
            .custom-confirm-msg { font-size:14px; color:#374151; margin-bottom:20px; }
            .custom-confirm-actions { display:flex; gap:10px; justify-content:center; }
            .custom-confirm-btn { padding:10px 20px; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; min-width:80px; }
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
                    <h3 class="modal-shell-title">Create New Maintenance Request</h3>
                    <label class="form-field-label">Issue Title / Subject</label>
                    <input type="text" id="issueFormTitle" class="form-field-input">
                    <label class="form-field-label">Description / Details</label>
                    <textarea id="issueFormDesc" class="form-field-input" style="height:70px; resize:none;"></textarea>
                    <label class="form-field-label">Reported By</label>
                    <div class="combobox-container">
                        <select id="issueFormReporterSelect" class="combobox-select-underlay"></select>
                        <input type="text" id="issueFormReporter" class="combobox-input-overlay">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="submitIssueFormBtn" class="issues-view-btn btn-navy">Submit Request</button>
                        <button id="closeIssueFormBtn" class="issues-view-btn btn-gray">Cancel</button>
                    </div>
                </div>
            </div>

            <div id="issueModal" class="modal-mask">
                <div class="modal-shell">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 id="issueModalTitle" class="modal-shell-title">Follow Up Maintenance Request View</h3>
                        <button id="deleteIssueRequestBtn" style="background:none; border:none; font-size:24px; cursor:pointer; color:red;">🗑️</button>
                    </div>
                    <input type="hidden" id="issueId">
                    <label class="form-field-label">Issue Title / Subject</label>
                    <input type="text" id="issueTitleInput" class="form-field-input">
                    <label class="form-field-label">Description / Details</label>
                    <textarea id="issueDescInput" class="form-field-input"></textarea>
                    
                    <label class="form-field-label">Status</label>
                    <select id="issueStatusInput" class="form-field-input">
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <label class="form-field-label">Parts Needed</label>
                    <input type="text" id="issuePartsInput" class="form-field-input">
                    
                    <div style="margin-top:15px; display:flex; gap:10px;">
                        <button id="issueTextBtn" class="issues-view-btn btn-navy" style="font-size:10px;">📱 Text</button>
                        <button id="issueEmailBtn" class="issues-view-btn btn-navy" style="font-size:10px;">📧 Email</button>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="saveIssueBtn" class="issues-view-btn btn-navy">Update Info</button>
                        <button id="closeIssueModal" class="issues-view-btn btn-gray">Back to Issues</button>
                    </div>
                </div>
            </div>

            <div id="view_5_grid_contact_confirm_dialog" class="custom-confirm-mask">
                <div class="custom-confirm-box">
                    <div class="custom-confirm-msg">Do you really want to delete this maintenance request?</div>
                    <div class="custom-confirm-actions">
                        <button id="view_5_grid_confirm_yes" class="custom-confirm-btn btn-navy">Yes</button>
                        <button id="view_5_grid_confirm_no" class="custom-confirm-btn btn-gray">No</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Deletion Logic
    const confirmDialog = document.getElementById('view_5_grid_contact_confirm_dialog');
    document.getElementById('deleteIssueRequestBtn').onclick = () => { confirmDialog.style.display = 'flex'; };
    document.getElementById('view_5_grid_confirm_no').onclick = () => { confirmDialog.style.display = 'none'; };
    document.getElementById('view_5_grid_confirm_yes').onclick = async () => {
        const id = document.getElementById('issueId').value;
        await deleteFacilityIssue(id);
        confirmDialog.style.display = 'none';
        document.getElementById('issueModal').style.display = 'none';
        await loadIssuesListData();
    };
// Update Logic (Now includes status and parts)
    document.getElementById('saveIssueBtn').onclick = async () => {
        const id = document.getElementById('issueId').value;
        const updates = { 
            title: document.getElementById('issueTitleInput').value,
            description: document.getElementById('issueDescInput').value,
            status: document.getElementById('issueStatusInput').value,
            parts_needed: document.getElementById('issuePartsInput').value
        };
        await updateFacilityIssue(id, updates);
        document.getElementById('issueModal').style.display = 'none';
        await loadIssuesListData();
    };

    // Corrected Submit Logic
    document.getElementById('submitIssueFormBtn').onclick = async (e) => {
        e.preventDefault();
        const title = document.getElementById('issueFormTitle').value;
        const description = document.getElementById('issueFormDesc').value;
        const reported_by = document.getElementById('issueFormReporter').value;
        if (!title.trim()) return;
        const result = await insertFacilityIssue({ facility_id: facility.id, title, description, reported_by });
        if (!result?.error) {
            document.getElementById('issueFormModal').style.display = 'none';
            document.getElementById('issueFormTitle').value = '';
            document.getElementById('issueFormDesc').value = '';
            await loadIssuesListData();
        }
    };

    // Standard Handlers
    document.getElementById('addIssueTriggerBtn').onclick = async () => { document.getElementById('issueFormModal').style.display = 'flex'; await populateContactsDropdown(); };
    document.getElementById('closeIssueFormBtn').onclick = () => { document.getElementById('issueFormModal').style.display = 'none'; };
    document.getElementById('closeIssueModal').onclick = () => { document.getElementById('issueModal').style.display = 'none'; };
    document.getElementById('backToControlsBtn').onclick = () => { if (window.navigateTo) window.navigateTo('view_2_controls', { facility }); };

    const selectUnderlay = document.getElementById('issueFormReporterSelect');
    const textOverlay = document.getElementById('issueFormReporter');
    selectUnderlay.onchange = () => { if (selectUnderlay.value) textOverlay.value = selectUnderlay.value; };
    textOverlay.oninput = () => { selectUnderlay.value = ""; };

    async function populateContactsDropdown() {
        if (!facility?.id) return;
        localContactsCache = await fetchContacts(facility.id);
        selectUnderlay.innerHTML = '<option value=""></option>';
        localContactsCache.forEach(c => {
            if (c.contact_name) {
                const opt = document.createElement('option');
                opt.value = c.contact_name;
                opt.textContent = c.contact_name;
                selectUnderlay.appendChild(opt);
            }
        });
    }

    if (openFormInstantly) {
        document.getElementById('issueFormModal').style.display = 'flex';
        await populateContactsDropdown();
        if (prefilledReporterName) textOverlay.value = prefilledReporterName;
    }

    async function loadIssuesListData() {
        const listElement = document.getElementById('issuesListElement');
        const issues = await fetchFacilityIssues(facility.id);
        listElement.innerHTML = '';
        if (!issues?.length) { listElement.innerHTML = '<div>No ongoing requests logged.</div>'; return; }
        issues.forEach(issue => {
            const row = document.createElement('div');
            row.className = 'issue-list-item';
            row.onclick = () => {
                document.getElementById('issueId').value = issue.id;
                document.getElementById('issueTitleInput').value = issue.title;
                document.getElementById('issueDescInput').value = issue.description;
                document.getElementById('issueStatusInput').value = issue.status || 'Open';
                document.getElementById('issuePartsInput').value = issue.parts_needed || '';
                document.getElementById('issueModal').style.display = 'flex';
            };
            row.innerHTML = `<div class="issue-list-title">${issue.title}</div><div class="issue-list-meta">Status: ${issue.status}</div>`;
            listElement.appendChild(row);
        });
    }

    await loadIssuesListData();
}
