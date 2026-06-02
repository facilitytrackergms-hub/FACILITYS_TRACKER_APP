/* =================================================
FILE: view_1_modal.js
UPDATED: 2026-06-01
================================================= */
import { insertFacility, updateFacility } from './view_1_data.js';

export function openFacilityModal(facility, isEdit) {
    let existing = document.getElementById('facilityModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'facilityModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; justify-content:center; align-items:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:24px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>${isEdit ? 'Edit Facility' : 'Add Facility'}</h2>
            <input id="facilityName" placeholder="Name" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${facility?.name || ''}">
            <input id="facilityAddress" placeholder="Address" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${facility?.address || ''}">
            <input id="facilityPhone" placeholder="Phone" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${facility?.phone || ''}">
            <div style="margin-top:12px;">
                <button id="saveFacilityBtn" style="padding:12px 20px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">
                    ${isEdit ? 'Update' : 'Save'}
                </button>
                <button id="closeFacilityBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeFacilityBtn').onclick = () => modal.remove();

    document.getElementById('saveFacilityBtn').onclick = async () => {
        const name = document.getElementById('facilityName').value.trim();
        const address = document.getElementById('facilityAddress').value.trim();
        const phone = document.getElementById('facilityPhone').value.trim();

        if (!name) return alert('Facility name is required.');

        if (isEdit && facility?.id) {
            await updateFacility(facility.id, { name, address, phone });
        } else {
            await insertFacility({ name, address, phone });
        }

        modal.remove();
        // Re-render facilities
        const { renderFacilities } = await import('./view_1_grid.js');
        renderFacilities();
    };
}
