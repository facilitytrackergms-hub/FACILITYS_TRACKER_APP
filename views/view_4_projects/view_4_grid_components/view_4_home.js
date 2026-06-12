/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_home.js
File Path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid_components/view_4_home.js
SUPABASE TBL : facility_projects
VIEW NAME    : Facility Projects Dashboard - Home Grid View
POP-UP TITLE : N/A
LAST UPDATED : 2026-06-12 @ 12:15 PM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.
2. MISSING METADATA HANDLING: Handle placeholders sequentially.
3. NO UNSANCTIONED CHANGES: Never remove rules.
4. SCOPE OF WORK: Only modify specific functions/features requested.
5. PRESERVATION: Leave working logic completely intact.
6. LOGGING CHANGES: Document fixes in textual explanation prior to code blocks.
7. CODE COMPLETENESS: Always return the full file.
8. VIEW IDENTIFIERS: Update metadata tracking tags dynamically.
9. NO BLIND CODE: Work exclusively off provided sources.
10. UNIQUE ALERTS: Avoid generic alert mechanisms.
11. CODE BLOCK DELIVERY: Use a single clean markdown block.
12. METADATA AUTO-UPDATE: Sync metrics on code modification.
13. Only change is async handling on project button click
================================================================*/
const __FILENAME = 'view_4_home.js';

import { fetchFacilityProjects, getProjectTitle } from '../view_4_data.js';

export async function renderProjectsHome(data, nav) {
    const container = document.createElement('div');
    container.id = 'view-4-home-root';
    container.className = 'p-4 space-y-6';

    // Inject View Source and Metadata Tracking Tag
    const trackingTag = document.createElement('div');
    trackingTag.className = 'text-xs text-gray-400 border-b pb-2 mb-4';
    trackingTag.innerText = `Source: ${__FILENAME} | Last Updated: 2026-06-12 @ 12:15 PM`;
    container.appendChild(trackingTag);

    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold tracking-tight text-gray-900';
    title.innerText = 'Facility Projects';
    container.appendChild(title);

    const currentFacility = data?.currentFacility || localStorage.getItem('current_facility_ref');
    if (!currentFacility) {
        const fallbackMsg = document.createElement('p');
        fallbackMsg.className = 'text-gray-500 italic';
        fallbackMsg.innerText = 'No facility selected. Please select a facility to view projects.';
        container.appendChild(fallbackMsg);
        return container;
    }

    const projects = await fetchFacilityProjects(currentFacility);

    if (!projects || projects.length === 0) {
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

        // CRITICAL FIX: Safe Fallback Execution for Dashboard rendering with async handling
        viewBtn.onclick = async (e) => {
            e.stopPropagation();
            
            let dashboardEl;
            if (nav && typeof nav.renderProjectDashboard === 'function') {
                dashboardEl = await nav.renderProjectDashboard(project, nav);
            } else if (window.view4Engine && typeof window.view4Engine.renderProjectDashboard === 'function') {
                dashboardEl = await window.view4Engine.renderProjectDashboard(project, nav);
            } else {
                console.error('[view_4_home.js] navigation framework layout component missing renderProjectDashboard implementation.', nav);
                if (nav && typeof nav.navigateTo === 'function') {
                    return nav.navigateTo('project_dashboard', { project });
                }
            }

            if (dashboardEl) {
                const mainArea = document.getElementById('main-content-display-area') || document.body;
                mainArea.innerHTML = '';
                mainArea.appendChild(dashboardEl);
            }
        };

        card.appendChild(viewBtn);
        
        // Let clicking the card trigger the exact same function pipeline securely
        card.onclick = () => {
            viewBtn.click();
        };

        gridLayout.appendChild(card);
    });

    container.appendChild(gridLayout);
    return container;
}

/*================================================================
END FILE: view_4_home.js
UPDATED: 2026-06-12 @ 12:15 PM
================================================================*/
