/* =================================================
FILE: view_2_grid.js
UPDATED: 2026-06-01 10:45:00 AM
================================================= */
import { fetchFacilityProjects, fetchFacilityIssues } from './view_2_data.js';

export async function renderFacilityControls(facility_id) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<p>Loading facility controls...</p>';

    const projects = await fetchFacilityProjects(facility_id);
    const issues = await fetchFacilityIssues(facility_id);

    app.innerHTML = '';

    // Render Projects
    if (projects && projects.length > 0) {
        const projectSection = document.createElement('div');
        projectSection.innerHTML = '<h3>Projects</h3>';
        projects.forEach(p => {
            const btn = document.createElement('button');
            btn.textContent = p.project_name;
            btn.onclick = () => window.navigateTo({ type: 'project', id: p.id });
            projectSection.appendChild(btn);
        });
        app.appendChild(projectSection);
    } else {
        app.innerHTML += '<p>No projects found.</p>';
    }

    // Render Issues
    if (issues && issues.length > 0) {
        const issueSection = document.createElement('div');
        issueSection.innerHTML = '<h3>Issues</h3>';
        issues.forEach(i => {
            const btn = document.createElement('button');
            btn.textContent = i.issue;
            btn.onclick = () => window.navigateTo({ type: 'issue', id: i.id });
            issueSection.appendChild(btn);
        });
        app.appendChild(issueSection);
    } else {
        app.innerHTML += '<p>No issues found.</p>';
    }
}
