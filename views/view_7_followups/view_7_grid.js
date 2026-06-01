/* =================================================
FILE: view_7_grid.js
UPDATED: 2026-06-01
================================================= */

import { fetchIssueFollowups } from './view_7_data.js';
import { openFollowupModal } from './view_7_modal.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export async function renderIssueFollowups({ issue }) {
    const app = document.getElementById('app');
    if (!app) return;

    const followups = await fetchIssueFollowups(issue.id);

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; text-align:center;">
            <h1>Follow-Ups for Issue: ${issue.issue}</h1>
            <button id="addFollowupBtn" style="padding:14px 28px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-bottom:16px;">
                Add Follow-Up
            </button>
            <div id="followupsGrid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; max-width:600px; margin:0 auto;"></div>
            <button id="backBtn" style="padding:12px 20px; margin-top:20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                Back to Issues
            </button>
        </div>
    `;

    const grid = document.getElementById('followupsGrid');

    followups.forEach(f => {
        const btn = document.createElement('button');
        btn.textContent = f.note;
        btn.style.cssText = `
            padding:12px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;
        `;
        btn.onclick = () => {
            alert(`Follow-Up: ${f.note}\nType: ${f.followup_type}\nBy: ${f.created_by}`);
        };
        grid.appendChild(btn);
    });

    document.getElementById('addFollowupBtn').onclick = () => {
        openFollowupModal({ issue, onSave: () => renderIssueFollowups({ issue }) });
    };

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view5_issues', { facility: issue.related_facility });
    };
}
