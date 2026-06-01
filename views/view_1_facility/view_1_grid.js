/* =================================================
FILE: view_1_grid.js
VIEW: Facilities Dashboard (Debug Version)
UPDATED: 2026-06-01 11:20 AM
================================================= */
import { fetchFacilities } from './view_1_data.js';

export async function renderFacilityGrid(containerId, onFacilityClick) {
    const container = document.getElementById(containerId);
    if (!container) { 
        console.error(`Container with ID '${containerId}' not found.`); 
        return; 
    }

    const facilities = await fetchFacilities();
    console.log('Fetched facilities:', facilities);

    container.innerHTML = '';

    if (!facilities || facilities.length === 0) {
        container.innerHTML = '<div style="color:#666; font-style:italic;">No facilities found.</div>';
        return;
    }

    facilities.forEach(facility => {
        const btn = document.createElement('button');
        btn.className = 'facility-btn';
        btn.textContent = facility.name;
        btn.onclick = () => onFacilityClick(facility);
        container.appendChild(btn);
        console.log(`Added button for facility: ${facility.name}`);
    });

    // Version Tag
    const versionDiv = document.createElement('div');
    versionDiv.style.marginTop = '20px';
    versionDiv.style.fontSize = '0.8em';
    versionDiv.style.color = '#666';
    versionDiv.style.borderTop = '1px solid #ccc';
    versionDiv.style.paddingTop = '10px';
    versionDiv.innerText = 'File: view_1_grid.js | View: Facilities Grid | Updated: 2026-06-01 11:20 AM';
    container.appendChild(versionDiv);
}
