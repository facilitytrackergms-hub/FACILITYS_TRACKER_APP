/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_grid.js
SUPABASE TBL : facility_issues
VIEW NAME    : Maintenance Requests
POP-UP TITLE : Report Maintenance Issue
LAST UPDATED : 2026-06-13 @ 08:20 PM
================================================================*/

import { fetchFacilityIssues, insertFacilityIssue } from './view_5_data.js';
import { openIssueModal, setupIssuesEvents } from './view_5_modal.js';
import { fetchContacts } from '../view_3_contacts/view_3_data.js';

export async function renderFacilityIssues(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;
    let localContactsCache = [];

    app.innerHTML = `
        <div style="padding:20px;font-family:Arial;">
            <h2>Maintenance Requests</h2>

            <button id="addIssueTriggerBtn">+ Create Maintenance Request</button>
            <button id="backToControlsBtn">Back</button>

            <div id="issuesListElement">Loading...</div>

            <!-- FORM -->
            <div id="issueFormModal" style="display:none;">
                <h3>Report Maintenance Issue</h3>

                <input id="issueFormTitle" placeholder="Title">
                <textarea id="issueFormDesc" placeholder="Description"></textarea>

                <label>Reported By</label>
                <input id="issueFormReporter" placeholder="Reported By">

                <button id="submitIssueFormBtn">Submit Request</button>
                <button id="closeIssueFormBtn">Cancel</button>
            </div>

            <!-- DASHBOARD -->
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
    `;

    // OPEN FORM
    document.getElementById('addIssueTriggerBtn').onclick = async () => {
        document.getElementById('issueFormModal').style.display = 'block';

        if (facility?.id) {
            localContactsCache = await fetchContacts(facility.id);
        }
    };

    document.getElementById('closeIssueFormBtn').onclick = () => {
        document.getElementById('issueFormModal').style.display = 'none';
    };

    // 🔥 THIS IS THE FIX (was missing)
    document.getElementById('submitIssueFormBtn').onclick = async () => {
        const payload = {
            facility_id: facility.id,
            title: document.getElementById('issueFormTitle').value,
            description: document.getElementById('issueFormDesc').value,

            // IMPORTANT FIX
            reported_by: document.getElementById('issueFormReporter').value || 'Staff'
        };

        await insertFacilityIssue(payload);

        document.getElementById('issueFormModal').style.display = 'none';
        await loadIssues();
    };

    // LIST
    async function loadIssues() {
        const list = document.getElementById('issuesListElement');
        const issues = await fetchFacilityIssues(facility.id);

        list.innerHTML = '';

        issues.forEach(issue => {
            const div = document.createElement('div');
            div.style.padding = "10px";
            div.style.border = "1px solid #ddd";
            div.style.marginBottom = "8px";

            div.innerHTML = `
                <b>${issue.title}</b><br>
                Status: ${issue.status} | ${issue.reported_by || 'Staff'}
            `;

            div.onclick = () => openIssueModal(facility, issue);
            list.appendChild(div);
        });
    }

    // MODAL EVENTS
    setupIssuesEvents(facility, loadIssues);

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', { facility });
        }
    };

    await loadIssues();
}
