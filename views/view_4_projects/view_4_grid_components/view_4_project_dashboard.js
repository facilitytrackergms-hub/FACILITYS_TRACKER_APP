/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_project_dashboard.js
SUPABASE TBL : facility_projects, project_actions, report_images
VIEW NAME    : Single Project Dashboard
POP-UP TITLE : Project Action Dashboard
LAST UPDATED : 2026-06-12 @ 11:55 PM
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
   in this section. Never alter any system comments or structural 
   markers.

4. MINIMALIST EXPLANATION RULE: Limit explanations to a maximum of one 
   or two concise sentences. No fluff.

5. STRICT MODIFICATION RULE: Do not attempt to improve, refactor, or 
   optimize any code unless explicitly requested. Execute ONLY the 
   specific updates or bug fixes requested, and leave all other parts 
   of the file completely intact. All untouched business logic, UI, 
   event handlers, variables, functions, and style contexts must be 
   preserved exactly as they are. Always output the entire file with all 
   historical contexts preserved.
================================================================*/

const __FILENAME = 'view_4_project_dashboard.js';

import {
    fetchProjectActions,
    getProjectTitle
} from '../view_4_data.js';

import {
    setupProjectDashboardEvents,
    renderProjectReportBuilderView
} from '../view_4_modal.js';

import {
    escapeHtml,
    renderProjectActionModal,
    renderProjectActions
} from './view_4_render_helpers.js';

import {
    renderStyles
} from './view_4_styles.js';

// Import supabase client if available globally, or look for it on the window object
const supabaseClient = window.supabase;

