/* =================================================
FILE: js/main.js
UPDATED: 2026-05-30 10:50:00 PM
================================================= */

// Import all 3 sections for View 1
import { FacilityData } from '../views/view_1_facility/view_1_data.js';
import { FacilityGrid } from '../views/view_1_facility/view_1_grid.js';
import { FacilityModal } from '../views/view_1_facility/view_1_modal.js';

// (Future views will be imported here)
// import { StaffData } from '../views/view_2_staff/view_2_data.js';

async function initApp() {
    const appContainer = document.getElementById('app');
    const statusEl = document.getElementById('db-status');
    
    try {
        console.log("Initializing Facility View...");

        // 1. Let the Grid render the HTML and CSS
        FacilityGrid.render(appContainer);

        // 2. Explicitly initialize the Modal logic
        FacilityModal.init();

        // 3. Update the UI Status
        if (statusEl) {
            statusEl.innerText = "ONLINE";
            statusEl.className = "text-[10px] bg-green-600 px-2 py-1 rounded text-white font-bold";
        }

    } catch (err) {
        console.error("Critical App Load Failure:", err);
        if (statusEl) statusEl.innerText = "DB ERROR";
    }
}

// Start the engine
initApp();
