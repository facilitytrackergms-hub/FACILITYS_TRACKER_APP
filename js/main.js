/* =================================================
FILE: main.js
UPDATED: 2026-06-01 09:45:00 AM
================================================= */
import { renderFacilityGrid } from './views/view_1_facility/view_1_grid.js';
import { renderFacilityControls } from './views/view_2_controls/view_2_grid.js';

// Global current user for modal actions
window.currentUserId = '5fc37b27-edfd-4740-b533-20a618ffc5af';

// Simple router simulation
window.navigateTo = function(target) {
    const app = document.getElementById('app');
    if (!app) return;

    if (target === 'dashboard') {
        // Use the correct View 1 grid function
        renderFacilityGrid('app', facility => window.navigateTo({ type: 'facility', id: facility.id }));
    } else if (target.type === 'facility') {
        renderFacilityControls(target.id);
    } else if (target.type === 'project') {
        alert('Project selected: ' + target.id);
    } else if (target.type === 'issue') {
        alert('Issue selected: ' + target.id);
    } else {
        app.innerHTML = '<p>Unknown view</p>';
    }
};

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    window.navigateTo('dashboard');
});
