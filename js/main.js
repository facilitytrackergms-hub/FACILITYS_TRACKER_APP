/* =================================================
FILE: js/main.js
UPDATED: 2026-05-30 11:05:00 PM
================================================= */

// 1. Correct the Import Paths and Names
// Note: We import the functions directly from your new 3-file structure
import { renderFacilities } from './views/view_1_grid.js';

async function initApp() {
    const statusEl = document.getElementById('db-status');
    
    try {
        console.log("Initializing Facility Dashboard...");

        /* 2. Execute the Main Render
           The 'view_1_grid.js' file handles:
           - Injecting the CSS
           - Injecting the HTML into the #app div
           - Calling setupModalLogic() internally
           - Fetching the data from view_1_data.js
        */
        await renderFacilities();

        // 3. Update the UI Status
        if (statusEl) {
            statusEl.innerText = "ONLINE";
            statusEl.className = "text-[10px] bg-green-600 px-2 py-1 rounded text-white font-bold";
        }

    } catch (err) {
        console.error("Critical App Load Failure:", err);
        if (statusEl) {
            statusEl.innerText = "OFFLINE";
            statusEl.className = "text-[10px] bg-red-600 px-2 py-1 rounded text-white font-bold";
        }
    }
}

// 4. Global Navigation Mock (Required for button clicks in the grid)
window.navigateTo = (view, data) => {
    console.log(`Navigating to ${view}`, data);
};

// Start the engine
initApp();
