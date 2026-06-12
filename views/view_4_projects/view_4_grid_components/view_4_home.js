/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_home.js
SUPABASE TBL : facility_projects, vendors
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project
LAST UPDATED : 2026-06-12 @ 03:55 AM
================================================================*/
const __FILENAME = 'view_4_home.js';

import {
    fetchFacilityProjects,
    fetchVendors
} from '../view_4_data.js';

import {
    setupCabinetHomeEvents
} from '../view_4_modal.js';

import {
    escapeHtml,
    renderProjectButtons,
    renderHomeModals
} from './view_4_render_helpers.js';

import {
    renderStyles
} from './view_4_styles.js';

export async function renderProjectsHome(data, nav) {
    const facility = data?.facility ? data.facility : data;

    if (!facility || !facility.id) {
        console.error('[view_4_home.js] Facility context missing inside Facility Projects Dashboard.');
        const appMissing = document.getElementById('app');
        if (appMissing) {
            appMissing.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_home.js] Missing facility context.</p>';
        }
        return;
    }

    const app = document.getElementById('app');
    const facilityName = escapeHtml(facility.name || facility.Name || 'Facility');

    const [projects, vendors] = await Promise.all([
        fetchFacilityProjects(facility.id),
        fetchVendors()
    ]);

    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">${facilityName} Projects Dashboard</h1>
                <p class="vendor-cabinet-sub">Facility Projects</p>

                <div class="cabinet-action-grid single-action-grid">
                    <button id="cabinetAddProjectBtn" class="cabinet-btn cabinet-btn-green">➕ Create New Project</button>
                    <button id="cabinetBackBtn" class="cabinet-btn cabinet-btn-gray">⬅️ Back</button>
                </div>

                <div style="display:none;">
                    <button id="addProjectBtn" type="button">Hidden Core Add Project</button>
                    <button id="cabinetAddVendorBtn" type="button">Hidden Add Vendor</button>
                    <button id="cabinetStartVendorJobBtn" type="button">Hidden Start Vendor Job</button>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Facility Projects</h2>
                    <div id="facilityProjectButtonGrid" class="project-button-grid">
                        ${renderProjectButtons(projects)}
                    </div>
                </div>

                ${renderHomeModals(projects, vendors)}

                <div id="cabinetProjectModal" class="cabinet-modal" style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                    <div class="vendor-cabinet-card" style="width: 100%; max-width: 500px; position: relative; padding: 25px; box-sizing: border-box;">
                        <h2 class="cabinet-section-title" style="margin-top: 0;">Create New Project</h2>
                        <form id="directProjectSubmissionForm" style="display: flex; flex-direction: column; gap: 15px;">
                            <input type="hidden" name="facility_id" value="${facility.id}">
                            
                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #00264d;">Project Title</label>
                                <input type="text" id="customProjectTitleField" name="project_title_text" required placeholder="e.g. Kitchen AC Repair" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box;">
                            </div>

                            <div>
                                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #00264d;">Notes / Description</label>
                                <textarea id="customProjectNotesField" name="notes" placeholder="Describe the issue or project goals..." style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; height: 100px; resize: vertical;"></textarea>
                            </div>

                            <div class="cabinet-action-grid" style="margin-top: 10px;">
                                <button type="submit" class="cabinet-btn cabinet-btn-green">💾 Save Project</button>
                                <button type="button" id="closeProjectModalBtn" class="cabinet-btn cabinet-btn-gray">❌ Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div id="uiTag_view_4_home" class="ui-metadata-tag-view4">
                    Source: view_4_home.js | Facility Projects Dashboard | Updated: 2026-06-12 03:55 AM
                </div>
            </div>
        </div>
    `;

    // 1. Initialize background layout hooks
    setupCabinetHomeEvents({
        facility,
        projects,
        vendors,
        refreshHome: () => {},
        openVendor: vendorId => nav.renderVendorDashboard({ facility, vendorId }),
        openVendorJob: vendorJobId => nav.renderVendorJobDashboard({ facility, vendorJobId })
    });

    // 2. Back Action Handler
    let backBtn = document.getElementById('cabinetBackBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', { facility: facility });
            }
        };
    }

    // 3. Modal Box Toggles
    const projectModal = document.getElementById('cabinetProjectModal');
    const cabinetAddProjectBtn = document.getElementById('cabinetAddProjectBtn');
    const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');

    if (cabinetAddProjectBtn && projectModal) {
        cabinetAddProjectBtn.onclick = () => {
            projectModal.style.display = 'flex';
        };
    }

    if (closeProjectModalBtn && projectModal) {
        closeProjectModalBtn.onclick = () => {
            projectModal.style.display = 'none';
        };
    }

    // 4. Intercept Submit and Write Directly to Supabase using Explicit Column Definitions
    const directForm = document.getElementById('directProjectSubmissionForm');
    if (directForm) {
        directForm.onsubmit = async (e) => {
            e.preventDefault();

            const titleValue = document.getElementById('customProjectTitleField').value.trim();
            const notesValue = document.getElementById('customProjectNotesField').value.trim();

            if (!titleValue) return;

            try {
                let databaseClient = window.supabase;
                
                if (!databaseClient && window.createClient) {
                    databaseClient = window.createClient();
                }

                if (databaseClient) {
                    const { error } = await databaseClient
                        .from('facility_projects')
                        .insert([
                            {
                                facility_id: parseInt(facility.id, 10),
                                project_name_text: titleValue,
                                project_title_text: titleValue,
                                notes: notesValue || null,
                                active_status: true
                            }
                        ]);

                    if (error) throw error;
                } else {
                    console.error('Supabase application environment reference context was not resolved.');
                }

                // Hide frame container and clear text buffer values
                projectModal.style.display = 'none';
                directForm.reset();

                // Force component stream interface refresh to re-pull records live from Supabase
                if (nav && typeof nav.renderPendingProjects === 'function') {
                    nav.renderPendingProjects({ facility });
                } else {
                    renderProjectsHome({ facility }, nav);
                }

            } catch (err) {
                console.error('Database insertion runtime transaction failure error details:', err);
                alert('Database Error: Unable to complete project save operations. Verify schema constraints.');
            }
        };
    }

    // 5. Existing Project Grid Interactivity Navigation Handlers
    document.querySelectorAll('[data-open-project]').forEach(button => {
        button.onclick = () => {
            const projectId = button.dataset.openProject;
            const selectedProject = projects.find(project => String(project.id) === String(projectId));

            if (!selectedProject) {
                alert('[view_4_home.js] Project Button Error: Project was not found in the current facility project list.');
                return;
            }

            nav.renderProjectDashboard({ facility, project: selectedProject });
        };
    });
}

/*================================================================
END FILE: view_4_home.js
================================================================*/
