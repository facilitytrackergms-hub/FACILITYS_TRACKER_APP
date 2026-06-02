/* =================================================
FILE: views/view_4_projects/view_4_modal.js
UPDATED: 2026-06-02 05:50:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { insertFacilityProject } from './view_4_data.js';

export function setupProjectsEvents(facility, renderPendingProjectsFn) {
    const formModal = document.getElementById('projectTrackFormModal');

    document.getElementById('projectTrackCreateBtn').onclick = () => {
        document.getElementById('projectTrackTitleInput').value = '';
        document.getElementById('projectTrackBudgetInput').value = '';
        document.getElementById('projectTrackNotesInput').value = '';
        formModal.style.display = 'flex';
    };

    document.getElementById('projectTrackCloseBtn').onclick = () => {
        formModal.style.display = 'none';
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
            facilityid: facility.id,
            active_status: true,
            created_at: new Date().toISOString()
        };

        try {
            await insertFacilityProject(payload);
            formModal.style.display = 'none';
            await renderPendingProjectsFn(facility);
        } catch (error) {
            if (error.code === '23505') {
                alert("Database Constraint Error: This facility is restricted to a single project row in the database schema.");
            } else {
                alert(`Could not append project details: ${error.message}`);
            }
        }
    };

    document.getElementById('projectTrackBackBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', facility);
        }
    };
}
