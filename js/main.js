/* =================================================
FILE: main.js
UPDATED: 2026-06-02 08:50:00 PM

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

    // Defensive Check: Allow valid numeric IDs matching bigint columns
    const facilityViews = ['view_2_controls', 'view_3_contacts', 'view_4_projects', 'view_5_issues', 'view_6_images', 'view_7_followups'];
    if (facilityViews.includes(view)) {
        const facilityId = context?.id || context?.facility?.id;
        if (facilityId === undefined || facilityId === null || String(facilityId) === '[object Object]') {
            console.warn(`Navigation blocked to "${view}": Missing valid facility ID context.`);
            view = 'view_1_facility';
            context = {};
        }
    }

    app.innerHTML = '<p style="text-align:center; padding:50px;">Loading...</p>';

    try {
        if (view === 'view_1_facility' || view === 'dashboard' || view === 'facility') {
            const { renderFacilities } = await import('../views/view_1_facility/view_1_grid.js');
            await renderFacilities(context);
        } 
        else if (view === 'view_2_controls') {
            const { renderFacilityControls } = await import('../views/view_2_controls/view_2_grid.js');
            await renderFacilityControls(context);
        }
        else if (view === 'view_3_contacts') {
            const { renderFacilityContacts } = await import('../views/view_3_contacts/view_3_grid.js');
            await renderFacilityContacts(context);
        }
        else if (view === 'view_4_projects') {
            const { renderPendingProjects } = await import('../views/view_4_projects/view_4_grid.js');
            await renderPendingProjects(context);
        }
        else if (view === 'view_5_issues') {
            const { renderFacilityIssues } = await import('../views/view_5_issues/view_5_grid.js');
            await renderFacilityIssues(context);
        }
        else if (view === 'view_6_images') {
            const { renderFacilityImages } = await import('../views/view_6_images/view_6_grid.js');
            await renderFacilityImages(context);
        }
        else if (view === 'view_7_followups') {
            const { renderIssueFollowups } = await import('../views/view_7_followups/view_7_grid.js');
            await renderIssueFollowups(context);
        }
        else if (view === 'view_8_reports' || view === 'reports') {
            const { renderReports } = await import('../views/view_8_reports/view_8_grid.js');
            await renderReports(context);
        }
        else {
            console.warn(`Unknown view "${view}"`);
            app.innerHTML = `<p style="text-align:center; padding:20px; color:#6b7280;">View not found.</p>`;
        }
    } catch (err) {
        console.error("Navigation error:", err);
        app.innerHTML = `<p style="color:red; text-align:center; padding:20px;">Error loading view: ${view}</p>`;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    console.log("App loaded, navigating to default view...");
    window.navigateTo('view_1_facility');
});
