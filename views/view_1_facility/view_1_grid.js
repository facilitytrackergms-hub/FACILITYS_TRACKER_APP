/* =================================================
FILE: view_1_grid.js
VIEW: Facilities Dashboard Styled
UPDATED: 2026-06-01 11:50:00 AM
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

    container.innerHTML = `
        <div class='dash-container'>
            <div class='dash-card'>
                <h2 class='dash-title'>FACILITIES DASHBOARD</h2>
                <div style='margin-bottom:20px;'><button class='new-btn' id='createFacilityBtn'>Create New Facility</button></div>
                <div class='button-container'></div>
            </div>
        </div>
    `;

    const gridContainer = container.querySelector('.button-container');

    if (!facilities || facilities.length === 0) {
        gridContainer.innerHTML = '<div style="color:#666; font-style:italic;">No facilities found.</div>';
    } else {
        facilities.forEach(facility => {
            const btn = document.createElement('button');
            btn.className = 'facility-btn';
            btn.textContent = facility.name;
            btn.onclick = () => onFacilityClick(facility);
            gridContainer.appendChild(btn);
            console.log(`Added button for facility: ${facility.name}`);
        });
    }

    // Add version tag
    const versionDiv = document.createElement('div');
    versionDiv.style.marginTop = '20px';
    versionDiv.style.fontSize = '0.8em';
    versionDiv.style.color = '#666';
    versionDiv.style.borderTop = '1px solid #ccc';
    versionDiv.style.paddingTop = '10px';
    versionDiv.innerText = 'File: view_1_grid.js | View: Facilities Dashboard | Updated: 2026-06-01 11:50 AM';
    container.querySelector('.dash-card').appendChild(versionDiv);

    // Handle Create New Facility button
    document.getElementById('createFacilityBtn').onclick = () => {
        alert('Create New Facility modal would appear here');
    };
}
