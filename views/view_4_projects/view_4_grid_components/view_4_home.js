/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_home.js
SUPABASE TBL : facility_projects, vendors
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project
LAST UPDATED : 2026-06-10 @ 06:50 AM
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

                <div id="uiTag_view_4_home" class="ui-metadata-tag-view4">
                    Source: view_4_home.js | Facility Projects Dashboard | Updated: 2026-06-10 06:50 AM
                </div>
            </div>
        </div>
    `;

    // 1. Initialize modal triggers and core events
    setupCabinetHomeEvents({
        facility,
        projects,
        vendors,
        refreshHome: () => nav.renderPendingProjects({ facility }),
        openVendor: vendorId => nav.renderVendorDashboard({ facility, vendorId }),
        openVendorJob: vendorJobId => nav.renderVendorJobDashboard({ facility, vendorJobId })
    });

    // 2. Context-Safe BACK BUTTON EVENT LISTENER 
    let backBtn = document.getElementById('cabinetBackBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (nav && typeof nav.renderFacilitiesDashboard === 'function') {
                nav.renderFacilitiesDashboard();
            } else if (nav && typeof nav.back === 'function') {
                nav.back();
            } else {
                window.history.back();
            }
        };
    }

    // 3. Bind CREATE NEW PROJECT button safely
    let addProjectBtn = document.getElementById('cabinetAddProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.onclick = () => {
            if (nav && typeof nav.renderPendingProjects === 'function') {
                nav.renderPendingProjects({ facility });
            } else {
                alert('Create Project: navigation method not available.');
            }
        };
    }

    // 4. Bind existing project tile list items
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
