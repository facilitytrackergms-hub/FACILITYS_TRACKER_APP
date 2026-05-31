import { DataService } from './data.js';
import { GridView } from './grid.js';
import { ModalView } from './modal.js';

let appState = [];

async function loadApp() {
    try {
        appState = await DataService.fetchAllFacilities();
        GridView.render('facility-grid', appState, (id) => {
            const facility = appState.find(f => f.id === id);
            ModalView.show(facility);
        });
        document.getElementById('connection-status').innerText = "Online";
    } catch (err) {
        console.error(err);
        document.getElementById('connection-status').innerText = "Offline";
    }
}

// Handle Save Button
document.getElementById('save-facility-btn').onclick = async () => {
    const input = document.getElementById('new-facility-name');
    try {
        await DataService.saveNewFacility(input.value);
        input.value = ''; // clear input
        loadApp(); // refresh list
    } catch (err) {
        alert("Error saving: " + err.message);
    }
};

// Start
loadApp();
