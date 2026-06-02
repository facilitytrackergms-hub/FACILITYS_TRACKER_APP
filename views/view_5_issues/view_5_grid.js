/* =================================================
FILE: view_5_grid.js
UPDATED: 2026-06-01
================================================= */
import { fetchIssues } from './view_5_data.js';
import { openIssueModal } from './view_5_modal.js';

export async function renderIssues() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<p>Loading issues...</p>';
    const issues = await fetchIssues();

    if (!issues || issues.length === 0) {
        app.innerHTML = '<p>No issues found.</p>';
        return;
    }

    app.innerHTML = '<div id="issuesContainer" style="display:flex; flex-wrap:wrap; gap:12px;"></div>';
    const container = document.getElementById('issuesContainer');

    issues.forEach(issue => {
        const card = document.createElement('div');
        card.style.cssText = 'border:1px solid #ccc; padding:12px; border-radius:8px; width:240px; cursor:pointer;';

        card.innerHTML = `
            <h3>${issue.issue_title}</h3>
            <p>Tool: ${issue.tool_required_text || 'N/A'}</p>
            <p>Reported by: ${issue.initiated_by_text || 'N/A'}</p>
            <p>Facility ID: ${issue.related_facility}</p>
            <p>Status: ${issue.open_issue ? 'Open' : 'Closed'}</p>
        `;
        card.onclick = () => openIssueModal(issue, true);
        container.appendChild(card);
    });

    const addBtn = document.createElement('button');
    addBtn.innerText = "Add Issue";
    addBtn.style.cssText = "margin-top:12px; padding:10px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;";
    addBtn.onclick = () => openIssueModal(null, false);
    app.appendChild(addBtn);
}
