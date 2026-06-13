/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
File pash : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_modal.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups, report_images
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action / Report Generator View
LAST UPDATED : 2026-06-12 @ 10:55 PM
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

export function setupProjectDashboardEvents({ facility, project, refreshProject, vendors, nav }) {
    const addActionBtn = byId('projectAddActionBtn');
    const vendorQuotesFilesBtn = byId('projectVendorQuotesFilesBtn');
    const closeActionBtn = byId('closeProjectActionModalBtn');
    const saveActionBtn = byId('saveProjectActionBtn');
    const actionModal = byId('projectActionModal');
    const actionNotice = byId('projectActionModalNotice');
    const app = document.getElementById('app');

    // Mount the report builder onto window to guarantee router access regardless of navigation constraints
    window.renderProjectReportBuilderView = function(ctx, router) {
        renderProjectReportBuilderView(ctx, router || nav);
    };

    if (nav) {
        nav.renderCreateReport = (ctx) => renderProjectReportBuilderView(ctx, nav);
    }

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
                        window.renderSingleProjectDashboard({ facility, project }, nav);
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

// =================================================================
// NEW: REPORT GENERATOR BUILDER INTERFACE FOR BUTTON 8
// =================================================================
export async function renderProjectReportBuilderView({ facility, project }, nav) {
    const app = document.getElementById('app');
    if (!app) return;

    const facilityName = facility?.name || facility?.Name || 'Facility Name Placeholder';
    const facilityAddress = facility?.address || facility?.Address || 'No Address Data Provided';
    const facilityPhone = facility?.phone || facility?.Phone || 'No Phone Data Provided';
    const projectTitle = getProjectTitle(project);
    const currentDateString = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Live Supabase query to render any previously saved report attached pictures
    let attachedImagesHtml = `<p style="font-size:12px; color:#666; margin-top:5px;">No pictures attached to this report yet.</p>`;
    const supabaseClient = window.supabase;
    if (supabaseClient && project?.id) {
        try {
            const { data: attachedFiles, error } = await supabaseClient
                .from('report_images')
                .select('image_id, image_url')
                .eq('project_id', project.id);
            
            if (!error && attachedFiles && attachedFiles.length > 0) {
                attachedImagesHtml = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 10px; margin-top: 10px;">
                        ${attachedFiles.map(img => `
                            <div style="position: relative; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; aspect-ratio: 1;">
                                <img src="${img.image_url || ''}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><rect width=\'100%\' height=\'100%\' fill=\'%23eee\'/><text x=\'50%\' y=\'50%\' font-size=\'10\' text-anchor=\'middle\' fill=\'%23666\'>Photo ID ${img.image_id}</text></svg>'"/>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        } catch (err) {
            console.error('[view_4_modal.js] Failed to load report images from Supabase context relation:', err);
        }
    }

    app.innerHTML = `
        <div class="vendor-cabinet-shell" style="padding: 20px;">
            <div class="vendor-cabinet-card" style="background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto;">
                
                <div style="display: flex; justify-content: space-between; gap: 15px; margin-bottom: 25px;">
                    <button id="rptTextBtn" class="cabinet-btn cabinet-btn-blue" style="flex: 1; padding: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase;">
                        💬 Text Report
                    </button>
                    <button id="rptEmailBtn" class="cabinet-btn cabinet-btn-blue" style="flex: 1; padding: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase;">
                        ✉️ Email Report
                    </button>
                </div>

                <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 8px; margin-top: 0;">Project Execution Report Builder</h2>
                
                <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 15px; margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
                    <h4 style="margin: 0 0 8px 0; color: #495057; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">Property & Context Information</h4>
                    <div><strong>Facility Profile:</strong> ${facilityName}</div>
                    <div><strong>Address Location:</strong> ${facilityAddress}</div>
                    <div><strong>Contact Line:</strong> ${facilityPhone}</div>
                    <div><strong>Active Assignment:</strong> ${projectTitle}</div>
                    <div><strong>Generation Date:</strong> ${currentDateString}</div>
                </div>

                <div style="margin-bottom: 25px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 6px; color: #333; font-size: 14px;">Report Classification Type</label>
                    <select id="rptTypeSelector" class="cabinet-input" style="width: 100%; padding: 10px; margin-bottom: 18px; border: 1px solid #ccc; border-radius: 4px; background: white; font-size: 14px;">
                        <option value="Project Start Report">Project Start Report (Initial Assessment & Scope Setup)</option>
                        <option value="Update Report" selected>Update Report (Progress Status & Notes Log)</option>
                        <option value="Project Finish Report">Project Finish Report (Final Signoff & Execution Completion)</option>
                    </select>

                    <label style="display: block; font-weight: bold; margin-bottom: 6px; color: #333; font-size: 14px;">Project Evaluation / Discussion Notes</label>
                    <textarea id="rptDiscussionInput" class="cabinet-textarea" style="width: 100%; padding: 10px; height: 110px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; resize: vertical;" placeholder="e.g., The door is broken, structural hinges worn down. We are going to have to source and buy a new replacement door setup..."></textarea>
                </div>

                <h3 style="color: #003366; font-size: 16px; margin: 25px 0 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Attached Report Pictures</h3>
                <div id="ui_report_attached_gallery_view" style="margin-bottom: 20px; padding: 10px; border: 1px dashed #ccc; border-radius: 6px; background: #fafafa;">
                    ${attachedImagesHtml}
                </div>

                <h3 style="color: #003366; font-size: 16px; margin: 25px 0 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Attach & Review Dashboard Components</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 25px;">
                    <button id="rptGoSuppliesBtn" class="cabinet-btn cabinet-btn-green" style="font-size: 12px; padding: 10px 5px; margin: 0;">🧰 Link Parts & Supplies Needed (Btn 6)</button>
                    <button id="rptGoBeforeBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 10px 5px; margin: 0;">📸 Attach Before Photos (Btn 1)</button>
                    <button id="rptGoDuringBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 10px 5px; margin: 0;">📸 Attach During Photos (Btn 2)</button>
                    <button id="rptGoAfterBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 10px 5px; margin: 0;">📸 Attach After Photos (Btn 3)</button>
                    <button id="rptGoNotesBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 10px 5px; margin: 0;">⭐ Review Special Notes (Btn 5)</button>
                    <button id="rptGoStatusBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 10px 5px; margin: 0;">📌 Check Project Status (Btn 4)</button>
                    <button id="rptGoQuotesBtn" class="cabinet-btn cabinet-btn-green" style="grid-column: span 2; font-size: 12px; padding: 10px 5px; margin: 0;">📄 Link Vendor Quotes & Files (Btn 7)</button>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                    <button id="rptBackToDashboardBtn" class="cabinet-btn cabinet-btn-gray" style="padding: 10px 20px; font-size: 14px;">
                        ⬅️ Return to Dashboard
                    </button>
                </div>

                <div id="uiTag_view_4_report_builder" class="ui-metadata-tag-view4" style="margin-top: 20px; font-size: 10px; color: #bbb; text-align: center;">
                    Source: view_4_modal.js | Report Context Module Pipeline | Updated: 2026-06-12 10:55 PM
                </div>
            </div>
        </div>
    `;

    // Routing Link Logic Integrations
    const returnBtn = byId('rptBackToDashboardBtn');
    if (returnBtn) {
        returnBtn.onclick = () => {
            if (window.renderSingleProjectDashboard) {
                window.renderSingleProjectDashboard({ facility, project }, nav);
            }
        };
    }

    // Action Transmission Handlers
    const textBtn = byId('rptTextBtn');
    if (textBtn) {
        textBtn.onclick = () => {
            const currentType = value('rptTypeSelector');
            const notesTxt = value('rptDiscussionInput');
            alert(`[Report Transmission Dispatch]\nType: ${currentType}\nTargeting Facility Contact: ${facilityPhone}\n\nNotes Content:\n${notesTxt || '(Empty Discussion)'}`);
        };
    }

    const emailBtn = byId('rptEmailBtn');
    if (emailBtn) {
        emailBtn.onclick = () => {
            const currentType = value('rptTypeSelector');
            const notesTxt = value('rptDiscussionInput');
            alert(`[Report Transmission Dispatch]\nType: ${currentType}\nGenerating email body distribution layout payload for ${facilityName}.\n\nNotes Content:\n${notesTxt || '(Empty Discussion)'}`);
        };
    }

    // Interactive Deep-Link Router Hookings passing workflow pipeline flags dynamically to the photo views
    const bindRoute = (id, targetAction) => {
        const btn = byId(id);
        if (btn) {
            btn.onclick = () => {
                if (!nav) {
                    alert('Navigation context state definition model is currently unmounted.');
                    return;
                }
                targetAction();
            };
        }
    };

    bindRoute('rptGoSuppliesBtn', () => nav.renderSuppliesDashboard ? nav.renderSuppliesDashboard({ facility, project }) : alert('Supplies Dashboard unmounted'));
    bindRoute('rptGoBeforeBtn', () => nav.renderPhotoDashboard ? nav.renderPhotoDashboard({ facility, project, photoType: 'Before', dashboardTitle: 'BEFORE Photo Dashboard', isFromReport: true }) : alert('Photo Dashboard unmounted'));
    bindRoute('rptGoDuringBtn', () => nav.renderPhotoDashboard ? nav.renderPhotoDashboard({ facility, project, photoType: 'During', dashboardTitle: 'DURING Photo Dashboard', isFromReport: true }) : alert('Photo Dashboard unmounted'));
    bindRoute('rptGoAfterBtn', () => nav.renderPhotoDashboard ? nav.renderPhotoDashboard({ facility, project, photoType: 'After', dashboardTitle: 'AFTER Photo Dashboard', isFromReport: true }) : alert('Photo Dashboard unmounted'));
    bindRoute('rptGoNotesBtn', () => nav.renderSpecialNotes ? nav.renderSpecialNotes({ facility, project }) : alert('Special Notes View unmounted'));
    bindRoute('rptGoStatusBtn', () => nav.renderProjectStatus ? nav.renderProjectStatus({ facility, project }) : alert('Status View unmounted'));
    bindRoute('rptGoQuotesBtn', () => nav.renderVendorDashboard ? nav.renderVendorDashboard({ facility, project }) : alert('Vendor Dashboard unmounted'));
}

/*================================================================
END FILE: view_4_modal.js
UPDATED: 2026-06-12 @ 10:55 PM
================================================================*/
