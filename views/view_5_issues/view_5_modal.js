/* =================================================
FILE: view_5_modal.js
UPDATED: 2026-06-01
================================================= */
import { insertIssue, updateIssue } from './view_5_data.js';

export function openIssueModal(issue, isEdit) {
    let existing = document.getElementById('issueModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'issueModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; justify-content:center; align-items:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:24px; border-radius:12px; width:100%; max-width:450px; text-align:center;">
            <h2>${isEdit ? 'Edit Issue' : 'Add Issue'}</h2>
            <input id="issueTitle" placeholder="Issue Title" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${issue?.issue_title || ''}">
            <input id="issueTool" placeholder="Tool Required" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${issue?.tool_required_text || ''}">
            <input id="issueInitiated" placeholder="Initiated By" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${issue?.initiated_by_text || ''}">
            <input id="issueFacility" placeholder="Facility ID (UUID)" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${issue?.related_facility || ''}">
            <input id="issueProject" placeholder="Project ID (UUID)" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${issue?.related_project || ''}">
            <textarea id="issueNotes" placeholder="Notes" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">${issue?.notes || ''}</textarea>
            <div style="margin-top:12px;">
                <label>
                    <input type="checkbox" id="issueOpen" ${issue?.open_issue !== false ? 'checked' : ''}>
                    Open
                </label>
            </div>
            <div style="margin-top:12px;">
                <button id="saveIssueBtn" style="padding:12px 20px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">
                    ${isEdit ? 'Update' : 'Save'}
                </button>
                <button id="closeIssueBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeIssueBtn').onclick = () => modal.remove();

    document.getElementById('saveIssueBtn').onclick = async () => {
        const issueTitle = document.getElementById('issueTitle').value.trim();
        const tool = document.getElementById('issueTool').value.trim();
        const initiatedBy = document.getElementById('issueInitiated').value.trim();
        const facilityId = document.getElementById('issueFacility').value.trim();
        const projectId = document.getElementById('issueProject').value.trim();
        const notes = document.getElementById('issueNotes').value.trim();
        const openStatus = document.getElementById('issueOpen').checked;

        if (!issueTitle) return alert('Issue title is required.');
        if (!facilityId) return alert('Facility ID is required.');

        if (isEdit && issue?.id) {
            await updateIssue(issue.id, {
                issue_title: issueTitle,
                tool_required_text: tool,
                initiated_by_text: initiatedBy,
                related_facility: facilityId,
                related_project: projectId || null,
                notes,
                open_issue: openStatus
            });
        } else {
            await insertIssue({
                issue_title: issueTitle,
                tool_required_text: tool,
                initiated_by_text: initiatedBy,
                related_facility: facilityId,
                related_project: projectId || null,
                notes
            });
        }

        modal.remove();
        const { renderIssues } = await import('./view_5_grid.js');
        renderIssues();
    };
}
