// main.js - Navigation and App Entry

import { renderFacilitiesDashboard } from '../views/view_1_facility/view_1_grid.js';
import { renderFacilityControls } from '../views/view_2_controls/view_2_grid.js';
import { renderContactsDashboard } from '../views/view_3_controls/view_3_grid.js';
import { renderPendingProjects } from '../views/view_4_projects/view_4_grid.js';
import { renderIndividualConcerns } from '../views/view_5_issues/view_5_grid.js';
import { renderFacilityImages } from '../views/view_6_images/view_6_grid.js';
import { renderIssueFollowups } from '../views/view_7_followups/view_7_grid.js';
import { renderReportsDashboard } from '../views/view_8_report/view_8_grid.js';

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
        case 'view3_contacts':
            if (!payload.facility) {
                alert('Facility context missing!');
                return;
            }
            renderContactsDashboard(payload.facility);
            break;
        case 'view4_projects':
            if (!payload.facility) {
                alert('Facility context missing!');
                return;
            }
            renderPendingProjects(payload.facility);
            break;
        case 'view5_issues':
            if (!payload.facility) {
                alert('Facility context missing!');
                return;
            }
            renderIndividualConcerns(payload.facility);
            break;
        case 'view6_images':
            if (!payload.facility) {
                alert('Facility context missing!');
                return;
            }
            renderFacilityImages(payload.facility);
            break;
        case 'view7_followups':
            if (!payload.issue) {
                alert('Issue context missing!');
                return;
            }
            renderIssueFollowups(payload.issue);
            break;
        case 'view8_reports':
            if (!payload.facility) {
                alert('Facility context missing!');
                return;
            }
            renderReports(payload.facility);
            break;
        default:
            console.warn('Unknown view:', viewName);
            break;
    }
};

// Entry point
document.addEventListener('DOMContentLoaded', () => {
    window.navigateTo('view1_facilities');
});
