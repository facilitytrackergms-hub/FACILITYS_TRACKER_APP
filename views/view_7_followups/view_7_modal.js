/* =================================================
FILE: view_7_modal.js
UPDATED: 2026-06-01
================================================= */

import { insertFollowup } from './view_7_data.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export function openFollowupModal({ issue, onSave }) {
    const existing = document.getElementById('followupModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'followupModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>Add Follow-Up</h2>
            <input id="followupNote" placeholder="Follow-Up Note" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="followupType" placeholder="Type" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="followupBy" placeholder="Created By" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <div style="margin-top:12px;">
                <button id="saveFollowupBtn" style="padding:12px 20px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">Save Follow-Up</button>
                <button id="closeFollowupBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">Close</button>
            </div>
            <div id="followupImageContainer" style="margin-top:12px;"></div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeFollowupBtn').onclick = () => modal.remove();

    document.getElementById('saveFollowupBtn').onclick = async () => {
        const note = document.getElementById('followupNote').value.trim();
        const followup_type = document.getElementById('followupType').value.trim();
        const created_by = document.getElementById('followupBy').value.trim();

        if (!note) return alert('Follow-Up note is required.');

        const newFollowup = await insertFollowup({ issue_id: issue.id, note, followup_type, created_by });
        if (!newFollowup) return alert('Error saving follow-up.');

        const imgContainer = document.getElementById('followupImageContainer');
        renderImageManagerSection(imgContainer, 'followup', newFollowup.id, { title: 'Follow-Up Image' });

        modal.remove();
        if (onSave) onSave();
    };
}
