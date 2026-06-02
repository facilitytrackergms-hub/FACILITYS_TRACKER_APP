/* =================================================
FILE: view_4_modal.js
UPDATED: 2026-06-01
================================================= */
import { insertProject, updateProject } from './view_4_data.js';

export function openProjectModal(project, isEdit) {
    let existing = document.getElementById('projectModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'projectModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; justify-content:center; align-items:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:24px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>${isEdit ? 'Edit Project' : 'Add Project'}</h2>
            <input id="projectName" placeholder="Project Name" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${project?.project_name_text || ''}">
            <input id="projectTitle" placeholder="Project Title" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${project?.project_title_text || ''}">
            <input id="projectCreatedBy" placeholder="Created By" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${project?.created_by_text || ''}">
            <input id="projectFacility" placeholder="Facility ID (UUID)" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${project?.facility_id || ''}">
            <input id="projectNotes" placeholder="Notes" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${project?.notes || ''}">
            <div style="margin-top:12px;">
                <label>
                    <input type="checkbox" id="projectStatus" ${project?.active_status !== false ? 'checked' : ''}>
                    Active
                </label>
            </div>
            <div style="margin-top:12px;">
                <button id="saveProjectBtn" style="padding:12px 20px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">
                    ${isEdit ? 'Update' : 'Save'}
                </button>
                <button id="closeProjectBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeProjectBtn').onclick = () => modal.remove();

    document.getElementById('saveProjectBtn').onclick = async () => {
        const name = document.getElementById('projectName').value.trim();
        const title = document.getElementById('projectTitle').value.trim();
        const createdBy = document.getElementById('projectCreatedBy').value.trim();
        const facilityId = document.getElementById('projectFacility').value.trim();
        const notes = document.getElementById('projectNotes').value.trim();
        const activeStatus = document.getElementById('projectStatus').checked;

        if (!name) return alert('Project name is required.');

        if (isEdit && project?.id) {
            await updateProject(project.id, { project_name: name, project_title: title, created_by: createdBy, facility_id: facilityId, notes, active_status: activeStatus });
        } else {
            await insertProject({ project_name: name, project_title: title, created_by: createdBy, facility_id: facilityId, notes, active_status: activeStatus });
        }

        modal.remove();
        const { renderProjects } = await import('./view_4_grid.js');
        renderProjects();
    };
}
