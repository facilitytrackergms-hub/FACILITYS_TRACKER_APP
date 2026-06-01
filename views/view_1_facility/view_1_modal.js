/* =================================================
FILE: view_1_modal.js
UPDATED: 2026-06-01 01:20 PM
STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { insertFacility } from './view_1_data.js';
import { renderFacilities } from './view_1_grid.js';

export function openFacilityModal(containerId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class='modal-content'>
            <h3 id='modalTitle'>Add New Facility</h3>
            <input type='text' id='name' placeholder='Facility Name'>
            <input type='text' id='address' placeholder='Address'>
            <input type='text' id='phone' placeholder='Phone'>
            <button id='saveBtn' class='facility-btn new-btn'>Save Facility</button>
            <button id='closeModal' class='facility-btn' style='background:#666;'>Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('saveBtn').onclick = async () => {
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name || !address || !phone) return alert('All fields required');

        await insertFacility({ name, address, phone });
        modal.style.display = 'none';
        document.body.removeChild(modal);
        renderFacilities(containerId);
    };

    document.getElementById('closeModal').onclick = () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    };
}
