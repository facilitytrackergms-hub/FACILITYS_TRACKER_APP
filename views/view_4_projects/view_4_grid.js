/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_grid.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-12 @ 12:06 PM
================================================================*/
const __FILENAME = 'view_4_grid.js';

// =================== UPDATED IMPORTS ===================
import { renderProjectsHome } from './view_4_grid_components/view_4_home.js';
import { renderSingleProjectDashboard } from './view_4_grid_components/view_4_project_dashboard.js';
import { renderSingleVendorDashboard } from './view_4_grid_components/view_4_vendor_dashboard.js';
import { renderSingleVendorJobDashboard } from './view_4_grid_components/view_4_vendor_job_dashboard.js';
import { renderVendorQuotesFilesDashboard } from './view_4_grid_components/view_4_render_helpers.js';
// ======================================================

// Accept the system nav framework as the second argument from main.js router
export async function renderPendingProjects(data, nav) {
    return renderProjectsHome(data, nav || {
        renderPendingProjects: renderPendingProjects,
        renderProjectDashboard: renderProjectDashboard,
        renderVendorDashboard: renderVendorDashboard,
        renderVendorJobDashboard: renderVendorJobDashboard
    });
}

// Pass the rich runtime navigation engine down to the individual project dashboard screen
export async function renderProjectDashboard(data, nav) {
    return renderSingleProjectDashboard(data, nav || {
        renderPendingProjects: renderPendingProjects,
        renderProjectDashboard: renderProjectDashboard,
        renderVendorDashboard: renderVendorDashboard,
        renderVendorJobDashboard: renderVendorJobDashboard
    });
}

export async function renderVendorDashboard(data, nav) {
    return renderSingleVendorDashboard(data, nav || {
        renderPendingProjects: renderPendingProjects,
        renderProjectDashboard: renderProjectDashboard,
        renderVendorJobDashboard: renderVendorJobDashboard
    });
}

export async function renderVendorJobDashboard(data, nav) {
    return renderSingleVendorJobDashboard(data, nav || {
        renderProjectDashboard: renderProjectDashboard,
        renderVendorDashboard: renderVendorDashboard
    });
}

/*================================================================
END FILE: view_4_grid.js
UPDATED: 2026-06-12 @ 12:06 PM
================================================================*/
