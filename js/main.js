// main.js
// main.js
import { DataService } from './view_1_data.js';
import { GridView } from './view_1_grid.js';
import { ModalView } from './view_1_modal.js';

// ... the rest of your main.js code remains the same
async function init() {
    const statusEl = document.getElementById('db-status');
    
    try {
        const facilities = await DataService.fetchFacilities();
        
        // Render the grid and handle what happens when a card is clicked
        GridView.render('facility-grid', facilities, (id) => {
            const selected = facilities.find(f => f.id === id);
            ModalView.show(selected);
        });

        statusEl.innerText = "ONLINE";
        statusEl.className = "text-[10px] bg-green-600 px-2 py-1 rounded text-white";
        
    } catch (err) {
        statusEl.innerText = "CONNECTION ERROR";
        statusEl.className = "text-[10px] bg-red-600 px-2 py-1 rounded text-white";
    }
}

// Setup the Save Button
document.getElementById('save-fac-btn').addEventListener('click', async () => {
    const input = document.getElementById('new-fac-name');
    const btn = document.getElementById('save-fac-btn');
    
    if (input.value) {
        btn.innerText = "SAVING...";
        await DataService.saveFacility(input.value);
        input.value = "";
        btn.innerText = "SAVE TO DATABASE";
        init(); // Refresh the grid automatically
    }
});

init();
