import { fetchFacilities } from './view_1_data.js';
import { openFacilityModal } from './view_1_modal.js';

export async function renderFacilitiesDashboard() {
    const app = document.getElementById('app');
    if (!app) return;

    const facilities = await fetchFacilities();

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; text-align:center;">
            <h1 style="margin-bottom:20px; font-size:24px;">FACILITIES DASHBOARD</h1>
            <button id="addFacilityBtn" style="padding:16px 32px; background:#28a745; color:white; border:none; border-radius:8px; font-size:18px; cursor:pointer; margin-bottom:20px;">
                Create New Facility
            </button>
            <div id="facilitiesGrid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:12px; max-width:600px; margin:0 auto;"></div>
        </div>
    `;

    const grid = document.getElementById('facilitiesGrid');

    // Render facility buttons
    facilities.forEach(f => {
        const btn = document.createElement('button');
        btn.textContent = f.name;
        btn.style.cssText = `
            padding:16px; background:#00264d; color:white; border:none; border-radius:8px;
            cursor:pointer; font-weight:bold;
        `;
        btn.onclick = () => {
            if (window.navigateTo) window.navigateTo('view2_controls', { facility: f });
        };
        grid.appendChild(btn);
    });

    // Add facility button
    document.getElementById('addFacilityBtn').onclick = () => openFacilityModal({ onSave: renderFacilitiesDashboard });
}
