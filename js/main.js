/* =================================================
FILE: main.js
UPDATED: 2026-06-01
================================================= */

window.navigateTo = async (view, context = {}) => {
    const app = document.getElementById('app');
    if (!app) {
        console.error("App container not found.");
        return;
    }

    app.innerHTML = '<p style="text-align:center; padding:50px;">Loading...</p>';

    try {
        if (view === 'facility') {
            const { renderFacilities } = await import('../views/view_1_facility/view_1_grid.js');
            await renderFacilities();
        } 
        else if (view === 'controls') {
            const { renderControls } = await import('../views/view_2_controls/view_2_grid.js');
            await renderControls();
        }
        else if (view === 'contacts') {
            const { renderContacts } = await import('../views/view_3_contacts/view_3_grid.js');
            await renderContacts();
        }
        else if (view === 'projects') {
            const { renderProjects } = await import('../views/view_4_projects/view_4_grid.js');
            await renderProjects();
        }
        else if (view === 'issues') {
            const { renderIssues } = await import('../views/view_5_issues/view_5_grid.js');
            await renderIssues();
        }
        else if (view === 'images') {
            const { renderImages } = await import('../views/view_6_images/view_6_grid.js');
            await renderImages(context.relatedType, context.relatedId);
        }
        else if (view === 'followups') {
            const { renderFollowups } = await import('../views/view_7_followups/view_7_grid.js');
            if (!context.issueId) return console.error("issueId required for followups");
            await renderFollowups(context.issueId);
        }
        else if (view === 'reports') {
            const { renderReports } = await import('../views/view_8_report/view_8_grid.js');
            await renderReports();
        }
        else {
            console.warn(`Unknown view "${view}"`);
        }
    } catch (err) {
        console.error("Navigation error:", err);
        app.innerHTML = `<p style="color:red;">Error loading view: ${view}</p>`;
    }
};

// Automatically load the default view on page load
window.addEventListener('DOMContentLoaded', () => {
    console.log("App loaded, navigating to default view...");
    window.navigateTo('facility'); // load the first view automatically
});
