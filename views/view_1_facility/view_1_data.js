/* =================================================
FILE: view_1_data.js
VIEW: Facilities Dashboard
UPDATED: 2026-06-01 12:55:00 PM
================================================= */
import { supabase } from '../../js/supabaseClient.js';

// Fetch all facilities from lowercase table
export async function fetchFacilities() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('name', { ascending: true });
    if (error) { console.error('Error fetching facilities:', error); return []; }
    return data || [];
}

// Insert new facility
export async function insertFacility({ name, address, phone, notes = '' }) {
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ name, address, phone, notes }])
        .select();
    if (error) { console.error('Error inserting facility:', error); return null; }
    return data && data[0] ? data[0] : null;
}

/* Version Tag */
console.log('File: view_1_data.js | View: Facilities Dashboard | Updated: 2026-06-01 12:55 PM');


/* =================================================
FILE: view_1_grid.js
VIEW: Facilities Dashboard Styled
UPDATED: 2026-06-01 12:55:00 PM
================================================= */
import { fetchFacilities } from './view_1_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export async function renderFacilities(containerId) {
    const app = document.getElementById(containerId);
    if (!app) { console.error(`Container with ID '${containerId}' not found.`); return; }

    const styles = `
        <style>
            .dash-container { padding: 20px; text-align: center; font-family: Arial; background: #e3f2fd; min-height: 100vh; box-sizing: border-box; }
            .dash-card { background: rgba(255,255,255,0.88); border-radius: 18px; padding: 18px 12px 24px; box-shadow: 0 10px 24px rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.8); max-width: 380px; margin: 0 auto; }
            .button-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 10px; max-width: 400px; margin: 0 auto; }
            .facility-btn { width: 100%; height: 60px; border-radius: 10px; background-color: #003366; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 1.1em; }
            .new-btn { background-color: #28a745; margin-bottom: 20px; width: 200px; }
            .dash-title { font-size: 1.25em; font-weight: 900; color: #003366; margin-bottom: 10px; text-transform: uppercase; border-bottom: 4px solid #003366; padding-bottom: 15px; display: inline-block; width: 90%; white-space: nowrap; }
            .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10; overflow-y: auto; padding: 10px; }
            .modal-content { position: relative; top: 5%; left: 50%; transform: translateX(-50%); width: 100%; max-width: 400px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); box-sizing: border-box; }
            input { display: block; width: 100%; margin: 10px auto; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="dash-container">
            <div class="dash-card">
                <h1 class="dash-title">FACILITIES DASHBOARD</h1>
                <div style='margin-bottom:20px;'><button class='new-btn' id='createFacilityBtn'>Create New Facility</button></div>
                <div class='button-container'></div>
            </div>
        </div>
    `;

    const gridContainer = app.querySelector('.button-container');

    const facilities = await fetchFacilities();
    if (!facilities || facilities.length === 0) {
        gridContainer.innerHTML = '<div style="color:#666; font-style:italic;">No facilities found.</div>';
    } else {
        facilities.forEach(facility => {
            const btn = document.createElement('button');
            btn.className = 'facility-btn';
            btn.textContent = facility.name;
            btn.onclick = () => window.navigateTo({ type: 'facility', id: facility.id });
            gridContainer.appendChild(btn);
        });
    }

    document.getElementById('createFacilityBtn').onclick = () => {
        alert('Create New Facility modal would appear here');
    };

    renderImageManagerSection && renderImageManagerSection(app);
}

/* =================================================
FILE: view_1_modal.js
VIEW: Facilities Dashboard Modal
UPDATED: 2026-06-01 12:55:00 PM
================================================= */
import { insertFacility } from './view_1_data.js';
import { renderFacilities } from './view_1_grid.js';

export function openFacilityModal(containerId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class='modal-content'>
            <h3>Create New Facility</h3>
            <input id='facility_name' placeholder='Facility Name' />
            <input id='facility_address' placeholder='Address' />
            <input id='facility_phone' placeholder='Phone' />
            <textarea id='facility_notes' placeholder='Notes'></textarea>
            <button id='saveFacilityBtn'>Save</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.style.display = 'block';

    document.getElementById('saveFacilityBtn').onclick = async () => {
        await insertFacility({
            name: document.getElementById('facility_name').value,
            address: document.getElementById('facility_address').value,
            phone: document.getElementById('facility_phone').value,
            notes: document.getElementById('facility_notes').value
        });
        modal.style.display = 'none';
        document.body.removeChild(modal);
        renderFacilities(containerId);
    };
}
