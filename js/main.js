import { supabase } from './supabaseClient.js';

// 1. THE DATABASE ENGINE
async function loadFacilities() {
    const statusEl = document.getElementById('db-status');
    
    try {
        // Fetching the columns from your 'facilities' table
        const { data, error } = await supabase
            .from('facilities')
            .select('id, name, address, phone, notes, status');

        if (error) throw error;

        // If it works, update the UI
        renderGrid(data);
        statusEl.innerText = "ONLINE";
        statusEl.className = "text-[10px] bg-green-600 px-2 py-1 rounded text-white font-bold";
    } catch (err) {
        console.error("Connection failed:", err);
        statusEl.innerText = "DB ERROR";
        statusEl.className = "text-[10px] bg-red-600 px-2 py-1 rounded text-white font-bold";
    }
}

// 2. THE SAVE BUTTON LOGIC
async function saveNewFacility() {
    const input = document.getElementById('new-fac-name');
    const name = input.value.trim();
    
    if (!name) {
        alert("Please enter a name first.");
        return;
    }

    const { error } = await supabase
        .from('facilities')
        .insert([{ name: name, status: 'Active' }]);

    if (error) {
        console.error("Save error:", error);
    } else {
        input.value = ""; // Clear input
        loadFacilities(); // Refresh the list automatically
    }
}

// 3. THE GRID DRAWING LOGIC
function renderGrid(facilities) {
    const container = document.getElementById('facility-grid');
    
    if (!facilities || facilities.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No facilities found in database.</p>';
        return;
    }

    container.innerHTML = facilities.map(f => `
        <div class="fac-card bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300 shadow-sm" 
             onclick="window.showModal('${f.id}')">
            <div class="flex justify-between items-start">
                <h3 class="font-bold text-gray-800 uppercase text-lg">${f.name}</h3>
                <span class="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">${f.status || 'ACTIVE'}</span>
            </div>
            <p class="text-gray-500 text-xs mt-2 italic">${f.address || 'No Address Listed'}</p>
            <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span class="text-blue-600 font-bold text-xs">${f.phone || 'No Phone'}</span>
                <span class="text-gray-300">→</span>
            </div>
        </div>
    `).join('');
    
    // We store the data globally so the modal can find it quickly
    window.allFacilities = facilities; 
}

// 4. THE MODAL POPUP LOGIC
window.showModal = (id) => {
    const f = window.allFacilities.find(item => item.id === id);
    const container = document.getElementById('modal-container');
    const body = document.getElementById('modal-body');
    
    body.innerHTML = `
        <div class="p-6 border-b flex justify-between items-center bg-gray-50">
            <h2 class="text-xl font-bold text-gray-800">${f.name}</h2>
            <button onclick="document.getElementById('modal-container').classList.add('hidden')" 
                    class="text-gray-400 hover:text-gray-900 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
            <p class="text-sm text-gray-600"><strong>Address:</strong><br>${f.address || 'N/A'}</p>
            <p class="text-sm text-gray-600"><strong>Phone:</strong> ${f.phone || 'N/A'}</p>
            <p class="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border italic">
                <strong>Notes:</strong> ${f.notes || 'No administrative notes available.'}
            </p>
        </div>
    `;
    container.classList.remove('hidden');
};

// 5. BOOTSTRAP THE APP
document.getElementById('save-fac-btn').onclick = saveNewFacility;
loadFacilities();
