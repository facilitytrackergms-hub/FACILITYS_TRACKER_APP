// js/main.js
import { DataService } from '../views/view_1_facility/view_1_data.js';
import { GridView } from '../views/view_1_facility/view_1_grid.js';

async function init() {
    const statusEl = document.getElementById('db-status');
    
    try {
        // 1. Fetch Data
        const facilities = await DataService.fetchAll();
        
        // 2. Render the Grid
        GridView.render('facility-grid', facilities);

        // 3. Update Status
        statusEl.innerText = "ONLINE";
        statusEl.className = "text-[10px] bg-green-600 px-2 py-1 rounded text-white font-bold";
    } catch (err) {
        console.error("App init failed:", err);
        statusEl.innerText = "DB ERROR";
    }
}

// Save Button Logic
document.getElementById('save-fac-btn').onclick = async () => {
    const input = document.getElementById('new-fac-name');
    if (input.value.trim()) {
        await DataService.save(input.value.trim());
        input.value = "";
        init(); // Refresh
    }
};

init();
