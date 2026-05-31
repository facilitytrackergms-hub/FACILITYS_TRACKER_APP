/* =================================================
FILE: controls_v4_grid.js
UPDATED: 2026-05-30 05:50 AM
================================================= */
import { getProjects } from './controls_v4_data.js';
import { setupProjectModals } from './controls_v4_modal.js';

export async function renderPendingProjects(data) {
    const facility = data?.facility ? data.facility : data;
    if (!facility || !facility.id) return;

    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center;">
            <h1 style="color:#00264d; font-size:22px; text-transform:uppercase; margin-bottom:5px;">Active Projects Tracker</h1>
            <p style="color:#4b5563; margin-bottom:25px;">Facility: ${facility.Name}</p>

            <div style="display:flex; flex-direction:column; gap:15px; max-width:400px; margin:0 auto;">
                <button id="projectTrackCreateBtn" style="padding:15px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">+ ADD NEW PROJECT</button>
                <button id="projectTrackBackBtn" style="padding:12px; background:#00264d; color:white; border:none; border-radius:8px; cursor:pointer;">BACK TO CONTROLS</button>
                
                <div id="activeProjectsList" style="margin-top:20px; display:flex; flex-direction:column; gap:12px; text-align:left;">
                    <div style="text-align:center; color:#94a3b8; font-style:italic;">Loading active facility projects...</div>
                </div>
            </div>

            <div id="projectTrackFormModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:2000; justify-content:center; align-items:center; padding:20px;">
                <div style="background:white; padding:25px; border-radius:12px; width:100%; max-width:420px; text-align:left; box-shadow:0 4px 15px rgba(0,0,0,0.3);">
                    <h3 style="margin-top:0; color:#00264d; border-bottom:2px solid #f5c400; padding-bottom:10px;">Create Active Project</h3>
                    
                    <label style="display:block; font-size:12px; font-weight:bold; color:#666; margin-top:15px;">PROJECT NAME</label>
                    <input type="text" id="projectTrackTitleInput" style="width:100%; padding:11px; margin-top:5px; border:1px solid #ccc; border-radius:6px;" placeholder="e.g., Roof Renovation, Paving">
                    
                    <label style="display:block; font-size:12px; font-weight:bold; color:#666; margin-top:15px;">BUDGET / ALLOCATION</label>
                    <input type="text" id="projectTrackBudgetInput" style="width:100%; padding:11px; margin-top:5px; border:1px solid #ccc; border-radius:6px;" placeholder="e.g., $15,000">

                    <label style="display:block; font-size:12px; font-weight:bold; color:#666; margin-top:15px;">NOTES & SCOPE</label>
                    <textarea id="projectTrackNotesInput" style="width:100%; padding:11px; margin-top:5px; border:1px solid #ccc; border-radius:6px; min-height:80px;" placeholder="Scope guidelines..."></textarea>
                    
                    <div style="display:flex; gap:10px; margin-top:25px;">
                        <button id="projectTrackSaveBtn" style="flex:1; padding:13px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">CREATE PROJECT</button>
                        <button id="projectTrackCloseBtn" style="flex:1; padding:13px; background:#eee; color:#333; border:none; border-radius:8px; cursor:pointer;">CANCEL</button>
                    </div>
                </div>
            </div>

            <div style="margin-top:50px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px;">
                File: controls_v4_grid.js | Updated: 2026-05-30 05:50 AM
            </div>
        </div>
    `;

    setupProjectModals(facility);
    await loadFacilityProjects(facility);
}

async function loadFacilityProjects(facility) {
    const listContainer = document.getElementById('activeProjectsList');
    listContainer.innerHTML = '<div style="text-align:center; color:#94a3b8; font-style:italic;">Loading projects...</div>';

    try {
        const { data } = await getProjects(facility.id);
        if (!data || data.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center;color:#94a3b8;font-style:italic;">No pending active projects found.</div>';
            return;
        }

        listContainer.innerHTML = data.map(item => `
            <div style="background:white; padding:15px; border-radius:10px; border-left:5px solid #00264d; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                <strong style="color:#00264d; font-size:16px; display:block; margin-bottom:4px;">${item.project_title || item.project_name || item.Title || 'Untitled Project'}</strong>
                ${item.budget ? `<span style="font-size:12px; background:#eff6ff; color:#1e40af; padding:2px 6px; border-radius:4px; font-weight:bold; display:inline-block; margin-bottom:8px;">Budget: ${item.budget}</span>` : ''}
                <p style="margin:0; font-size:13px; color:#4b5563; line-height:1.4;">${item.notes || 'No extra scope notes recorded.'}</p>
                <span style="font-size:10px; color:#94a3b8; display:block; margin-top:10px;">Created: ${new Date(item.created_at).toLocaleDateString()}</span>
            </div>
        `).join('');
    } catch (err) {
        console.error("Error loading facility projects:", err);
        listContainer.innerHTML = '<div style="text-align:center;color:#dc2626;font-weight:bold;">Failed to load projects.</div>';
    }
}
