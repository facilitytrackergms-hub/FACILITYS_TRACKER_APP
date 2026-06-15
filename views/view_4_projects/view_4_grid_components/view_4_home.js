/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_home.js
File Path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_home.js
SUPABASE TBL : facility_projects, vendors
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Delete Facility Project
LAST UPDATED : 2026-06-15 @ 05:53 PM
================================================================*/
const __FILENAME = 'view_4_home.js';

import {
    fetchFacilityProjects,
    fetchVendors
} from '../view_4_core/view_4_data.js';

import {
    setupCabinetHomeEvents
} from '../view_4_core/view_4_modal.js';

import {
    escapeHtml,
    renderProjectButtons,
    renderHomeModals
} from './view_4_render_helpers.js';

import {
    renderStyles
} from './view_4_styles.js';

async function getSupabaseClientForView4Home() {
    const possiblePaths = [
        '../../../js/supabaseClient.js',
        '../../js/supabaseClient.js',
        '../js/supabaseClient.js'
    ];

    for (const path of possiblePaths) {
        try {
            const module = await import(path);
            if (module.supabase) return module.supabase;
        } catch (error) {
            // Try next known path.
        }
    }

    console.error('[view_4_home.js] Supabase client could not be loaded from known paths.');
    return null;
}

async function deleteFacilityProject(projectId) {
    const supabase = await getSupabaseClientForView4Home();

    if (!supabase) {
        throw new Error('Supabase client not found.');
    }

    const { error } = await supabase
        .from('facility_projects')
        .delete()
        .eq('id', projectId);

    if (error) {
        throw error;
    }

    return true;
}

function injectDeleteProjectStyles() {
    if (document.getElementById('view4ProjectDeleteStyles')) return;

    const style = document.createElement('style');
    style.id = 'view4ProjectDeleteStyles';
    style.textContent = `
        .project-delete-ready {
            position: relative !important;
            padding-right: 58px !important;
        }

        .project-delete-trash-btn {
            position: absolute;
            top: 14px;
            right: 14px;
            width: 34px;
            height: 34px;
            border: none;
            border-radius: 50%;
            background: #d93025;
            color: #ffffff;
            font-size: 18px;
            font-weight: 900;
            line-height: 34px;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.22);
            z-index: 5;
        }

        .project-delete-trash-btn:hover {
            background: #b3261e;
        }

        .view4-delete-modal-backdrop {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .view4-delete-modal-card {
            width: 100%;
            max-width: 390px;
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 10px 35px rgba(0,0,0,0.30);
            padding: 24px;
            text-align: center;
            border: 2px solid #d93025;
        }

        .view4-delete-modal-title {
            margin: 0 0 10px 0;
            color: #002f5f;
            font-size: 22px;
            font-weight: 900;
            text-transform: uppercase;
        }

        .view4-delete-modal-text {
            margin: 0 0 22px 0;
            color: #333333;
            font-size: 17px;
            line-height: 1.35;
        }

        .view4-delete-modal-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .view4-delete-confirm-btn,
        .view4-delete-cancel-btn {
            border: none;
            border-radius: 12px;
            padding: 14px 12px;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
            text-transform: uppercase;
        }

        .view4-delete-confirm-btn {
            background: #d93025;
            color: #ffffff;
        }

        .view4-delete-cancel-btn {
            background: #6b7280;
            color: #ffffff;
        }

        .view4-delete-modal-notice {
            display: none;
            margin-top: 14px;
            color: #d93025;
            font-size: 14px;
            font-weight: 800;
        }
    `;
    document.head.appendChild(style);
}

function renderDeleteProjectModal() {
    return `
        <div id="view4DeleteProjectModal" class="view4-delete-modal-backdrop">
            <div class="view4-delete-modal-card">
                <h3 class="view4-delete-modal-title">Delete Project</h3>
                <p class="view4-delete-modal-text">
                    Are you sure you want to delete this facility project?
                </p>

                <div class="view4-delete-modal-actions">
                    <button id="view4ConfirmDeleteProjectBtn" type="button" class="view4-delete-confirm-btn">Delete</button>
                    <button id="view4CancelDeleteProjectBtn" type="button" class="view4-delete-cancel-btn">Cancel</button>
                </div>

                <div id="view4DeleteProjectNotice" class="view4-delete-modal-notice"></div>
            </div>
        </div>
    `;
}

