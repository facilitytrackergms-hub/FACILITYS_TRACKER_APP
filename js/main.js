/* =================================================
FILE: main.js
PURPOSE: Router for Views v1–v8 with corrected paths matching GitHub Pages folder structure
UPDATED: 2026-05-30 11:45 AM
================================================= */

window.navigateTo = async (view, context = null) => {
    const app = document.getElementById('app');
    if (!app) {
        console.error("Critical Error: Element with ID 'app' not found.");
        return;
    }

    app.innerHTML = '<div style="text-align:center; padding:50px; color:#64748b; font-family:Arial;">Loading...</div>';
    console.log(`Navigating to: ${view}`, context);

    try {
        switch (view) {
            // VIEW 1: Facilities Dashboard
            case 'dashboard':
            case 'facility_dashboard':
            case 'FACILITY_DASHBOARD':
            case 'facilityDashboard':
                {
                    // Fixed paths: remove non-existent js/ prefix
                    const { renderFacilitiesHTML } = await import('./v1_facility_dashboard/dashboard_v1_grid.js');
                    await renderFacilitiesHTML();

                    const { initFacilitiesModal } = await import('./v1_facility_dashboard/dashboard_v1_modal.js');
                    const { loadFacilitiesList } = await import('./v1_facility_dashboard/dashboard_v1_data.js');

                    const modalElements = {
                        modal: document.getElementById('modal'),
                        warningModal: document.getElementById('warningModal'),
                        imageMount: document.getElementById('image-manager-mount'),
                        imageSection: document.getElementById('post-save-images'),
                        saveBtn: document.getElementById('saveBtn'),
                        facilityFields: document.getElementById('facility-fields')
                    };

                    initFacilitiesModal(modalElements);
                    await loadFacilitiesList();
                }
                break;

            // VIEW 2: Facility Controls
            case 'facility_controls':
            case 'facilityControls':
                const { renderFacilityControls } = await import('./v2_facility_controls/controls_v2_grid.js');
                await renderFacilityControls(context);
                break;

            // VIEW 5: Facility Issues
            case 'facility_issues':
            case 'facilityIssues':
                const { renderFacilityIssues } = await import('./v5_facility_issues/controls_v5_grid.js');
                await renderFacilityIssues(context);
                break;

            // VIEW 6: Facility Images
            case 'facility_images':
            case 'facilityImages':
                const { renderFacilityImages } = await import('./v6_facility_images/controls_v6_grid.js');
                await renderFacilityImages(context);
                break;

            // VIEW 7: Issue Follow-ups
            case 'issue_followups':
            case 'issueFollowups':
                const { renderIssueFollowups } = await import('./v7_issue_followups/controls_v7_grid.js');
                await renderIssueFollowups(context);
                break;

            // VIEW 8: Reports
            case 'reports':
            case 'facility_reports':
                const { renderReports } = await import('./v8_reports/controls_v8_grid.js');
                await renderReports(context);
                break;

            // DEFAULT
            default:
                const { renderFacilitiesHTML: defaultRender } = await import('./v1_facility_dashboard/dashboard_v1_grid.js');
                await defaultRender();
                break;
        }
    } catch (err) {
        console.error("Navigation Error:", err);
        app.innerHTML = `
            <div style="padding:40px; text-align:center; font-family:Arial; border: 2px solid #dc2625; border-radius: 12px; margin: 20px;">
                <h2 style="color:#dc2625;">Navigation Error</h2>
                <p style="color:#4b5563;">Failed to load view: <b>${view}</b></p>
                <p style="font-size:0.85em; color:#9ca3af; background:#f9fafb; padding:10px;">
                    Technical Details: ${err.message}
                </p>
                <button onclick="location.reload()" style="margin-top:15px; padding:10px 20px; background:#003366; color:white; border:none; border-radius:6px; cursor:pointer;">Reload App</button>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.navigateTo('dashboard');
});
