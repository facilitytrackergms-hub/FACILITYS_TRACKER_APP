/* =================================================
FILE: view_4_modal.js
UPDATED: 2026-06-01
================================================= */

import { insertProject } from './view_4_data.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export function openProjectModal({ facility, onSave }) {
    const existing = document.getElementById('projectModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'projectModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>Add New Project</h2>
            <input id="projectName" placeholder="Project Name" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="projectBudget" placeholder="Budget" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="projectNotes" placeholder="Notes" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;">
            <div style="margin-top:12px;">
                <button id="saveProjectBtn" style="padding:12px 20px; background:#00264d; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">Save Project</button>
                <button id="closeProjectBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">Close</button>
            </div>
            <div id="projectImageContainer" style="margin-top:12px;"></div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeProjectBtn').onclick = () => modal.remove();

    document.getElementById('saveProjectBtn').onclick = async () => {
        const name = document.getElementById('projectName').value.trim();
        const budget = document.getElementById('projectBudget').value.trim();
        const notes = document.getElementById('projectNotes').value.trim();

        if (!name) return alert('Project name is required.');

        const newProject = await insertProject({ project_name: name, budget, notes, facility_id: facility.id });
        if (!newProject) return alert('Error saving project.');

        const imgContainer = document.getElementById('projectImageContainer');
        renderImageManagerSection(imgContainer, 'project', newProject.id, { title: 'Project Image' });

        modal.remove();
        if (onSave) onSave();
    };
}
