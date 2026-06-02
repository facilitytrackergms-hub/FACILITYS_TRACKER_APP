/* =================================================
FILE: view_4_grid.js
UPDATED: 2026-06-01
================================================= */
import { fetchProjects } from './view_4_data.js';
import { openProjectModal } from './view_4_modal.js';

export async function renderProjects() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<p>Loading projects...</p>';
    const projects = await fetchProjects();

    if (!projects || projects.length === 0) {
        app.innerHTML = '<p>No projects found.</p>';
        return;
    }

    app.innerHTML = '<div id="projectsContainer" style="display:flex; flex-wrap:wrap; gap:12px;"></div>';
    const container = document.getElementById('projectsContainer');

    projects.forEach(project => {
        const card = document.createElement('div');
        card.style.cssText = 'border:1px solid #ccc; padding:12px; border-radius:8px; width:220px; cursor:pointer;';

        card.innerHTML = `
            <h3>${project.project_name_text}</h3>
            <p>${project.project_title_text}</p>
            <p>Created by: ${project.created_by_text}</p>
            <p>Facility ID: ${project.facility_id || 'N/A'}</p>
            <p>Status: ${project.active_status ? 'Active' : 'Inactive'}</p>
        `;

        card.onclick = () => openProjectModal(project, true);
        container.appendChild(card);
    });

    const addBtn = document.createElement('button');
    addBtn.innerText = "Add Project";
    addBtn.style.cssText = "margin-top:12px; padding:10px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;";
    addBtn.onclick = () => openProjectModal(null, false);
    app.appendChild(addBtn);
}
