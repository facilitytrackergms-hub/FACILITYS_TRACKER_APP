/*================================================================
File Name: view_5_grid.js
Table: N/A
View: view_5_issues
Title: Facility Issues Grid
Date: 2026-06-13
Time: 08:38 PM
================================================================*/

const __FILENAME = 'view_5_grid.js';

import { fetchFacilityIssues, insertFacilityIssue } from './view_5_data.js';
import { openIssueModal, setupIssuesEvents } from './view_5_modal.js';
import { fetchContacts } from '../view_3_contacts/view_3_data.js';

export async function renderFacilityIssues(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;
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

            /* DELETE BUTTON OVERRIDE */
            .btn-delete-danger {
                background: red !important;
                color: yellow !important;
                font-weight: bold !important;
                border: 2px solid #b30000 !important;
            }

            .issues-list-layout { margin:20px 0; text-align:left; display:flex; flex-direction:column; gap:10px; }
            .issue-list-item { background:#f9fafb; border:1px solid #e5e7eb; padding:15px; border-radius:8px; cursor:pointer; }
            .issue-list-item:hover { background:#f3f4f6; }
            .issue-list-title { font-weight:bold; color:#00264d; font-size:15px; }
            .issue-list-meta { font-size:12px; color:#6b7280; margin-top:4px; }
            
            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; max-height:90vh; overflow-y:auto; }
            .modal-shell-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; margin-bottom:15px; }

            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }

            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-bottom:15px; text-align:center; padding:4px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; }

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
                <div class="view-build-stamp">
                    File: views/view_5_issues/view_5_grid.js<br>
                    Updated: 2026-06-13 08:38:00 PM
                </div>
            </div>

            <div id="issueFormModal" class="modal-mask">
                <div class="modal-shell">
                    <h3 class="modal-shell-title">Report Maintenance Issue</h3>
                    <label class="form-field-label">Issue Title / Subject</label>
                    <input type="text" id="issueFormTitle" class="form-field-input">
                    <label class="form-field-label">Description / Details</label>
                    <textarea id="issueFormDesc" class="form-field-input" style="height:70px; resize:none;"></textarea>
                    <label class="form-field-label">Reported By</label>
                    <div class="combobox-container">
                        <select id="issueFormReporterSelect" class="combobox-select-underlay">
                            <option value=""></option>
                        </select>
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
                    <h3 id="issueModalTitle" class="modal-shell-title">Issue Dashboard</h3>
                    <input type="hidden" id="issueId">
                    <label class="form-field-label">Issue Title / Subject</label>
                    <input type="text" id="issueTitleInput" class="form-field-input">
                    <label class="form-field-label">Description / Details</label>
                    <textarea id="issueDescInput" class="form-field-input"></textarea>
                    <label class="form-field-label">Priority</label>
                    <select id="issuePriorityInput" class="form-field-input">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                    <label class="form-field-label">Status</label>
                    <select id="issueStatusInput" class="form-field-input">
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Closed</option>
                    </select>
                    <div id="issue-image-container"></div>
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="openFollowupsBtn" class="issues-view-btn btn-emerald">Follow Up</button>
                        <button id="saveIssueBtn" class="issues-view-btn btn-navy">Update Info</button>
                        <button id="deleteIssueRequestBtn" class="issues-view-btn btn-delete-danger" style="display:none;">DELETE ISSUE</button>
                        <button id="closeIssueModal" class="issues-view-btn btn-gray">Back to Issues</button>
                    </div>
                </div>
            </div>

            <div id="view_5_grid_contact_confirm_dialog" class="custom-confirm-mask">
                <div class="custom-confirm-box">
                    <div id="view_5_grid_confirm_message" class="custom-confirm-msg"></div>
                    <div class="custom-confirm-actions">
                        <button id="view_5_grid_confirm_yes" class="custom-confirm-btn btn-navy">Yes</button>
                        <button id="view_5_grid_confirm_no" class="custom-confirm-btn btn-gray">No</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('issueFormModal');
    const selectUnderlay = document.getElementById('issueFormReporterSelect');
    const textOverlay = document.getElementById('issueFormReporter');

    selectUnderlay.onchange = () => {
        if (selectUnderlay.value) textOverlay.value = selectUnderlay.value;
    };

    textOverlay.oninput = () => {
        selectUnderlay.value = "";
    };

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

    document.getElementById('addIssueTriggerBtn').onclick = async () => {
        modal.style.display = 'flex';
        await populateContactsDropdown();
    };

    document.getElementById('closeIssueFormBtn').onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_2_controls', { facility });
    };

    const deleteBtn = document.getElementById('deleteIssueRequestBtn');
    if (deleteBtn) {
        deleteBtn.classList.add('btn-delete-danger');
    }

    async function loadIssuesListData() {
        const listElement = document.getElementById('issuesListElement');
        const issues = await fetchFacilityIssues(facility.id);
        listElement.innerHTML = '';
        if (!issues?.length) {
            listElement.innerHTML = '<div>No ongoing requests logged.</div>';
            return;
        }
        issues.forEach(issue => {
            const row = document.createElement('div');
            row.className = 'issue-list-item';
            row.innerHTML = `
                <div class="issue-list-title">${issue.title}</div>
                <div class="issue-list-meta">Status: ${issue.status} | ${issue.reported_by}</div>
            `;
            row.onclick = () => openIssueModal(facility, issue);
            listElement.appendChild(row);
        });
    }

    setupIssuesEvents(facility, loadIssuesListData);
    await populateContactsDropdown();
    await loadIssuesListData();
}
