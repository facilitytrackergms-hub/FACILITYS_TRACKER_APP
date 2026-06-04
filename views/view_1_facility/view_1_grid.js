/* =================================================
FILE: views/view_1_facility/view_1_grid.js
UPDATED: 2026-06-02 08:45:00 PM
/* =================================================
FILE: views/view_1_facility/view_1_grid.js
UPDATED: 2026-06-04 10:15:00 AM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchFacilities } from './view_1_data.js';
import { setupFacilitiesEvents } from './view_1_modal.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export async function renderFacilities() {
    const app = document.getElementById('app');
    
    const styles = `
        <style>
            .dash-container { padding: 20px; text-align: center; font-family: Arial; background: #e3f2fd; min-height: 100vh; box-sizing: border-box; }
            .dash-card { background: rgba(255,255,255,0.88); border-radius: 18px; padding: 18px 12px 24px; box-shadow: 0 10px 24px rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.8); max-width: 380px; margin: 0 auto; }
            .button-container { display: flex; flex-direction: column; gap: 15px; padding: 10px; max-width: 400px; margin: 0 auto; }
            
            /* Clean split block rows for Facility + Camera Action Row items */
            .facility-row-item { display: flex; gap: 8px; width: 100%; align-items: center; justify-content: space-between; }
            .facility-btn { flex-grow: 1; height: 60px; border-radius: 10px; background-color: #003366; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 1em; text-align: left; padding: 0 15px; }
            .facility-camera-btn { width: 70px; height: 60px; border-radius: 10px; background-color: #28a745; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 0.9em; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; }
            
            .new-btn { background-color: #28a745; margin-bottom: 20px; width: 200px; text-align: center; }
            .dash-title { font-size: 1.25em; font-weight: 900; color: #003366; margin-bottom: 10px; text-transform: uppercase; border-bottom: 4px solid #003366; padding-bottom: 15px; display: inline-block; width: 90%; white-space: nowrap; }
            .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10; overflow-y: auto; padding: 10px; }
            .modal-content { position: relative; top: 5%; left: 50%; transform: translateX(-50%); width: 100%; max-width: 400px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); box-sizing: border-box; }
            input { display: block; width: 100%; margin: 10px auto; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
            .warning-modal { display: none; position: fixed; inset: 0; background: rgba(255,0,0,0.2); z-index: 20; }
            .warning-content { position: absolute; top: 30%; left: 50%; transform: translateX(-50%); background: white; padding: 25px; border-radius: 8px; border: 2px solid #dc3545; text-align: center; max-width: 300px; }
            .warning-content h4 { color: #dc3545; margin-top: 0; }
            .warning-btn { background: #dc3545; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px; }
            #post-save-images { display: none; margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="dash-container">
            <div class="dash-card">
                <h1 class="dash-title">FACILITIES DASHBOARD</h1>
                <br>
                <button id="openModal" class="facility-btn new-btn">Create New Facility</button>
                <div id="list" class="button-container">Loading...</div>
            </div>

            <div id="modal" class="modal-overlay">
                <div class="modal-content">
                    <h3 id="modalTitle">Add New Facility</h3>
                    <div id="facility-fields">
                        <input type="text" id="name" placeholder="Facility Name">
                        <input type="text" id="address" placeholder="Address">
                        <input type="text" id="phone" placeholder="Phone">
                        <button id="prepareImageBtn" class="facility-btn" style="background:#f5c400; color:#111; width:100%; margin: 20px auto 0 auto; text-align: center;">
                            Add/Delete Facility Image
                        </button>
                    </div>
                    <div id="post-save-images">
                        <p style="font-weight: bold; color: #28a745; margin-bottom: 10px;">Facility Saved. Add or Delete Image Below:</p>
                        <div id="image-manager-mount"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                        <button id="saveBtn" class="facility-btn new-btn" style="width:100%; margin: 0 auto; text-align: center;">Save Facility</button>
                        <button id="closeModal" class="facility-btn" style="background:#666; width:100%; margin: 0 auto; text-align: center;">Close</button>
                    </div>
                </div>
            </div>

            <div id="warningModal" class="warning-modal">
                <div class="warning-content">
                    <h4>Missing Information</h4>
                    <p id="warningText">All fields are required before adding the facility image.</p>
                    <button id="closeWarning" class="warning-btn">OK</button>
                </div>
            </div>

            <div style="margin-top: 50px; font-size: 0.8em; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
                File: views/view_1_facility/view_1_grid.js | Updated: 2026-06-04 10:15:00 AM
            </div>
        </div>
    `;

    setupFacilitiesEvents(renderFacilities);

    const data = await fetchFacilities();
    const list = document.getElementById('list');
    list.innerHTML = '';

    if (data) {
        data.forEach(f => {
            // Create a wrapper layout row container
            const row = document.createElement('div');
            row.className = 'facility-row-item';

            // 1. Navigation Button (Facility Name Text Block)
            const btn = document.createElement('button');
            btn.className = 'facility-btn';
            btn.textContent = f.name;
            btn.onclick = () => window.navigateTo('view_2_controls', { facility: f });

            // 2. Immediate Camera Action Trigger Button
            const cameraBtn = document.createElement('button');
            cameraBtn.className = 'facility-camera-btn';
            cameraBtn.innerHTML = '<span>📸</span><span style="font-size:10px;">PHOTO</span>';
            
            cameraBtn.onclick = () => {
                const modal = document.getElementById('modal');
                const facilityFields = document.getElementById('facility-fields');
                const saveBtn = document.getElementById('saveBtn');
                const imageSection = document.getElementById('post-save-images');
                const imageMount = document.getElementById('image-manager-mount');
                
                // Configure modal context layout settings automatically for this clicked facility row
                document.getElementById('modalTitle').innerText = "Facility Image: " + f.name;
                facilityFields.style.display = 'none';
                saveBtn.style.display = 'none';
                imageSection.style.display = 'block';
                imageMount.innerHTML = '';
                
                modal.style.display = 'block';
                
                // Instantly bundle up and render image camera picker mounts for this facility row index reference
                renderImageManagerSection(imageMount, 'facility', f.id, { title: 'Facility Photos' });
            };

            row.appendChild(btn);
            row.appendChild(cameraBtn);
            list.appendChild(row);
        });
    }
}
STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchFacilities } from './view_1_data.js';
import { setupFacilitiesEvents } from './view_1_modal.js';

export async function renderFacilities() {
    const app = document.getElementById('app');
    
    const styles = `
        <style>
            .dash-container { padding: 20px; text-align: center; font-family: Arial; background: #e3f2fd; min-height: 100vh; box-sizing: border-box; }
            .dash-card { background: rgba(255,255,255,0.88); border-radius: 18px; padding: 18px 12px 24px; box-shadow: 0 10px 24px rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.8); max-width: 380px; margin: 0 auto; }
            .button-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 10px; max-width: 400px; margin: 0 auto; }
            .facility-btn { width: 100%; height: 60px; border-radius: 10px; background-color: #003366; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 1.1em; }
            .new-btn { background-color: #28a745; margin-bottom: 20px; width: 200px; }
            .dash-title { font-size: 1.25em; font-weight: 900; color: #003366; margin-bottom: 10px; text-transform: uppercase; border-bottom: 4px solid #003366; padding-bottom: 15px; display: inline-block; width: 90%; white-space: nowrap; }
            .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10; overflow-y: auto; padding: 10px; }
            .modal-content { position: relative; top: 5%; left: 50%; transform: translateX(-50%); width: 100%; max-width: 400px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); box-sizing: border-box; }
            input { display: block; width: 100%; margin: 10px auto; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
            .warning-modal { display: none; position: fixed; inset: 0; background: rgba(255,0,0,0.2); z-index: 20; }
            .warning-content { position: absolute; top: 30%; left: 50%; transform: translateX(-50%); background: white; padding: 25px; border-radius: 8px; border: 2px solid #dc3545; text-align: center; max-width: 300px; }
            .warning-content h4 { color: #dc3545; margin-top: 0; }
            .warning-btn { background: #dc3545; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px; }
            #post-save-images { display: none; margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="dash-container">
            <div class="dash-card">
                <h1 class="dash-title">FACILITIES DASHBOARD</h1>
                <br>
                <button id="openModal" class="facility-btn new-btn">Create New Facility</button>
                <div id="list" class="button-container">Loading...</div>
            </div>

            <div id="modal" class="modal-overlay">
                <div class="modal-content">
                    <h3 id="modalTitle">Add New Facility</h3>
                    <div id="facility-fields">
                        <input type="text" id="name" placeholder="Facility Name">
                        <input type="text" id="address" placeholder="Address">
                        <input type="text" id="phone" placeholder="Phone">
                        <button id="prepareImageBtn" class="facility-btn" style="background:#f5c400; color:#111; width:100%; margin: 20px auto 0 auto;">
                            Add/Delete Facility Image
                        </button>
                    </div>
                    <div id="post-save-images">
                        <p style="font-weight: bold; color: #28a745; margin-bottom: 10px;">Facility Saved. Add or Delete Image Below:</p>
                        <div id="image-manager-mount"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                        <button id="saveBtn" class="facility-btn new-btn" style="width:100%; margin: 0 auto;">Save Facility</button>
                        <button id="closeModal" class="facility-btn" style="background:#666; width:100%; margin: 0 auto;">Close</button>
                    </div>
                </div>
            </div>

            <div id="warningModal" class="warning-modal">
                <div class="warning-content">
                    <h4>Missing Information</h4>
                    <p id="warningText">All fields are required before adding the facility image.</p>
                    <button id="closeWarning" class="warning-btn">OK</button>
                </div>
            </div>

            <div style="margin-top: 50px; font-size: 0.8em; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
                File: views/view_1_facility/view_1_grid.js | Updated: 2026-06-02 08:45:00 PM
            </div>
        </div>
    `;

    setupFacilitiesEvents(renderFacilities);

    const data = await fetchFacilities();
    const list = document.getElementById('list');
    list.innerHTML = '';

    if (data) {
        data.forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'facility-btn';
            btn.textContent = f.name;
            // FIX: Wrap f inside an object property named facility to align with router expectations
            btn.onclick = () => window.navigateTo('view_2_controls', { facility: f });
            list.appendChild(btn);
        });
    }
}
