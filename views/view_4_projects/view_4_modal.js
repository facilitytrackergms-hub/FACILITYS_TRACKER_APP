/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
File pash : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_modal.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-10 @ 04:05 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response before 
   showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents 
   of an existing file unless the current code is fully pasted 
   into the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for 
     custom notifications. Always add a distinct, visible ID or tag 
     to the message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
     including this header and all rules, wrapped completely inside 
     a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
     (File Name, Table, View, Title, Date, Time) are fully updated 
     and preserved at the top of the file.
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

import { renderVendorQuotesFilesDashboard } from './view_4_grid_components/view_4_render_helpers.js';

// Local DOM Utility Fallbacks to prevent reference execution errors
const byId = (id) => document.getElementById(id);
const value = (id) => byId(id)?.value || '';
const clearValue = (id) => { const el = byId(id); if (el) el.value = ''; };
const showModal = (id) => { const el = byId(id); if (el) el.style.display = 'block'; };
const hideModal = (id) => { const el = byId(id); if (el) el.style.display = 'none'; };

// =================================================================
// ADDED MISSING MODULE EXPORTS TO RESOLVE ROUTING ROUTE SYNTAXERRORS
// =================================================================

export function setupCabinetHomeEvents(context = {}) {
    console.log('[view_4_modal.js] setupCabinetHomeEvents initialized.', context);
    // Wire up landing view events if DOM elements exist
}

export function setupVendorDashboardEvents(context = {}) {
    console.log('[view_4_modal.js] setupVendorDashboardEvents initialized.', context);
    // Wire up vendor summary layout events if DOM elements exist
}

export function setupVendorJobDashboardEvents(context = {}) {
    console.log('[view_4_modal.js] setupVendorJobDashboardEvents initialized.', context);
    // Wire up line item job metrics elements if DOM elements exist
}

// =================================================================

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

/*================================================================
END FILE: view_4_modal.js
UPDATED: 2026-06-10 @ 04:05 AM
================================================================*/
