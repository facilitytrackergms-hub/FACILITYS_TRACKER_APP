import { insertFacility } from './view_1_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function openFacilityModal({ onSave }) {
    const existingModal = document.getElementById('facilityModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'facilityModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>Add New Facility</h2>
            <input id="facilityName" placeholder="Facility Name" style="width:100%; padding:10px; margin:8px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="facilityAddress" placeholder="Address" style="width:100%; padding:10px; margin:8px 0; border-radius:6px; border:1px solid #ccc;">
            <input id="facilityPhone" placeholder="Phone" style="width:100%; padding:10px; margin:8px 0; border-radius:6px; border:1px solid #ccc;">
            <div style="margin-top:15px;">
                <button id="saveFacilityBtn" style="padding:12px 20px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">Save Facility</button>
                <button id="closeFacilityBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">Close</button>
            </div>
            <div id="facilityImageContainer" style="margin-top:15px;"></div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close button
    document.getElementById('closeFacilityBtn').onclick = () => modal.remove();

    // Save facility
    document.getElementById('saveFacilityBtn').onclick = async () => {
        const name = document.getElementById('facilityName').value.trim();
        const address = document.getElementById('facilityAddress').value.trim();
        const phone = document.getElementById('facilityPhone').value.trim();

        if (!name) return alert('Facility name is required.');

        const newFacility = await insertFacility({ name, address, phone });
        if (!newFacility) return alert('Error saving facility.');

        // Optional: initialize image manager after saving
        const imgContainer = document.getElementById('facilityImageContainer');
        renderImageManagerSection(imgContainer, 'facility', newFacility.id, { title: 'Facility Image' });

        modal.remove();
        if (onSave) onSave();
    };
}
