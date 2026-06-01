// main.js - Navigation and App Entry

case 'view3_contacts': renderContactsDashboard(payload.facility); break;
case 'view4_projects': renderPendingProjects(payload.facility); break;
case 'view5_issues': renderIndividualConcerns(payload.facility); break;
case 'view6_images': renderFacilityImages(payload.facility); break;
case 'view7_followups': renderIssueFollowups(payload.issue); break;
case 'view8_reports': renderReports(payload.facility); break;

window.navigateTo = (viewName, payload = {}) => {
    switch (viewName) {
        case 'view1_facilities':
            renderFacilitiesDashboard();
            break;
        case 'view2_controls':
            if (!payload.facility) {
                alert('Facility context missing!');
                return;
            }
            renderFacilityControls(payload.facility);
            break;
        // Future views:
        // case 'view3_contacts': renderContactsDashboard(payload.facility); break;
        // case 'view4_projects': renderPendingProjects(payload.facility); break;
        // case 'view5_issues': renderIndividualConcerns(payload.facility); break;
        // case 'view6_images': renderFacilityImages(payload.facility); break;
        // case 'view7_followups': renderIssueFollowups(payload.issue); break;
        // case 'view8_reports': renderReports(payload.facility); break;
        default:
            console.warn('Unknown view:', viewName);
            break;
    }
};

// Entry point
document.addEventListener('DOMContentLoaded', () => {
    window.navigateTo('view1_facilities');
});
