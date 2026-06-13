/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
File path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_modal.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups, report_images
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action / Report Generator View
LAST UPDATED : 2026-06-12 @ 11:30 PM
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

const __FILENAME = 'view_4_modal.js';

import {
    fetchFacilityProjects,
    saveNewProject,
    saveProjectAction,
    fetchVendors,
    saveVendorJob,
    fetchVendorJobs,
    saveJobFollowup,
    fetchJobFollowups
} from './view_4_data.js';

import {
    escapeHtml,
    renderProjectRow,
    renderVendorJobRow,
    renderJobFollowupRow
} from './view_4_grid_components/view_4_render_helpers.js';

import {
    renderStyles
} from './view_4_grid_components/view_4_styles.js';

import {
    renderProjectReportBuilderView as renderRealProjectReportBuilderView
} from './view_4_grid_components/view_4_report_builder.js';

const supabaseClient = window.supabaseClient || window.supabase;

export function setupCabinetHomeEvents({ facility, projects, vendors, refreshHome, openVendor, nav }) {
    console.log(`[${__FILENAME}] setupCabinetHomeEvents initialized.`, { facility, projects, vendors, refreshHome, openVendor, nav });

    const openModalBtn = document.getElementById('openNewProjectModalBtn');
    if (openModalBtn) {
        openModalBtn.onclick = () => {
            const modal = document.getElementById('newProjectModal');
            if (modal) {
                modal.style.display = 'block';
                const fIdInput = document.getElementById('newProjFacilityId');
                if (fIdInput) fIdInput.value = facility.id || '';
            }
        };
    }

    const closeModalBtn = document.getElementById('closeNewProjectModalBtn');
    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            const modal = document.getElementById('newProjectModal');
            if (modal) modal.style.display = 'none';
        };
    }

    const cancelModalBtn = document.getElementById('cancelNewProjectBtn');
    if (cancelModalBtn) {
        cancelModalBtn.onclick = () => {
            const modal = document.getElementById('newProjectModal');
            if (modal) modal.style.display = 'none';
        };
    }

    const form = document.getElementById('newProjectForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const projectData = {
                facility_id: facility.id,
                project_name: document.getElementById('newProjName').value,
                project_type: document.getElementById('newProjType').value,
                priority: document.getElementById('newProjPriority').value,
                status: document.getElementById('newProjStatus').value,
                scope_of_work: document.getElementById('newProjScope').value,
                special_notes: document.getElementById('newProjNotes').value,
                start_date: document.getElementById('newProjStartDate').value || null,
                estimated_completion: document.getElementById('newProjEstCompletion').value || null
            };

            const result = await saveNewProject(projectData);
            if (submitBtn) submitBtn.disabled = false;

            if (result) {
                form.reset();
                const modal = document.getElementById('newProjectModal');
                if (modal) modal.style.display = 'none';
                if (refreshHome) refreshHome();
            } else {
                alert('Failed to save project. Check console for details.');
            }
        };
    }

    const projectContainer = document.getElementById('projectsContainer');
    if (projectContainer) {
        projectContainer.onclick = (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            const projectId = card.dataset.projectId;
            const project = projects.find(p => String(p.id) === String(projectId));

            if (project && nav && nav.renderProjectDashboard) {
                nav.renderProjectDashboard({ facility, project });
            }
        };
    }
}

