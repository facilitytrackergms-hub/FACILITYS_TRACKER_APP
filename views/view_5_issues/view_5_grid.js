/*================================================================
File Name: view_5_grid.js
Table: N/A
View: view_5_issues
Title: Facility Issues Grid
Date: 2026-06-13
Time: 08:54 PM
================================================================*/

const __FILENAME = 'view_5_grid.js';

import { fetchFacilityIssues, insertFacilityIssue } from './view_5_data.js';
import { openIssueModal, setupIssuesEvents } from './view_5_modal.js';
import { fetchContacts } from '../view_3_contacts/view_3_data.js';

export async function renderFacilityIssues(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;
    const prefilledReporter = data?.prefilledReporterName || '';
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
            .btn-delete-danger { background: red !important; color: yellow !important; font-weight: bold !important; border: 2px solid #b30000 !important; }
            .issues-list-layout { margin:20px 0; text-align:left; display:flex; flex-direction:column; gap:10px; }
            .issue-list-item { background:#f9fafb; border:1px solid #e5e7eb; padding:15px; border-radius:8px; cursor:pointer; }
            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; max-height:90vh; overflow-y:auto; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-bottom:15px; text-align:center; padding:4px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; }
            .combobox-container { position:relative; display:block; width:100%; }
            .combobox-select-underlay { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; background:white; }
            .combobox-input-overlay { position:absolute; top:5px; left:1px; width:calc(100% - 32px); margin:0; padding:10px; border:none; outline:none; }
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
                <div class="view-build-stamp">File: views/view_5_issues/view_5_grid.js<br>Updated: 2026-06-13 08:54:00 PM</div>
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
                        <select id="issueFormReporterSelect" class="combobox-select-underlay"><option value=""></option></select>
                        <input type="text" id="issueFormReporter" class="combobox-input-overlay">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="submitIssueFormBtn" class="issues-view-btn btn-navy">Submit Request</button>
                        <button id="closeIssueFormBtn" class="issues-view-btn btn-gray">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('issueFormModal');
    const selectUnderlay = document.getElementById('issueFormReporterSelect');
    const textOverlay = document.getElementById('issueFormReporter');

    // Button Bindings
    document.getElementById('submitIssueFormBtn').onclick = async () => {
        const title = document.getElementById('issueFormTitle').value.trim();
        const desc = document.getElementById('issueFormDesc').value.trim();
        const reporter = textOverlay.value.trim();

        if (!title || !reporter) {
            alert('Required fields missing.');
            return;
        }

        const success = await insertFacilityIssue(facility.id, { title, description: desc, reported_by: reporter, status: 'Open', priority: 'Medium' });
        if (success) {
            modal.style.display = 'none';
            await loadIssuesListData();
        } else {
            alert('Save failed.');
        }
    };

    document.getElementById('addIssueTriggerBtn').onclick = async () => {
        modal.style.display = 'flex';
        await populateContactsDropdown();
        if (prefilledReporter) textOverlay.value = prefilledReporter;
    };

    document.getElementById('closeIssueFormBtn').onclick = () => modal.style.display = 'none';
    document.getElementById('backToControlsBtn').onclick = () => window.navigateTo('view_2_controls', { facility });

    async function populateContactsDropdown() {
        if (!facility?.id) return;
        localContactsCache = await fetchContacts(facility.id);
        selectUnderlay.innerHTML = '<option value=""></option>';
        localContactsCache.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.contact_name;
            opt.textContent = c.contact_name;
            selectUnderlay.appendChild(opt);
        });
    }

    async function loadIssuesListData() {
        const list = document.getElementById('issuesListElement');
        const issues = await fetchFacilityIssues(facility.id);
        list.innerHTML = issues?.length ? '' : '<div>No ongoing requests.</div>';
        issues?.forEach(issue => {
            const row = document.createElement('div');
            row.className = 'issue-list-item';
            row.innerHTML = `<div class="issue-list-title">${issue.title}</div><div class="issue-list-meta">Status: ${issue.status} | ${issue.reported_by}</div>`;
            row.onclick = () => openIssueModal(facility, issue);
            list.appendChild(row);
        });
    }

    if (openFormInstantly) {
        modal.style.display = 'flex';
        await populateContactsDropdown();
        textOverlay.value = prefilledReporter;
    }

    await loadIssuesListData();
}
