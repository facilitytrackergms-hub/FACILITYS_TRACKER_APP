/* =================================================
FILE: view_2_modal.js
UPDATED: 2026-06-01 10:55:00 AM
================================================= */
import { insertProject, insertIssue, insertFollowup } from './view_2_data.js';
import { renderFacilityControls } from './view_2_grid.js';

export function openProjectModal(facility_id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <h3>Add Project</h3>
        <input id='project_name' placeholder='Project Name'/>
        <input id='project_title' placeholder='Project Title'/>
        <input id='budget' placeholder='Budget' type='number'/>
        <textarea id='notes' placeholder='Notes'></textarea>
        <button id='saveProjectBtn'>Save Project</button>
    `;
    document.body.appendChild(modal);

    document.getElementById('saveProjectBtn').onclick = async () => {
        await insertProject(
            facility_id,
            document.getElementById('project_name').value,
            document.getElementById('project_title').value,
            parseFloat(document.getElementById('budget').value),
            document.getElementById('notes').value,
            window.currentUserId
        );
        document.body.removeChild(modal);
        renderFacilityControls(facility_id);
    };
}

export function openIssueModal(facility_id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <h3>Add Issue</h3>
        <input id='issue_name' placeholder='Issue Description'/>
        <input id='tool_required' placeholder='Tool Required'/>
        <button id='saveIssueBtn'>Save Issue</button>
    `;
    document.body.appendChild(modal);

    document.getElementById('saveIssueBtn').onclick = async () => {
        await insertIssue({
            issue: document.getElementById('issue_name').value,
            tool_required: document.getElementById('tool_required').value,
            open_issue: true,
            initiated_by: window.currentUserId,
            related_facility: facility_id
        });
        document.body.removeChild(modal);
        renderFacilityControls(facility_id);
    };
}

export function openFollowupModal(issue_id, facility_id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <h3>Add Follow-up</h3>
        <textarea id='followup_note' placeholder='Follow-up Note'></textarea>
        <input id='followup_type' placeholder='Type'/>
        <button id='saveFollowupBtn'>Save Follow-up</button>
    `;
    document.body.appendChild(modal);

    document.getElementById('saveFollowupBtn').onclick = async () => {
        await insertFollowup(
            issue_id,
            document.getElementById('followup_note').value,
            document.getElementById('followup_type').value,
            window.currentUserId
        );
        document.body.removeChild(modal);
        renderFacilityControls(facility_id);
    };
}
