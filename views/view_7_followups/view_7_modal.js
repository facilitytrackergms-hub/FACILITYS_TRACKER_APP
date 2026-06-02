/* =================================================
FILE: view_7_modal.js
UPDATED: 2026-06-01
================================================= */
import { insertFollowup, updateFollowup } from './view_7_data.js';

export function openFollowupModal(followup, issueId, isEdit) {
    if (!issueId) return console.error("issueId is required for followups");

    let existing = document.getElementById('followupModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'followupModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; justify-content:center; align-items:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:24px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>${isEdit ? 'Edit Follow-up' : 'Add Follow-up'}</h2>
            <input id="followupTitle" placeholder="Follow-up Title" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${followup?.followup_title || ''}">
            <textarea id="followupNotes" placeholder="Notes" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">${followup?.followup_notes_text || ''}</textarea>
            <input id="followupInitiated" placeholder="Initiated By" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${followup?.initiated_by_text || ''}">
            <div style="margin-top:12px;">
                <button id="saveFollowupBtn" style="padding:12px 20px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">
                    ${isEdit ? 'Update' : 'Save'}
                </button>
                <button id="closeFollowupBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeFollowupBtn').onclick = () => modal.remove();

    document.getElementById('saveFollowupBtn').onclick = async () => {
        const title = document.getElementById('followupTitle').value.trim();
        const notes = document.getElementById('followupNotes').value.trim();
        const initiatedBy = document.getElementById('followupInitiated').value.trim();

        if (!title) return alert('Follow-up title is required.');

        if (isEdit && followup?.id) {
            await updateFollowup(followup.id, {
                followup_title: title,
                followup_notes_text: notes,
                initiated_by_text: initiatedBy
            });
        } else {
            await insertFollowup({
                followup_title: title,
                followup_notes_text: notes,
                initiated_by_text: initiatedBy,
                related_issue: issueId
            });
        }

        modal.remove();
        const { renderFollowups } = await import('./view_7_grid.js');
        renderFollowups(issueId);
    };
}
