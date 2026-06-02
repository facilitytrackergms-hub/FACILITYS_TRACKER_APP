/* =================================================
FILE: view_2_grid.js
UPDATED: 2026-06-01
================================================= */
import { fetchControls } from './view_2_data.js';
import { openControlModal } from './view_2_modal.js';

export async function renderControls() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<p>Loading controls...</p>';
    const controls = await fetchControls();

    if (!controls || controls.length === 0) {
        app.innerHTML = '<p>No controls found.</p>';
        return;
    }

    app.innerHTML = '<div id="controlsContainer" style="display:flex; flex-wrap:wrap; gap:12px;"></div>';
    const container = document.getElementById('controlsContainer');

    controls.forEach(ctrl => {
        const card = document.createElement('div');
        card.style.cssText = 'border:1px solid #ccc; padding:12px; border-radius:8px; width:200px; cursor:pointer;';

        card.innerHTML = `
            <h3>${ctrl.control_name_text}</h3>
            <p>${ctrl.description_text}</p>
            <p>Assigned to: ${ctrl.assigned_to_text}</p>
        `;
        card.onclick = () => openControlModal(ctrl, true);
        container.appendChild(card);
    });

    const addBtn = document.createElement('button');
    addBtn.innerText = "Add Control";
    addBtn.style.cssText = "margin-top:12px; padding:10px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;";
    addBtn.onclick = () => openControlModal(null, false);
    app.appendChild(addBtn);
}
