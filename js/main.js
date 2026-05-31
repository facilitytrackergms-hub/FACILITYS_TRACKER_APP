import { DataService } from './data.js';
import { GridView } from './grid.js';
import { ModalView } from './modal.js';

let currentFacilities = [];

async function refreshApp() {
    try {
        currentFacilities = await DataService.fetchFacilities();
        GridView.render('facility-grid', currentFacilities, (id) => {
            const fac = currentFacilities.find(f => f.id === id);
            ModalView.show(fac);
        });
        document.getElementById('db-status').innerText = "ONLINE";
        document.getElementById('db-status').className = "text-[10px] bg-green-600 px-2 py-1 rounded";
    } catch (err) {
        console.error(err);
        document.getElementById('db-status').innerText = "OFFLINE";
        document.getElementById('db-status').className = "text-[10px] bg-red-600 px-2 py-1 rounded";
    }
}

// Save Button Event
document.getElementById('save-fac-btn').onclick = async () => {
    const input = document.getElementById('new-fac-name');
    const btn = document.getElementById('save-fac-btn');
    
    try {
        btn.innerText = "SAVING...";
        btn.disabled = true;
        await DataService.saveFacility(input.value);
        input.value = ""; // Clear input
        await refreshApp(); // Refresh the grid
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        btn.innerText = "SAVE TO DATABASE";
        btn.disabled = false;
    }
};

// Initial Load
refreshApp();
