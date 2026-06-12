/*================================================================
FILE METADATA
================================================================
FILE NAME    : main.js
File Path    : FACILITYS_TRACKER_APP/js/main.js
VIEW NAME    : Central App Engine Router Controller
LAST UPDATED : 2026-06-12 @ 12:25 PM
================================================================*/

// Mock State Controller tracking
const appState = {
    currentView: 'default',
    // FIXED: Defaulting to a valid numeric database row ID context object instead of a text code string
    currentFacility: { id: 1, name: "Default Facility" }
};

// Global App Runtime Engine Nav object mapping pipeline rules
window.appNavigation = {
    navigateTo: async function(viewId, payload = {}) {
        console.log(`[main.js] Engine intercepting routing navigation request to: ${viewId}`);
        appState.currentView = viewId;
        
        const mainContentArea = document.getElementById('main-content-display-area') || document.body;
        
        try {
            if (viewId === 'default' || viewId === 'projects_home') {
                // Dynamically fetch component view mapping layers
                const modulePath = 'https://facilitytrackergms-hub.github.io/FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid.js?v=2026_vendor_jobs_v1';
                const gridModule = await import(modulePath);
                
                // Expose globally to enable structural fallback lookups in views subcomponents
                window.view4Engine = gridModule;
                
                // Construct the data context using the fixed numeric object structure
                const dataContext = { facility: appState.currentFacility, ...payload };
                const renderedUI = await gridModule.renderPendingProjects(dataContext, window.appNavigation);
                
                mainContentArea.innerHTML = '';
                mainContentArea.appendChild(renderedUI);
            } else if (viewId === 'project_dashboard') {
                const modulePath = 'https://facilitytrackergms-hub.github.io/FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid.js?v=2026_vendor_jobs_v1';
                const gridModule = await import(modulePath);
                
                window.view4Engine = gridModule;
                
                const renderedUI = await gridModule.renderProjectDashboard(payload, window.appNavigation);
                mainContentArea.innerHTML = '';
                mainContentArea.appendChild(renderedUI);
            }
        } catch (error) {
            console.error('[main.js] Dynamic Routing Context Generation Error:', error);
        }
    }
};

// Auto boot initializer
document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js:120 App loaded, navigating to default view...');
    if (typeof window.appNavigation.navigateTo === 'function') {
        window.appNavigation.navigateTo('default');
    }
});

/*================================================================
END FILE: main.js
UPDATED: 2026-06-12 @ 12:25 PM
================================================================*/