function bindProjectDeleteButtons(projects, facility, nav) {
    injectDeleteProjectStyles();

    const modal = document.getElementById('view4DeleteProjectModal');
    const confirmBtn = document.getElementById('view4ConfirmDeleteProjectBtn');
    const cancelBtn = document.getElementById('view4CancelDeleteProjectBtn');
    const notice = document.getElementById('view4DeleteProjectNotice');

    let selectedProjectId = null;

    function closeModal() {
        selectedProjectId = null;
        if (notice) {
            notice.textContent = '';
            notice.style.display = 'none';
        }
        if (modal) modal.style.display = 'none';
    }

    function openModal(projectId) {
        selectedProjectId = projectId;
        if (notice) {
            notice.textContent = '';
            notice.style.display = 'none';
        }
        if (modal) modal.style.display = 'flex';
    }

    document.querySelectorAll('[data-open-project]').forEach(projectButton => {
        const projectId = projectButton.dataset.openProject;

        if (!projectId || projectButton.querySelector('.project-delete-trash-btn')) {
            return;
        }

        projectButton.classList.add('project-delete-ready');

        const trashBtn = document.createElement('button');
        trashBtn.type = 'button';
        trashBtn.className = 'project-delete-trash-btn';
        trashBtn.title = 'Delete Project';
        trashBtn.innerHTML = '🗑';

        trashBtn.onclick = event => {
            event.preventDefault();
            event.stopPropagation();
            openModal(projectId);
        };

        projectButton.appendChild(trashBtn);
    });

    if (cancelBtn) {
        cancelBtn.onclick = event => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            closeModal();
        };
    }

    if (modal) {
        modal.onclick = event => {
            if (event.target === modal) {
                closeModal();
            }
        };
    }

    if (confirmBtn) {
        confirmBtn.onclick = async event => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            if (!selectedProjectId) {
                closeModal();
                return;
            }

            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Deleting...';

            if (notice) {
                notice.textContent = '';
                notice.style.display = 'none';
            }

            try {
                await deleteFacilityProject(selectedProjectId);

                closeModal();

                if (nav && typeof nav.renderPendingProjects === 'function') {
                    nav.renderPendingProjects({ facility });
                } else {
                    window.location.reload();
                }
            } catch (error) {
                console.error('[view_4_home.js] Delete facility project failed:', error);

                if (notice) {
                    notice.textContent = 'Delete failed. Check related records or table policy.';
                    notice.style.display = 'block';
                }
            } finally {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Delete';
            }
        };
    }
}

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
                ${renderDeleteProjectModal()}

                <div id="uiTag_view_4_home" class="ui-metadata-tag-view4">
                    Source: view_4_home.js | Facility Projects Dashboard | Updated: 2026-06-13 07:35 PM
                </div>
            </div>
        </div>
    `;

    // 1. Initialize modal triggers and core events
    setupCabinetHomeEvents({
        facility,
        projects,
        vendors,
        refreshHome: () => {
            if (nav && typeof nav.renderPendingProjects === 'function') {
                nav.renderPendingProjects({ facility });
            } else {
                window.location.reload();
            }
        },
        openVendor: vendorId => nav.renderVendorDashboard({ facility, vendorId }),
        openVendorJob: vendorJobId => nav.renderVendorJobDashboard({ facility, vendorJobId })
    });

    // 2. Context-Safe BACK BUTTON EVENT LISTENER 
    // [REPLACED START]
    let backBtn = document.getElementById('cabinetBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            console.log('[DEBUG] Back Button clicked');
            if (window.navigateTo) {
                window.navigateTo('view_1_facility');
            }
        });
    }

    // 3. Bind CREATE NEW PROJECT button safely
    let addProjectBtn = document.getElementById('cabinetAddProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', (e) => {
            console.log('[DEBUG] Create Project clicked');
            if (e) e.preventDefault();
            const projectModal = document.getElementById('cabinetProjectModal');
            if (projectModal) {
                const titleInput = document.getElementById('cabinetProjectTitleInput');
                const notesInput = document.getElementById('cabinetProjectNotesInput');
                const noticeDiv = document.getElementById('cabinetProjectModalNotice');
                if (titleInput) titleInput.value = '';
                if (notesInput) notesInput.value = '';
                if (noticeDiv) noticeDiv.style.display = 'none';
                
                projectModal.style.display = 'block';
            } else {
                console.warn('[view_4_home.js] cabinetProjectModal layout structural element not found in DOM context.');
            }
        });
    }
    // [REPLACED END]

    // 4. Bind existing project tile list items
    document.querySelectorAll('[data-open-project]').forEach(button => {
        button.onclick = () => {
            const projectId = button.dataset.openProject;
            const selectedProject = projects.find(project => String(project.id) === String(projectId));

            if (!selectedProject) {
                alert('[view_4_home.js] Project Button Error: Project was not found in the current facility project list.');
                return;
            }

            // CRITICAL ROUTING INTERCEPT: Checks all available nav parameters safely to prevent 404 imports
            if (nav && typeof nav.renderSingleProjectDashboard === 'function') {
                nav.renderSingleProjectDashboard({ facility, project: selectedProject });
            } else if (nav && typeof nav.renderProjectDashboard === 'function') {
                nav.renderProjectDashboard({ facility, project: selectedProject });
            } else if (window.view4Engine && typeof window.view4Engine.renderProjectDashboard === 'function') {
                window.view4Engine.renderProjectDashboard({ facility, project: selectedProject }, nav);
            } else {
                if (window.appNavigation && typeof window.appNavigation.navigateTo === 'function') {
                    window.appNavigation.navigateTo('project_dashboard', { facility, project: selectedProject });
                }
            }
        };
    });

    // 5. Bind project delete garbage buttons and confirmation popup
    bindProjectDeleteButtons(projects, facility, nav);
}

/*================================================================
END FILE: view_4_home.js
VERSION TAG: view_4_home.js | 2026-06-13 07:35 PM
================================================================*/
