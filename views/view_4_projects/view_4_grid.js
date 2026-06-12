/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_grid.js
File Path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files
VIEW NAME    : Facility Projects Dashboard Entry Router
LAST UPDATED : 2026-06-12 @ 04:22 PM
================================================================*/
const __FILENAME = 'view_4_grid.js';

// FIXED IMPORTS: Now explicitly looking inside your view_4_grid_components subfolder
import { renderProjectsHome } from './view_4_grid_components/view_4_home.js';
import { renderSingleProjectDashboard } from './view_4_grid_components/view_4_project_dashboard.js';
import { renderSingleVendorDashboard } from './view_4_grid_components/view_4_vendor_dashboard.js';
import { renderSingleVendorJobDashboard } from './view_4_grid_components/view_4_vendor_job_dashboard.js';
import { renderVendorQuotesFilesDashboard } from './view_4_grid_components/view_4_render_helpers.js';

export async function renderPendingProjects(data, nav) {
    return renderProjectsHome(data, nav || {
        renderPendingProjects,
        renderProjectDashboard,
        renderVendorDashboard,
        renderVendorJobDashboard
    });
}

export async function renderProjectDashboard(data, nav) {
    return renderSingleProjectDashboard(data, nav || {
        renderPendingProjects
    });
}

export async function renderVendorDashboard(data, nav) {
    return renderSingleVendorDashboard(data, nav || {
        renderPendingProjects,
        renderVendorJobDashboard
    });
}

export async function renderVendorJobDashboard(data, nav) {
    return renderSingleVendorJobDashboard(data, nav || {
        renderVendorDashboard
    });
}

/*================================================================
END FILE: view_4_grid.js
================================================================*/
