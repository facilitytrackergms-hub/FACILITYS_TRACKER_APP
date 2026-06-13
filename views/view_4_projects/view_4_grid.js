/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_grid.js
File Path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files
VIEW NAME    : Facility Projects Dashboard Entry Router
LAST UPDATED : 2026-06-12 @ 11:55 PM
================================================================*/
const __FILENAME = 'view_4_grid.js';

// FIXED IMPORTS: Now explicitly looking inside your view_4_grid_components subfolder
import { renderProjectsHome } from './view_4_grid_components/view_4_home.js';
import { renderSingleProjectDashboard } from './view_4_grid_components/view_4_project_dashboard.js';
import { renderSingleVendorDashboard } from './view_4_grid_components/view_4_vendor_dashboard.js';
import { renderSingleVendorJobDashboard } from './view_4_grid_components/view_4_vendor_job_dashboard.js';
import { renderProjectReportBuilderView } from './view_4_action_dashboards/view_4_report_builder.js';
import { renderVendorQuotesFilesDashboard } from './view_4_grid_components/view_4_render_helpers.js';

export async function renderPendingProjects(data, nav) {
    return renderProjectsHome(data, nav || {
        renderPendingProjects,
        renderProjectDashboard,
        renderVendorDashboard,
        renderVendorJobDashboard,
        renderProjectReportBuilderView,
        renderReportBuilder
    });
}

export async function renderProjectDashboard(data, nav) {
    return renderSingleProjectDashboard(data, nav || {
        renderPendingProjects,
        renderProjectDashboard,
        renderVendorDashboard,
        renderVendorJobDashboard,
        renderProjectReportBuilderView,
        renderReportBuilder
    });
}

export async function renderVendorDashboard(data, nav) {
    return renderSingleVendorDashboard(data, nav || {
        renderPendingProjects,
        renderProjectDashboard,
        renderVendorJobDashboard,
        renderProjectReportBuilderView,
        renderReportBuilder
    });
}

export async function renderVendorJobDashboard(data, nav) {
    return renderSingleVendorJobDashboard(data, nav || {
        renderVendorDashboard,
        renderProjectDashboard,
        renderProjectReportBuilderView,
        renderReportBuilder
    });
}

export async function renderReportBuilder(data, nav) {
    return renderProjectReportBuilderView(data, nav || {
        renderPendingProjects,
        renderProjectDashboard,
        renderVendorDashboard,
        renderVendorJobDashboard,
        renderProjectReportBuilderView,
        renderReportBuilder
    });
}

/*================================================================
END FILE: view_4_grid.js
UPDATED: 2026-06-12 @ 11:55 PM
================================================================*/
