const __FILENAME = 'view_4_home.js';

import { fetchFacilityProjects, getProjectTitle } from '../view_4_data.js';

export async function renderProjectsHome(data, nav) {
    console.log('[view_4_home.js] renderProjectsHome called with', data);

    const container = document.createElement('div');
    container.id = 'view-4-home-root';
    container.className = 'p-4 space-y-6';

    const trackingTag = document.createElement('div');
    trackingTag.className = 'text-xs text-gray-400 border-b pb-2 mb-4';
    trackingTag.innerText = `Source: ${__FILENAME} | Last Updated: 2026-06-12 @ 12:15 PM`;
    container.appendChild(trackingTag);

    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold tracking-tight text-gray-900';
    title.innerText = 'Facility Projects';
    container.appendChild(title);

    let currentFacility = data?.currentFacility;
    if (!currentFacility) {
        const stored = localStorage.getItem('current_facility_ref');
        if (stored) {
            try {
                currentFacility = JSON.parse(stored);
            } catch(e) {
                console.warn('[view_4_home.js] Failed to parse stored facility', e);
            }
        }
    }

    console.log('[view_4_home.js] currentFacility resolved:', currentFacility);
    if (!currentFacility) {
        const fallbackMsg = document.createElement('p');
        fallbackMsg.className = 'text-gray-500 italic';
        fallbackMsg.innerText = 'No facility selected. Please select a facility to view projects.';
        container.appendChild(fallbackMsg);
        return container;
    }

    const projects = await fetchFacilityProjects(currentFacility);

    if (!projects || projects.length === 0) {
        console.warn('[view_4_home.js] No projects found for this facility.');
        const noDataMsg = document.createElement('p');
        noDataMsg.className = 'text-gray-500 italic';
        noDataMsg.innerText = 'No tracking projects found for this facility.';
        container.appendChild(noDataMsg);
        return container;
    }

    const gridLayout = document.createElement('div');
    gridLayout.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between';

        const contentWrap = document.createElement('div');
        const projTitle = document.createElement('h3');
        projTitle.className = 'text-lg font-semibold text-gray-800 mb-2';
        projTitle.innerText = getProjectTitle(project);
        contentWrap.appendChild(projTitle);

        if (project.notes) {
            const projNotes = document.createElement('p');
            projNotes.className = 'text-sm text-gray-600 line-clamp-3 mb-4';
            projNotes.innerText = project.notes;
            contentWrap.appendChild(projNotes);
        }

        card.appendChild(contentWrap);

        const viewBtn = document.createElement('button');
        viewBtn.className = 'mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors self-start';
        viewBtn.innerText = 'Open Dashboard';

        viewBtn.onclick = async (e) => {
            e.stopPropagation();
            let dashboardEl;
            if (nav && typeof nav.renderProjectDashboard === 'function') {
                dashboardEl = await nav.renderProjectDashboard(project, nav);
            } else if (window.view4Engine && typeof window.view4Engine.renderProjectDashboard === 'function') {
                dashboardEl = await window.view4Engine.renderProjectDashboard(project, nav);
            } else if (nav && typeof nav.navigateTo === 'function') {
                return nav.navigateTo('project_dashboard', { project });
            }

            if (dashboardEl) {
                const mainArea = document.getElementById('main-content-display-area') || document.body;
                mainArea.innerHTML = '';
                mainArea.appendChild(dashboardEl);
            }
        };

        card.appendChild(viewBtn);
        card.onclick = () => viewBtn.click();
        gridLayout.appendChild(card);
    });

    container.appendChild(gridLayout);
    return container;
}