export async function renderSingleProjectDashboard({ facility, project, isFromReport = false }, nav) {
    const app = document.getElementById('app');

    if (!facility || !facility.id || !project || !project.id) {
        app.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_project_dashboard.js] Missing project dashboard context.</p>';
        return;
    }

    const actions = await fetchProjectActions(project.id);
    const facilityName = escapeHtml(facility.name || facility.Name || 'Facility');
    const projectTitle = escapeHtml(getProjectTitle(project));

    // Dynamic state evaluation context configuration
    const textButtonVisibility = isFromReport ? 'display: none;' : '';
    const emailButtonVisibility = isFromReport ? 'display: none;' : '';
    
    let navigationActionButtonsHtml = `
        <button id="projectBackBtn" class="cabinet-btn cabinet-btn-gray">
            10. ⬅️ Back to Projects
        </button>
    `;

    if (isFromReport) {
        navigationActionButtonsHtml = `
            <button id="projectAttachSelectedReportBtn" class="cabinet-btn cabinet-btn-green" style="background-color: #28a745; color: #fff; font-weight: bold; padding: 14px;">
                ➡️ ATTACH SELECTED IMAGES TO REPORT
            </button>
        `;
    }

    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">${projectTitle}</h1>
                <p class="vendor-cabinet-sub">${facilityName} · Project Dashboard</p>

                <div class="project-detail-box">
                    <div><strong>Project:</strong> ${projectTitle}</div>
                    <div><strong>Notes:</strong> ${escapeHtml(project.notes || '')}</div>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Project Action Dashboard</h2>

                    <input type="file" id="dashboardCameraInput" accept="image/*" capture="environment" style="display: none;" />

                    <div class="photo-buttons-row" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px; width: 100%;">
                        <button id="projectBeforePicBtn" class="cabinet-btn cabinet-btn-blue" style="margin: 0; padding: 12px 5px; font-size: 13px;">
                            1. 📸 BEFORE
                        </button>

                        <button id="projectDuringPicBtn" class="cabinet-btn cabinet-btn-blue" style="margin: 0; padding: 12px 5px; font-size: 13px;">
                            2. 📸 DURING
                        </button>

                        <button id="projectAfterPicBtn" class="cabinet-btn cabinet-btn-blue" style="margin: 0; padding: 12px 5px; font-size: 13px;">
                            3. 📸 AFTER
                        </button>
                    </div>

                    <div class="cabinet-action-grid">
                        <button id="projectStatusBtn" class="cabinet-btn cabinet-btn-blue" style="${textButtonVisibility}">
                            4. 📌 Project Status
                        </button>

                        <button id="projectSpecialNotesBtn" class="cabinet-btn cabinet-btn-blue" style="${textButtonVisibility}">
                            5. ⭐ Project Special Notes
                        </button>

                        <button id="projectSuppliesNeededBtn" class="cabinet-btn cabinet-btn-blue">
                            6. 🧰 Supplies / Parts Needed
                        </button>

                        <button id="projectVendorQuotesFilesBtn" class="cabinet-btn cabinet-btn-green" style="${emailButtonVisibility}">
                            7. 📄 Vendor Quotes / Files
                        </button>

                        <button id="projectCreateReportBtn" class="cabinet-btn cabinet-btn-blue" style="${emailButtonVisibility}">
                            8. 📋 Create Report
                        </button>

                        <button id="projectAddActionBtn" class="cabinet-btn cabinet-btn-green">
                            9. ➕ Create New Action Button
                        </button>

                        ${navigationActionButtonsHtml}
                    </div>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Project Actions</h2>
                    <div class="cabinet-stack">
                        ${renderProjectActions(actions)}
                    </div>
                </div>

                ${renderProjectActionModal()}

                <div id="uiTag_view_4_project_dashboard" class="ui-metadata-tag-view4">
                    Source: view_4_project_dashboard.js | Project Action Dashboard | Updated: 2026-06-12 @ 11:55 PM
                </div>
            </div>
        </div>
    `;

    // --- Unified Camera Navigation Router ---
    const routeToPhotoDashboard = (photoType) => {
        if (nav && nav.renderPhotoDashboard) {
            nav.renderPhotoDashboard({ 
                facility, 
                project, 
                photoType: photoType, 
                dashboardTitle: `${photoType.toUpperCase()} Photo Dashboard`,
                isFromReport: isFromReport
            });
        } else {
            alert(`${photoType} Dashboard routing requested, but nav.renderPhotoDashboard helper missing context definitions.`);
        }
    };

    // --- Button Click Linkings ---
    const beforePicBtn = document.getElementById('projectBeforePicBtn');
    if (beforePicBtn) beforePicBtn.onclick = () => routeToPhotoDashboard('Before');

    const duringPicBtn = document.getElementById('projectDuringPicBtn');
    if (duringPicBtn) duringPicBtn.onclick = () => routeToPhotoDashboard('During');

    const afterPicBtn = document.getElementById('projectAfterPicBtn');
    if (afterPicBtn) afterPicBtn.onclick = () => routeToPhotoDashboard('After');

    // Custom Submission Database Pipe for report connection integration
    const attachSelectedBtn = document.getElementById('projectAttachSelectedReportBtn');
    if (attachSelectedBtn) {
        attachSelectedBtn.onclick = async () => {
            // Evaluates active marked images within current active list
            const checkedElements = document.querySelectorAll('.gallery-checkbox:checked, input[type="checkbox"]:checked');
            const targetIds = Array.from(checkedElements).map(el => el.value).filter(val => val);

            if (targetIds.length === 0) {
                alert('[view_4_project_dashboard_notice]: Please select at least one captured image from the selection blocks.');
                return;
            }

            if (!supabaseClient) {
                alert('[view_4_project_dashboard_error]: Database client window context is currently unmounted.');
                return;
            }

            // Build structural insert arrays mapping selections directly into the persistent table
            const insertPayloads = targetIds.map(id => ({
                project_id: project.id,
                image_id: id,
                image_url: document.querySelector(`img[data-id="${id}"]`)?.src || ''
            }));

            const { error } = await supabaseClient
                .from('report_images')
                .insert(insertPayloads);

            if (error) {
                alert(`[view_4_project_dashboard_db_error]: ${error.message}`);
                return;
            }

            // Route back straight to report builder module cleanly
            renderProjectReportBuilderView({ facility, project }, nav);
        };
    }

    // Remaining Dashboard Navigation Links
    const backBtn = document.getElementById('projectBackBtn');
    if (backBtn) backBtn.onclick = () => nav.renderPendingProjects({ facility });

    const vendorBtn = document.getElementById('projectVendorQuotesFilesBtn');
    if (vendorBtn) vendorBtn.onclick = () => nav.renderVendorDashboard ? nav.renderVendorDashboard({ facility, project }) : alert('Vendor Quotes / Files clicked');

    const suppliesBtn = document.getElementById('projectSuppliesNeededBtn');
    if (suppliesBtn) suppliesBtn.onclick = () => nav.renderSuppliesDashboard ? nav.renderSuppliesDashboard({ facility, project }) : alert('Supplies / Parts Needed clicked');

    const statusBtn = document.getElementById('projectStatusBtn');
    if (statusBtn) statusBtn.onclick = () => nav.renderProjectStatus ? nav.renderProjectStatus({ facility, project }) : alert('Project Status clicked');

    const reportBtn = document.getElementById('projectCreateReportBtn');
    if (reportBtn) {
        reportBtn.onclick = () => {
            if (nav && nav.renderCreateReport) {
                nav.renderCreateReport({ facility, project });
            } else {
                renderProjectReportBuilderView({ facility, project }, nav);
            }
        };
    }

    const specialNotesBtn = document.getElementById('projectSpecialNotesBtn');
    if (specialNotesBtn) specialNotesBtn.onclick = () => nav.renderSpecialNotes ? nav.renderSpecialNotes({ facility, project }) : alert('Project Special Notes clicked');

    const addActionBtn = document.getElementById('projectAddActionBtn');
    if (addActionBtn) addActionBtn.onclick = () => nav.renderAddAction ? nav.renderAddAction({ facility, project }) : alert('Create New Action clicked');

    setupProjectDashboardEvents({
        facility,
        project,
        refreshProject: () => renderSingleProjectDashboard({ facility, project, isFromReport }, nav),
        nav
    });
}

/*================================================================
END FILE: view_4_project_dashboard.js
================================================================*/
