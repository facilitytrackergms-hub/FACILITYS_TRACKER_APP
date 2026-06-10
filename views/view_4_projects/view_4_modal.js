/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-10 @ 03:52 AM
================================================================*/
const __FILENAME = 'view_4_modal.js';

import {
    insertFacilityProject,
    insertProjectAction,
    insertVendor,
    insertVendorFile,
    insertProjectVendorJob,
    insertVendorJobFile,
    insertVendorJobFollowup,
    uploadCabinetFile,
    getProjectTitle,
    getVendorName
} from './view_4_data.js';

// ================= UPDATED IMPORT =================
import { renderVendorQuotesFilesDashboard } from './view_4_grid_components/view_4_render_helpers.js';
// ===================================================

// --- Existing setupCabinetHomeEvents, setupVendorDashboardEvents, setupVendorJobDashboardEvents remain unchanged ---

export function setupProjectDashboardEvents({ facility, project, refreshProject, vendors }) {
    const addActionBtn = byId('projectAddActionBtn');
    const vendorQuotesFilesBtn = byId('projectVendorQuotesFilesBtn');
    const closeActionBtn = byId('closeProjectActionModalBtn');
    const saveActionBtn = byId('saveProjectActionBtn');
    const actionModal = byId('projectActionModal');
    const actionNotice = byId('projectActionModalNotice');
    const app = document.getElementById('app');

    // Open Project Action Modal
    if (addActionBtn) {
        addActionBtn.onclick = () => {
            clearValue('projectActionTitleInput');
            clearValue('projectActionNotesInput');
            setProjectActionNotice('', false);
            showModal('projectActionModal');
        };
    }

    // Vendor Quotes / Files Dashboard
    if (vendorQuotesFilesBtn && app) {
        vendorQuotesFilesBtn.onclick = () => {
            app.innerHTML = renderVendorQuotesFilesDashboard(project, vendors);

            const addVendorBtn = byId('addVendorBtn');
            const backToProjectBtn = byId('backToProjectBtn');

            if (addVendorBtn) {
                addVendorBtn.onclick = () => showModal('cabinetVendorModal');
            }

            document.querySelectorAll('.vendor-btn').forEach(button => {
                button.onclick = () => {
                    const vendorId = button.dataset.vendorId;
                    if (vendorId && window.openVendorDashboard) {
                        window.openVendorDashboard(vendorId);
                    }
                };
            });

            if (backToProjectBtn) {
                backToProjectBtn.onclick = () => {
                    if (window.renderSingleProjectDashboard) {
                        window.renderSingleProjectDashboard({ facility, project });
                    }
                };
            }
        };
    }

    // Close Project Action Modal
    if (closeActionBtn) {
        closeActionBtn.onclick = () => {
            hideModal('projectActionModal');
            setProjectActionNotice('', false);
        };
    }

    if (actionModal) {
        actionModal.onclick = event => {
            if (event.target === actionModal) {
                hideModal('projectActionModal');
                setProjectActionNotice('', false);
            }
        };
    }

    // Save Project Action
    if (saveActionBtn) {
        saveActionBtn.onclick = async () => {
            const actionTitle = value('projectActionTitleInput');
            const actionType = value('projectActionTypeInput') || 'note';
            const notes = value('projectActionNotesInput');

            if (!project || !project.id) {
                setProjectActionNotice('[view_4_modal.js] Project Action Error: Missing project ID. Action was not saved.', true);
                return;
            }

            if (!actionTitle && !notes) {
                setProjectActionNotice('[view_4_modal.js] Project Action Notice: Add an action title or notes first.', true);
                return;
            }

            const result = await insertProjectAction({
                project_id: project.id,
                action_type: actionType,
                action_title_text: actionTitle || actionType,
                notes,
                active_status: true
            });

            if (result.error) {
                setProjectActionNotice(`[view_4_modal.js] Database Error: Could not save project action. ${result.error.message}`, true);
                return;
            }

            clearValue('projectActionTitleInput');
            clearValue('projectActionNotesInput');
            hideModal('projectActionModal');
            setProjectActionNotice('', false);

            if (refreshProject) await refreshProject();
        };
    }

    function setProjectActionNotice(message, show) {
        if (!actionNotice) return;
        actionNotice.textContent = message || '';
        actionNotice.style.display = show ? 'block' : 'none';
    }
}

// --- Existing setupVendorDashboardEvents, setupVendorJobDashboardEvents, helper functions remain unchanged ---

/*================================================================
END FILE: view_4_modal.js
UPDATED: 2026-06-10 @ 03:52 AM
================================================================*/
