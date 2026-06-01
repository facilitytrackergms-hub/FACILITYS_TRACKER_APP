/* =================================================
FILE: view_5_modal.js
UPDATED: 2026-06-01
================================================= */

import { insertIssue } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export function openIssueModal({ facility, onSave }) {
    const existing = document.getElementById('issueModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'issueModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>Add New Issue</h2>
            <input id="issueTitle" placeholder="Issue Title" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="toolRequired" placeholder="Tool Required" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="initiatedBy" placeholder="Initiated By" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="issueNotes" placeholder="Notes" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <div style="margin-top:12px;">
                <button id="saveIssueBtn" style="padding:12px 20px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">Save Issue</button>
                <button id="closeIssueBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">Close</button>
            </div>
            <div id="issueImageContainer" style="margin-top:12px;"></div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeIssueBtn').onclick = () => modal.remove();

    document.getElementById('saveIssueBtn').onclick = async () => {
        const issue = document.getElementById('issueTitle').value.trim();
        const tool_required = document.getElementById('toolRequired').value.trim();
        const initiated_by = document.getElementById('initiatedBy').value.trim();
        const notes = document.getElementById('issueNotes').value.trim();

        if (!issue) return alert('Issue title is required.');

        const newIssue = await insertIssue({ issue, tool_required, initiated_by, related_facility: facility.id, notes });
        if (!newIssue) return alert('Error saving issue.');

        const imgContainer = document.getElementById('issueImageContainer');
        renderImageManagerSection(imgContainer, 'issue', newIssue.id, { title: 'Issue Image' });

        modal.remove();
        if (onSave) onSave();
    };
}
