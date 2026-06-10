/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_grid.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-09 @ 03:50 AM
================================================================*/
const __FILENAME = 'view_4_grid.js';

// =================== UPDATED IMPORTS ===================
import { renderProjectsHome } from './view_4_grid_components/view_4_home.js';
import { renderSingleProjectDashboard } from './view_4_grid_components/view_4_project_dashboard.js';
import { renderSingleVendorDashboard } from './view_4_grid_components/view_4_vendor_dashboard.js';
import { renderSingleVendorJobDashboard } from './view_4_grid_components/view_4_vendor_job_dashboard.js';
import { renderVendorQuotesFilesDashboard } from './view_4_grid_components/view_4_render_helpers.js';
// ======================================================

export async function renderPendingProjects(data) {
    return renderProjectsHome(data, {
        renderPendingProjects,
        renderProjectDashboard,
        renderVendorDashboard,
        renderVendorJobDashboard
    });
}

export async function renderProjectDashboard(data) {
    return renderSingleProjectDashboard(data, {
        renderPendingProjects
    });
}

export async function renderVendorDashboard(data) {
    return renderSingleVendorDashboard(data, {
        renderPendingProjects,
        renderVendorJobDashboard
    });
}

export async function renderVendorJobDashboard(data) {
    return renderSingleVendorJobDashboard(data, {
        renderVendorDashboard
    });
}

/*================================================================
END FILE: view_4_grid.js
UPDATED: 2026-06-09 @ 03:50 AM
================================================================*/
