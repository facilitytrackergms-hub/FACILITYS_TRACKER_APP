/* =================================================
FILE: controls_v4_modal.js
UPDATED: 2026-05-30 05:50 AM
================================================= */
import { insertProject, getProjects } from './controls_v4_data.js';

export function setupProjectModals(facility) {
    document.getElementById('projectTrackCreateBtn').onclick = () => {
        document.getElementById('projectTrackTitleInput').value = '';
        document.getElementById('projectTrackBudgetInput').value = '';
        document.getElementById('projectTrackNotesInput').value = '';
        document.getElementById('projectTrackFormModal').style.display = 'flex';
    };

    document.getElementById('projectTrackSaveBtn').onclick = async () => {
        const titleVal = document.getElementById('projectTrackTitleInput').value.trim();
        if (!titleVal) {
            alert("Please supply a project scope title descriptor.");
            return;
        }

        const payload = {
            project_title: titleVal,
            project_name: titleVal,
            budget: document.getElementById('projectTrackBudgetInput').value.trim(),
            notes: document.getElementById('projectTrackNotesInput').value.trim(),
            facility_id: facility.id,
            active_status: true,
            created_at: new Date().toISOString()
        };

        const { error } = await insertProject(payload);
        if (error) {
            console.error(error);
            alert(`Could not append project details: ${error.message}`);
        } else {
            document.getElementById('projectTrackFormModal').style.display = 'none';
            await getProjects(facility.id); // reload projects
        }
    };

    document.getElementById('projectTrackCloseBtn').onclick = () => {
        document.getElementById('projectTrackFormModal').style.display = 'none';
    };

    document.getElementById('projectTrackBackBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('facilityControls', facility);
    };
}
