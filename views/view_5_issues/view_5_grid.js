/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_grid.js
SUPABASE TBL : facility_issues
VIEW NAME    : Maintenance Requests
POP-UP TITLE : Report Maintenance Issue
LAST UPDATED : 2026-06-13 @ 08:10 PM
================================================================*/

import { fetchFacilityIssues } from './view_5_data.js';
import { openIssueModal, setupIssuesEvents } from './view_5_modal.js';
import { fetchContacts } from '../view_3_contacts/view_3_data.js';

export async function renderFacilityIssues(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    const styles = `
        <style>
            .issues-view-container { padding:20px; font-family:Arial; }
            .issue-list-item { padding:12px; border:1px solid #ddd; margin-bottom:10px; cursor:pointer; }
        </style>
    `;

    app.innerHTML = `
        ${styles}

        <div class="issues-view-container">
            <h2>Maintenance Requests</h2>
            <div id="issuesListElement">Loading...</div>
        </div>
    `;

    async function loadIssuesListData() {
        const list = document.getElementById('issuesListElement');
        const issues = await fetchFacilityIssues(facility.id);

        list.innerHTML = '';

        issues.forEach(issue => {
            const row = document.createElement('div');
            row.className = 'issue-list-item';

            row.innerHTML = `
                <div><b>${issue.title}</b></div>
                <div>Status: ${issue.status} | ${issue.reported_by || 'Staff'}</div>
            `;

            row.onclick = () => openIssueModal(facility, issue, {
                name: issue.reported_by,
                id: issue.contact_id || null
            });

            list.appendChild(row);
        });
    }

    setupIssuesEvents(facility, loadIssuesListData);

    await loadIssuesListData();
}
