/* =================================================
FILE: view_1_grid.js
UPDATED: 2026-06-01
================================================= */
import { fetchFacilities } from './view_1_data.js';
import { openFacilityModal } from './view_1_modal.js';

export async function renderFacilities() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<p>Loading facilities...</p>';
    const facilities = await fetchFacilities();

    if (!facilities || facilities.length === 0) {
        app.innerHTML = '<p>No facilities found.</p>';
        return;
    }

    app.innerHTML = '<div id="facilitiesContainer" style="display:flex; flex-wrap:wrap; gap:12px;"></div>';
    const container = document.getElementById('facilitiesContainer');

    facilities.forEach(fac => {
        const card = document.createElement('div');
        card.style.cssText = 'border:1px solid #ccc; padding:12px; border-radius:8px; width:200px; cursor:pointer;';

        card.innerHTML = `
            <h3>${fac.name}</h3>
            <p>${fac.address}</p>
            <p>${fac.phone}</p>
        `;
        card.onclick = () => openFacilityModal(fac, true);
        container.appendChild(card);
    });

    // Add "New Facility" button
    const addBtn = document.createElement('button');
    addBtn.innerText = "Add Facility";
    addBtn.style.cssText = "margin-top:12px; padding:10px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;";
    addBtn.onclick = () => openFacilityModal(null, false);
    app.appendChild(addBtn);
}
