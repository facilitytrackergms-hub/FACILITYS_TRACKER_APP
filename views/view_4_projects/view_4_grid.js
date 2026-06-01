/* =================================================
FILE: view_4_grid.js
UPDATED: 2026-06-01
================================================= */

import { fetchProjects } from './view_4_data.js';
import { openProjectModal } from './view_4_modal.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export async function renderPendingProjects({ facility }) {
    const app = document.getElementById('app');
    if (!app) return;

    const projects = await fetchProjects(facility.id);

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; text-align:center;">
            <h1>${facility.name} Projects</h1>
            <button id="addProjectBtn" style="padding:14px 28px; background:#00264d; color:white; border:none; border-radius:8px; cursor:pointer; margin-bottom:16px;">
                Add Project
            </button>
            <div id="projectsGrid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; max-width:600px; margin:0 auto;"></div>
            <button id="backBtn" style="padding:12px 20px; margin-top:20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                Back to Controls
            </button>
        </div>
    `;

    const grid = document.getElementById('projectsGrid');

    projects.forEach(p => {
        const btn = document.createElement('button');
        btn.textContent = p.project_name;
        btn.style.cssText = `
            padding:12px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;
        `;
        btn.onclick = () => {
            alert(`Project: ${p.project_name}\nBudget: ${p.budget}\nNotes: ${p.notes}`);
        };
        grid.appendChild(btn);
    });

    document.getElementById('addProjectBtn').onclick = () => {
        openProjectModal({ facility, onSave: () => renderPendingProjects({ facility }) });
    };

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view2_controls', { facility });
    };
}
