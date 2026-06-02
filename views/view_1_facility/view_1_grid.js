/* =================================================
FILE: view_1_grid.js
UPDATED: 2026-06-01
================================================= */
import { fetchFacilities } from './view_1_data.js';

export async function renderFacilities() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <h2 style="text-align:center; margin:16px 0; font-weight:bold;">FACILITIES DASHBOARD</h2>
        <div id="facilitiesContainer" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 12px;"></div>
        <button id="addFacilityBtn" style="margin:16px auto; display:block; padding:12px 20px; background:#16a34a; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">
            Create New Facility
        </button>
    `;

    const facilities = await fetchFacilities();
    const container = document.getElementById('facilitiesContainer');

    if (!facilities || facilities.length === 0) {
        container.innerHTML = '<p style="grid-column:span 2; text-align:center;">No facilities found.</p>';
    } else {
        facilities.forEach(fac => {
            const card = document.createElement('button');
            card.innerText = fac.name;
            card.style.cssText = `
                background:#0c4a6e; color:white; font-weight:bold; border:none;
                border-radius:8px; padding:16px; cursor:pointer; font-size:1em;
            `;
            card.onclick = () => {
                window.navigateTo('controls', { facilityId: fac.id, facilityName: fac.name });
            };
            container.appendChild(card);
        });
    }

    document.getElementById('addFacilityBtn').onclick = () => {
        window.navigateTo('controls', { facilityId: null, createNew: true });
    };
}
