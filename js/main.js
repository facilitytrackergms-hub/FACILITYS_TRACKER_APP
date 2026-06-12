/* =================================================================
AUTOMATED PATH UPDATE INSTRUCTION
================================================================
FILE: main.js
UPDATED: 2026-06-12 @ 12:45 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top current files and new files.
================================================= */

window.navigateTo = async (view, context = {}) => {
    const app = document.getElementById('app');
    if (!app) {
        console.error("App container not found.");
        return;
    }

    if (!context || Object.keys(context).length === 0) {
        context = { id: 1, name: "Default Facility Headquarter" };
    }

    const facilityViews = ['view_2_controls','view_3_contacts','view_4_projects','view_5_issues','view_6_images','view_7_followups','view_4_photo_dashboard'];
    if (facilityViews.includes(view)) {
        const facilityId = context?.facility?.id || context?.id || context?.facilityId;
        if (!facilityId || String(facilityId) === '[object Object]') {
            console.warn(`Navigation altered to "${view}": Overriding empty payload context with active fallback numeric instance.`);
            context = { id: 1, name: "Default Facility Headquarter" };
        } else if (!context.facility && facilityId) {
            context.facility = { ...context, id: facilityId };
        }
    }

    app.innerHTML = '<p style="text-align:center; padding:50px;">Loading...</p>';
    const cb = "?v=2026_vendor_jobs_v1";

    const navRuntime = {
        renderPendingProjects: (ctx) => window.navigateTo('view_4_projects', ctx),
        renderPhotoDashboard: (ctx) => {
            // --- Minimal placeholder for Photo Dashboard ---
            const photoApp = document.getElementById('main-content-display-area') || document.body;
            photoApp.innerHTML = `
                <div style="text-align:center; padding:50px;">
                    <h2>${ctx.dashboardTitle || 'Photo Dashboard'}</h2>
                    <p>Facility: ${ctx.facility?.name || 'N/A'}</p>
                    <p>Project: ${ctx.project?.project_title_text || ctx.project?.title || 'N/A'}</p>
                    <p>This is a placeholder for the ${ctx.photoType || 'Unknown'} Photo Dashboard.</p>
                    <button onclick="window.navigateTo('view_4_project_dashboard', { facility: ${JSON.stringify(ctx.facility)}, project: ${JSON.stringify(ctx.project)} })">
                        ⬅️ Back to Project Dashboard
                    </button>
                </div>
            `;
        },
        renderSingleProjectDashboard: (ctx) => window.navigateTo('view_4_project_dashboard', ctx),
        renderVendorDashboard: (ctx) => alert('Vendor Dashboard module coming soon!'),
        renderSuppliesDashboard: (ctx) => alert('Supplies Dashboard module coming soon!'),
        renderProjectStatus: (ctx) => alert('Project Status module coming soon!'),
        renderCreateReport: (ctx) => alert('Create Report module coming soon!'),
        renderSpecialNotes: (ctx) => alert('Special Notes module coming soon!'),
        renderAddAction: (ctx) => alert('Add Action module coming soon!')
    };

    try {
        if (view === 'view_1_facility' || view === 'dashboard' || view === 'facility' || view === 'view_1_dashboard') {
            const { renderFacilities } = await import(`/FACILITYS_TRACKER_APP/views/view_1_facility/view_1_grid.js${cb}`);
            await renderFacilities(context);
        } 
        else if (view === 'view_2_controls') {
            const { renderFacilityControls } = await import(`/FACILITYS_TRACKER_APP/views/view_2_controls/view_2_grid.js${cb}`);
            await renderFacilityControls(context);
        }
        else if (view === 'view_3_contacts') {
            const { renderFacilityContacts } = await import(`/FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_grid.js${cb}`);
            await renderFacilityContacts(context);
        }
        else if (view === 'view_4_projects') {
            const { renderPendingProjects } = await import(`/FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid.js${cb}`);
            await renderPendingProjects(context, navRuntime);
        }
        else if (view === 'view_4_project_dashboard') {
            const { renderSingleProjectDashboard } = await import(`/FACILITYS_TRACKER_APP/views/view_4_projects/view_4_project_dashboard.js${cb}`);
            await renderSingleProjectDashboard(context, navRuntime);
        }
        else if (view === 'view_4_photo_dashboard') {
            const { renderPhotoDashboard } = navRuntime; // Use inline placeholder
            await renderPhotoDashboard(context);
        }
        else if (view === 'view_5_issues') {
            const { renderFacilityIssues } = await import(`/FACILITYS_TRACKER_APP/views/view_5_issues/view_5_grid.js${cb}`);
            await renderFacilityIssues(context);
        }
        else if (view === 'view_6_images') {
            const { renderFacilityImages } = await import(`/FACILITYS_TRACKER_APP/views/view_6_images/view_6_grid.js${cb}`);
            await renderFacilityImages(context);
        }
        else if (view === 'view_7_followups') {
            const { renderIssueFollowups } = await import(`/FACILITYS_TRACKER_APP/views/view_7_followups/view_7_grid.js${cb}`);
            await renderIssueFollowups(context);
        }
        else if (view === 'view_8_reports' || view === 'reports') {
            const { renderReports } = await import(`/FACILITYS_TRACKER_APP/views/view_8_reports/view_8_grid.js${cb}`);
            await renderReports(context);
        }
        else {
            console.warn(`Unknown view "${view}"`);
            app.innerHTML = `<p style="text-align:center; padding:20px; color:#6b7280;">View not found.</p>`;
        }
    } catch (err) {
        console.error("Navigation error:", err);
        app.innerHTML = `<p style="color:red; text-align:center; padding:20px;">Error loading view: ${view}<br><small>${err.message || err}</small></p>`;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    console.log("App loaded, navigating to default view...");
    window.navigateTo('view_1_facility');
});

/* =================================================
END FILE: main.js
UPDATED: 2026-06-12 @ 12:45 PM
================================================= */
