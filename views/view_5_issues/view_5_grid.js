/* =================================================
FILE: view_5_grid.js
UPDATED: 2026-06-01
================================================= */

import { fetchIssues } from './view_5_data.js';
import { openIssueModal } from './view_5_modal.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export async function renderIndividualConcerns({ facility }) {
    const app = document.getElementById('app');
    if (!app) return;

    const issues = await fetchIssues(facility.id);

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; text-align:center;">
            <h1>${facility.name} Issues</h1>
            <button id="addIssueBtn" style="padding:14px 28px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; margin-bottom:16px;">
                Add Issue
            </button>
            <div id="issuesGrid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; max-width:600px; margin:0 auto;"></div>
            <button id="backBtn" style="padding:12px 20px; margin-top:20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                Back to Controls
            </button>
        </div>
    `;

    const grid = document.getElementById('issuesGrid');

    issues.forEach(i => {
        const btn = document.createElement('button');
        btn.textContent = i.issue;
        btn.style.cssText = `
            padding:12px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer;
        `;
        btn.onclick = () => {
            alert(`Issue: ${i.issue}\nTool Required: ${i.tool_required}\nNotes: ${i.notes}`);
        };
        grid.appendChild(btn);
    });

    document.getElementById('addIssueBtn').onclick = () => {
        openIssueModal({ facility, onSave: () => renderIndividualConcerns({ facility }) });
    };

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view2_controls', { facility });
    };
}
