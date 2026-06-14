/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_grid.js
SUPABASE TBL : facility_issues
VIEW NAME    : Maintenance Requests
POP-UP TITLE : Report Maintenance Issue
LAST UPDATED : 2026-06-13 @ 08:30 PM
================================================================*/

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
            .issues-view-container { padding:20px; font-family:Arial; }
            .issues-card-wrapper { max-width:500px; margin:0 auto; }
            .issue-list-item { padding:12px; border:1px solid #ddd; margin-bottom:10px; cursor:pointer; }
        </style>
    `;

    app.innerHTML = `
        ${styles}

        <div class="issues-view-container">
            <div class="issues-card-wrapper">

                <h2>Maintenance Requests</h2>

                <button id="addIssueTriggerBtn">+ Create Maintenance Request</button>
                <button id="backToControlsBtn">Back</button>

                <div id="issuesListElement">Loading...</div>

                <!-- FORM MODAL -->
                <div id="issueFormModal" style="display:none;">
                    <h3>Report Maintenance Issue</h3>

                    <input id="issueFormTitle" placeholder="Title">
                    <textarea id="issueFormDesc" placeholder="Description"></textarea>

                    <label>Reported By</label>
                    <input id="issueFormReporter" placeholder="Reported By">

                    <button id="submitIssueFormBtn">Submit Request</button>
                    <button id="closeIssueFormBtn">Cancel</button>
                </div>

                <!-- ISSUE MODAL -->
                <div id="issueModal" style="display:none;">
                    <input type="hidden" id="issueId">

                    <input id="issueTitleInput">
                    <textarea id="issueDescInput"></textarea>

                    <select id="issuePriorityInput">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>

                    <select id="issueStatusInput">
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Closed</option>
                    </select>

                    <button id="saveIssueBtn">Save</button>
                </div>

            </div>
        </div>
    `;

    const formModal = document.getElementById('issueFormModal');

    document.getElementById('addIssueTriggerBtn').onclick = async () => {
        formModal.style.display = 'block';

        if (facility?.id) {
            localContactsCache = await fetchContacts(facility.id);
        }
    };

    document.getElementById('closeIssueFormBtn').onclick = () => {
        formModal.style.display = 'none';
    };

    // ✅ FIX IS HERE (this was missing before)
    document.getElementById('submitIssueFormBtn').onclick = async () => {

        const title = document.getElementById('issueFormTitle').value;
        const desc = document.getElementById('issueFormDesc').value;
        const reporter = document.getElementById('issueFormReporter').value;

        const payload = {
            facility_id: facility.id,
            title: title,
            description: desc,

            // 🔥 THIS FIXES YOUR "STAFF" ISSUE
            reported_by: reporter || 'Staff'
        };

        await insertFacilityIssue(payload);

        formModal.style.display = 'none';
        await loadIssues();
    };

    async function loadIssues() {
        const list = document.getElementById('issuesListElement');
        const issues = await fetchFacilityIssues(facility.id);

        list.innerHTML = '';

        issues.forEach(issue => {
            const div = document.createElement('div');
            div.className = 'issue-list-item';

            div.innerHTML = `
                <b>${issue.title}</b><br>
                Status: ${issue.status} | ${issue.reported_by || 'Staff'}
            `;

            div.onclick = () => openIssueModal(facility, issue);
            list.appendChild(div);
        });
    }

    setupIssuesEvents(facility, loadIssues);

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', { facility });
        }
    };

    await loadIssues();
}
