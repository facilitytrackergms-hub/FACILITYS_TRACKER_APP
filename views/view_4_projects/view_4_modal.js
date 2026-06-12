/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
File pash : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_modal.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-12 @ 07:40 PM
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
    const { facility, refreshHome } = context;

    const modalsContainer = byId('homeModalsContainer');
    if (modalsContainer) {
        const facilityName = facility?.name || facility?.Name || 'Facility';
        modalsContainer.innerHTML = `
            <div id="cabinetProjectModal" class="cabinet-modal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
                <div class="cabinet-modal-body" style="background-color:#fefefe; margin:15% auto; padding:20px; border:1px solid #888; width:80%; max-width:500px; border-radius:8px; box-shadow:0 4px 8px rgba(0,0,0,0.2);">
                    <h3 style="margin-top:0; color:#003366;">Create New Project</h3>
                    <p style="margin:-10px 0 15px 0; font-size:14px; color:#555;">Property Context: <strong>${facilityName}</strong> · Project Dashboard</p>
                    
                    <div id="cabinetProjectModalNotice" style="display:none; color:red; margin-bottom:10px; font-weight:bold;"></div>
                    
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">Project Title / Name</label>
                    <input type="text" id="cabinetProjectTitleInput" class="cabinet-input" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px;" placeholder="e.g., FLIP ROOM 201">
                    
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">Notes</label>
                    <textarea id="cabinetProjectNotesInput" class="cabinet-textarea" style="width:100%; padding:8px; height:80px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px; resize:vertical;" placeholder="Enter initial project scope details or notes..."></textarea>
                    
                    <div style="text-align:right; gap:10px; display:flex; justify-content:flex-end;">
                        <button id="closeCabinetProjectModalBtn" class="cabinet-btn cabinet-btn-gray" style="padding:8px 16px; border-radius:4px; border:none; cursor:pointer;">Cancel</button>
                        <button id="saveCabinetProjectBtn" class="cabinet-btn cabinet-btn-green" style="padding:8px 16px; border-radius:4px; border:none; cursor:pointer; background-color:#28a745; color:white;">Create Project</button>
                    </div>
                    
                    <div id="uiTag_view_4_modal_home" class="ui-metadata-tag-view4" style="margin-top:15px; font-size:10px; color:#aaa; text-align:center;">
                        Source: view_4_modal.js | Created: 2026-06-12 07:40 PM
                    </div>
                </div>
            </div>
        `;
    }

    const closeProjectModalBtn = byId('closeCabinetProjectModalBtn');
    const saveProjectBtn = byId('saveCabinetProjectBtn');
    const projectModal = byId('cabinetProjectModal');
    const projectNotice = byId('cabinetProjectModalNotice');

    function setProjectNotice(message, show) {
        if (!projectNotice) return;
        projectNotice.textContent = message || '';
        projectNotice.style.display = show ? 'block' : 'none';
    }

    if (closeProjectModalBtn) {
        closeProjectModalBtn.onclick = () => {
            hideModal('cabinetProjectModal');
            setProjectNotice('', false);
        };
    }

    if (projectModal) {
        projectModal.onclick = (event) => {
            if (event.target === projectModal) {
                hideModal('cabinetProjectModal');
                setProjectNotice('', false);
            }
        };
    }

    if (saveProjectBtn) {
        saveProjectBtn.onclick = async () => {
            const projectTitle = value('cabinetProjectTitleInput').trim();
            const projectNotes = value('cabinetProjectNotesInput').trim();

            if (!facility || !facility.id) {
                setProjectNotice('[view_4_modal.js] Project Creation Error: Context missing facility profile reference context parameters.', true);
                return;
            }

            if (!projectTitle) {
                setProjectNotice('[view_4_modal.js] Project Creation Notice: Please enter a valid name or identifier description title.', true);
                return;
            }

            // Variable Struct Log: Changed key parameter naming mapping logic from project_title to project_name_text to prevent database constraint failure rows
            const result = await insertFacilityProject({
                facility_id: facility.id,
                project_name_text: projectTitle,
                notes: projectNotes,
                status: 'Pending',
                active_status: true
            });

            if (result && result.error) {
                setProjectNotice(`[view_4_modal.js] Database Error: Could not execute insertion statement pipeline block hooks. ${result.error.message}`, true);
                return;
            }

            clearValue('cabinetProjectTitleInput');
            clearValue('cabinetProjectNotesInput');
            hideModal('cabinetProjectModal');
            setProjectNotice('', false);

            if (refreshHome) {
                await refreshHome();
            } else {
                window.location.reload();
            }
        };
    }
}

// =================================================================

export function setupVendorDashboardEvents(context = {}) {
    console.log('[view_4_modal.js] setupVendorDashboardEvents initialized.', context);
}

export function setupVendorJobDashboardEvents(context = {}) {
    console.log('[view_4_modal.js] setupVendorJobDashboardEvents initialized.', context);
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
UPDATED: 2026-06-12 @ 07:40 PM
================================================================*/
