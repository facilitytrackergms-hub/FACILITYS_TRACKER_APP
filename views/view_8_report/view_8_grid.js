/* =================================================
FILE: view_8_grid.js
UPDATED: 2026-06-01
================================================= */

import { fetchReportIssues, fetchReportProjects, fetchReportFollowups } from './view_8_data.js';
import { openReportModal } from './view_8_modal.js';

export async function renderReportsDashboard({ facility }) {
    const app = document.getElementById('app');
    if (!app) return;

    const issues = await fetchReportIssues(facility.id);
    const projects = await fetchReportProjects(facility.id);

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; text-align:center;">
            <h1>${facility.name} Reports</h1>
            <div id="reportGrid" style="display:flex; flex-direction:column; gap:12px; max-width:600px; margin:0 auto;"></div>
            <button id="backBtn" style="padding:12px 20px; margin-top:20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                Back to Controls
            </button>
        </div>
    `;

    const grid = document.getElementById('reportGrid');

    const reportBtnIssues = document.createElement('button');
    reportBtnIssues.textContent = `View ${issues.length} Issues`;
    reportBtnIssues.style.cssText = 'padding:12px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer;';
    reportBtnIssues.onclick = () => openReportModal({ facility, type: 'issues', data: issues });
    grid.appendChild(reportBtnIssues);

    const reportBtnProjects = document.createElement('button');
    reportBtnProjects.textContent = `View ${projects.length} Projects`;
    reportBtnProjects.style.cssText = 'padding:12px; background:#00264d; color:white; border:none; border-radius:8px; cursor:pointer;';
    reportBtnProjects.onclick = () => openReportModal({ facility, type: 'projects', data: projects });
    grid.appendChild(reportBtnProjects);

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view2_controls', { facility });
    };
}
