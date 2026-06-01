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
