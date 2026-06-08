/* =================================================================
AUTOMATED PATH UPDATE INSTRUCTION
================================================================
NEW ROOT DIRECTORY FOR COMPONENT:
FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_grid_components/

ACTION REQUIRED BY AI:
1. Scan this file for any import statements or paths pointing to 'view_3_grid.js'.
2. Update those paths so they correctly target the new folder and split files:
   - view_3_grid.js
   - view_3_grid_logic.js
3. Ensure all other local relative paths (../) are mathematically adjusted 
   to account for the deeper directory depth of the new folder level.
4. Run the LINE COUNT AUDIT before writing code.
================================================================*/   
/* =================================================
FILE: main.js
UPDATED: 2026-06-08 10:45:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */

window.navigateTo = async (view, context = {}) => {
    const app = document.getElementById('app');
    if (!app) {
        console.error("App container not found.");
        return;
    }

    // DEFENSIVE REPAIR: preserve UUID/string IDs. Do not force Number().
    const facilityViews = ['view_2_controls', 'view_3_contacts', 'view_4_projects', 'view_5_issues', 'view_6_images', 'view_7_followups'];
    if (facilityViews.includes(view)) {
        const facilityId = context?.facility?.id || context?.id || context?.facilityId;
        if (facilityId === undefined || facilityId === null || String(facilityId) === '[object Object]') {
            console.warn(`Navigation blocked to "${view}": Missing valid facility ID context.`);
            view = 'view_1_facility';
            context = {};
        } else if (!context.facility && facilityId) {
            context.facility = { ...context, id: facilityId };
        }
    }

    app.innerHTML = '<p style="text-align:center; padding:50px;">Loading...</p>';

    const cb = "?v=2026_vendor_jobs_v1";

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
            const { renderFacilityContacts } = await import(`/FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_grid_components/view_3_grid.js${cb}`);
            await renderFacilityContacts(context);
        }
        else if (view === 'view_4_projects') {
            const { renderPendingProjects } = await import(`/FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid.js${cb}`);
            await renderPendingProjects(context);
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
UPDATED: 2026-06-08 10:45:00 PM
================================================= */
