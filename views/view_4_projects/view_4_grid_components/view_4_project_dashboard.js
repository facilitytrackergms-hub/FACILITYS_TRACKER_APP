/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_project_dashboard.js
SUPABASE TBL : facility_projects, project_actions
VIEW NAME    : Single Project Dashboard
POP-UP TITLE : Project Action Dashboard
LAST UPDATED : 2026-06-09 @ 02:40 AM
================================================================*/
const __FILENAME = 'view_4_project_dashboard.js';

import {
    fetchProjectActions,
    getProjectTitle
} from '../view_4_data.js';

import {
    setupProjectDashboardEvents
} from '../view_4_modal.js';

// ================= UPDATED IMPORT PATH =================
import {
    escapeHtml,
    renderProjectActionModal,
    renderProjectActions
} from './view_4_grid_components/view_4_render_helpers.js';
// ========================================================

import {
    renderStyles
} from './view_4_grid_components/view_4_styles.js';

export async function renderSingleProjectDashboard({ facility, project }, nav) {
    const app = document.getElementById('app');

    if (!facility || !facility.id || !project || !project.id) {
        app.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_project_dashboard.js] Missing project dashboard context.</p>';
        return;
    }

    const actions = await fetchProjectActions(project.id);
    const facilityName = escapeHtml(facility.name || facility.Name || 'Facility');
    const projectTitle = escapeHtml(getProjectTitle(project));

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

                    <div class="cabinet-action-grid">
                        <button id="projectVendorQuotesFilesBtn" class="cabinet-btn cabinet-btn-green">
                            1. 📄 Vendor Quotes / Files
                        </button>

                        <button id="projectSuppliesNeededBtn" class="cabinet-btn cabinet-btn-blue">
                            2. 🧰 Supplies / Parts Needed
                        </button>

                        <button id="projectStatusBtn" class="cabinet-btn cabinet-btn-blue">
                            3. 📌 Project Status
                        </button>

                        <button id="projectCreateReportBtn" class="cabinet-btn cabinet-btn-blue">
                            4. 📋 Create Report
                        </button>

                        <button id="projectSpecialNotesBtn" class="cabinet-btn cabinet-btn-blue">
                            5. ⭐ Project Special Notes
                        </button>

                        <button id="projectAddActionBtn" class="cabinet-btn cabinet-btn-green">
                            6. ➕ Create New Action Button
                        </button>

                        <button id="projectBackBtn" class="cabinet-btn cabinet-btn-gray">
                            7. ⬅️ Back to Projects
                        </button>
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
                    Source: view_4_project_dashboard.js | Project Action Dashboard | Updated: 2026-06-09 02:40 AM
                </div>
            </div>
        </div>
    `;

    const backBtn = document.getElementById('projectBackBtn');
    if (backBtn) {
        backBtn.onclick = () => nav.renderPendingProjects({ facility });
    }

    setupProjectDashboardEvents({
        facility,
        project,
        refreshProject: () => renderSingleProjectDashboard({ facility, project }, nav)
    });
}

/*================================================================
END FILE: view_4_project_dashboard.js
UPDATED: 2026-06-09 @ 02:40 AM
================================================================*/