export function setupProjectDashboardEvents({ facility, project, refreshProject, nav }) {
    console.log(`[${__FILENAME}] setupProjectDashboardEvents initialized.`, { facility, project, refreshProject, nav });

    const openActionModalBtn = document.getElementById('projectAddActionBtn');
    if (openActionModalBtn) {
        openActionModalBtn.onclick = () => {
            const modal = document.getElementById('newActionModal');
            if (modal) {
                modal.style.display = 'block';
                const pIdInput = document.getElementById('newActionProjectId');
                if (pIdInput) pIdInput.value = project.id || '';
            }
        };
    }

    const openReportBtn =
        document.getElementById('projectCreateReportBtn') ||
        document.getElementById('createProjectReportBtn') ||
        document.getElementById('createReportBtn') ||
        document.getElementById('projectReportBtn');

    if (openReportBtn) {
        openReportBtn.onclick = () => {
            renderRealProjectReportBuilderView({ facility, project }, nav);
        };
    }

    const closeActionModalBtn = document.getElementById('closeNewActionModalBtn');
    if (closeActionModalBtn) {
        closeActionModalBtn.onclick = () => {
            const modal = document.getElementById('newActionModal');
            if (modal) modal.style.display = 'none';
        };
    }

    const cancelActionBtn = document.getElementById('cancelNewActionBtn');
    if (cancelActionBtn) {
        cancelActionBtn.onclick = () => {
            const modal = document.getElementById('newActionModal');
            if (modal) modal.style.display = 'none';
        };
    }

    const actionForm = document.getElementById('newActionForm');
    if (actionForm) {
        actionForm.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = actionForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const actionData = {
                project_id: project.id,
                action_title: document.getElementById('newActionTitle').value,
                action_details: document.getElementById('newActionDetails').value,
                status: document.getElementById('newActionStatus').value,
                action_date: document.getElementById('newActionDate').value || new Date().toISOString().split('T')[0]
            };

            const result = await saveProjectAction(actionData);
            if (submitBtn) submitBtn.disabled = false;

            if (result) {
                actionForm.reset();
                const modal = document.getElementById('newActionModal');
                if (modal) modal.style.display = 'none';
                if (refreshProject) refreshProject();
            } else {
                alert('Failed to save action entry.');
            }
        };
    }
}
export async function renderProjectReportBuilderView({ facility, project }, nav) {
    const app = document.getElementById('app');
    if (!app) return;

    renderStyles();

    app.innerHTML = `
        <div class="report-builder-wrapper">
            <header class="report-header">
                <button id="rptBackToDashboardBtn" class="btn btn-secondary">&larr; Back to Dashboard</button>
                <h2>Report Generator &amp; Context Links</h2>
                <p>Facility: <strong>${escapeHtml(facility.name || 'N/A')}</strong> | Project: <strong>${escapeHtml(project.project_name || 'N/A')}</strong></p>
            </header>

            <div class="report-grid-layout">
                <div class="report-nav-card">
                    <h3>Dashboard Modules</h3>
                    <div class="report-nav-buttons">
                        <button id="rptGoSuppliesBtn" class="btn btn-nav-link">💼 Supplies Dashboard</button>
                        <button id="rptGoBeforeBtn" class="btn btn-nav-link">📸 BEFORE Photos</button>
                        <button id="rptGoDuringBtn" class="btn btn-nav-link">📸 DURING Photos</button>
                        <button id="rptGoAfterBtn" class="btn btn-nav-link">📸 AFTER Photos</button>
                        <button id="rptGoNotesBtn" class="btn btn-nav-link">📝 Special Notes</button>
                        <button id="rptGoStatusBtn" class="btn btn-nav-link">📊 Project Status Tracker</button>
                        <button id="rptGoQuotesBtn" class="btn btn-nav-link">📑 Vendor Quotes / Jobs</button>
                    </div>
                </div>

                <div class="report-builder-card">
                    <h3>Select Associated Images for Report Export</h3>
                    <p class="section-subtitle">Below is a list of uploaded project context images. Check the boxes to include them in compiled report pipelines.</p>
                    <div id="reportImagesLoader" class="loader-placeholder">Querying linked facility assets...</div>
                    <form id="reportGenerationForm">
                        <div id="reportImagesChecklist" class="report-checklist-container"></div>
                        <div class="report-actions-panel">
                            <button type="button" id="rptCompilePdfBtn" class="btn btn-primary">Compile PDF Report Context</button>
                            <button type="button" id="rptCompileExcelBtn" class="btn btn-success">Compile Data Spreadsheet</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    try {
        if (!supabaseClient) {
            throw new Error('Supabase integration layer client target reference unmounted or broken.');
        }

        const { data: records, error } = await supabaseClient
            .from('report_images')
            .select('*')
            .eq('project_id', project.id);

        if (error) throw error;

        const loader = document.getElementById('reportImagesLoader');
        if (loader) loader.remove();

        const checklistContainer = document.getElementById('reportImagesChecklist');
        if (checklistContainer) {
            if (!records || records.length === 0) {
                checklistContainer.innerHTML = `<p class="no-records-msg">No images or document attachments are currently bound to this project. Upload assets in photo or supply context dashboards to view report builders here.</p>`;
            } else {
                records.forEach(img => {
                    const block = document.createElement('div');
                    block.className = 'report-image-item';
                    block.innerHTML = `
                        <label class="checkbox-label">
                            <input type="checkbox" name="selectedReportImages" value="${escapeHtml(img.id)}">
                            <span class="custom-checkbox"></span>
                            <div class="img-preview-thumb">
                                <img src="${escapeHtml(img.image_url)}" alt="Attachment Preview" onerror="this.src='https://via.placeholder.com/80?text=No+Image';">
                            </div>
                            <div class="img-meta">
                                <span class="img-title">${escapeHtml(img.title || 'Untitled Asset Attachment')}</span>
                                <span class="img-tag tag-${(img.photo_type || 'General').toLowerCase()}">${escapeHtml(img.photo_type || 'General')}</span>
                            </div>
                        </label>
                    `;
                    checklistContainer.appendChild(block);
                });
            }
        }
    } catch (err) {
        console.error(`[${__FILENAME}] Failed to load report images from Supabase context relation:`, err);
        const loader = document.getElementById('reportImagesLoader');
        if (loader) {
            loader.innerHTML = `<p style="color:red; font-size:13px;">Error matching project attachment parameters: ${escapeHtml(err.message)}</p>`;
        }
    }

    const bindRoute = (id, targetAction) => {
        const el = document.getElementById(id);
        if (el) {
            el.onclick = () => {
                targetAction();
            };
        }
    };

    bindRoute('rptBackToDashboardBtn', () => {
        if (nav && nav.renderProjectDashboard) {
            nav.renderProjectDashboard({ facility, project });
        }
    });

    bindRoute('rptCompilePdfBtn', () => {
        alert('Compiling selected media into report context layout pipeline. Complete download streams will execute once backend rendering target hooks finish mounting.');
    });

    bindRoute('rptCompileExcelBtn', () => {
        alert('Exporting project actions, supply definitions, and timeline parameters into standard spreadsheet schema structures.');
    });

    bindRoute('rptGoSuppliesBtn', () => nav.renderSuppliesDashboard ? nav.renderSuppliesDashboard({ facility, project }) : alert('Supplies Dashboard unmounted'));
    bindRoute('rptGoBeforeBtn', () => nav.renderPhotoDashboard ? nav.renderPhotoDashboard({ facility, project, photoType: 'Before', dashboardTitle: 'BEFORE Photo Dashboard', isFromReport: true }) : alert('Photo Dashboard unmounted'));
    bindRoute('rptGoDuringBtn', () => nav.renderPhotoDashboard ? nav.renderPhotoDashboard({ facility, project, photoType: 'During', dashboardTitle: 'DURING Photo Dashboard', isFromReport: true }) : alert('Photo Dashboard unmounted'));
    bindRoute('rptGoAfterBtn', () => nav.renderPhotoDashboard ? nav.renderPhotoDashboard({ facility, project, photoType: 'After', dashboardTitle: 'AFTER Photo Dashboard', isFromReport: true }) : alert('Photo Dashboard unmounted'));
    bindRoute('rptGoNotesBtn', () => nav.renderSpecialNotes ? nav.renderSpecialNotes({ facility, project }) : alert('Special Notes View unmounted'));
    bindRoute('rptGoStatusBtn', () => nav.renderProjectStatus ? nav.renderProjectStatus({ facility, project }) : alert('Status View unmounted'));
    bindRoute('rptGoQuotesBtn', () => nav.renderVendorDashboard ? nav.renderVendorDashboard({ facility, project }) : alert('Vendor Dashboard unmounted'));
}

// Fixed: Added missing event listener wiring hook to satisfy layout triggers from view_4_vendor_dashboard.js
export function setupVendorDashboardEvents({ facility, project, vendors, refreshVendor, nav }) {
    console.log(`[${__FILENAME}] setupVendorDashboardEvents initialized.`, { facility, project, vendors, refreshVendor, nav });

    const backBtn = document.getElementById('backToProjectBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (nav && nav.renderProjectDashboard) nav.renderProjectDashboard({ facility, project });
        };
    }

    const container = document.getElementById('vendorButtonListContainer');
    if (container) {
        container.onclick = (e) => {
            const btn = e.target.closest('.vendor-btn');
            if (!btn) return;
            const vendorId = btn.dataset.vendorId;
            if (nav && nav.renderVendorJobDashboard) {
                nav.renderVendorJobDashboard({ facility, vendorJobId: vendorId });
            }
        };
    }
}

/*================================================================
END FILE: view_4_modal.js
UPDATED: 2026-06-12 @ 11:30 PM
================================================================*/
