================================================================
FILE METADATA
================================================================
FILE NAME    : view_1_grid.js
SUPABASE TBL : facilities
VIEW NAME    : Facilities Dashboard
POP-UP TITLE : Add New Facility
LAST UPDATED : 2026-06-06 @ 04:35 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

3. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

4. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

5. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

6. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

7. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

8. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

9. UNIQUE ALERTS: Never use generic default message boxes for custom 
   notifications. Always add a distinct, visible ID or tag to the 
   message box UI referencing its specific component/file.

10. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

11. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================

import { fetchFacilities } from './view_1_data.js';
import { setupFacilitiesEvents } from './view_1_modal.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export async function renderFacilities() {
    const app = document.getElementById('app');
    
    const styles = `
        <style>
            .dash-container { padding: 20px; text-align: center; font-family: Arial; background: #e3f2fd; min-height: 100vh; box-sizing: border-box; }
            .dash-card { background: rgba(255,255,255,0.88); border-radius: 18px; padding: 18px 12px 24px; box-shadow: 0 10px 24px rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.8); max-width: 380px; margin: 0 auto; }
            
            /* Changed to a clean 3-column grid layout for compact initials stacking */
            .button-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; max-width: 400px; margin: 0 auto; }
            
            /* Center-aligned padding adjustments optimized for short names/initials */
            .facility-btn { width: 100%; height: 60px; border-radius: 10px; background-color: #003366; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 1.1em; text-align: center; padding: 5px; box-sizing: border-box; }
            
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
                <div class="warning-content" id="warning-content-view_1_grid">
                    <h4>Missing Information</h4>
                    <p id="warningText">All fields are required before adding the facility image.</p>
                    <button id="closeWarning" class="warning-btn">OK</button>
                </div>
            </div>

            <div style="margin-top: 50px; font-size: 0.8em; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
                File: views/view_1_facility/view_1_grid.js | Updated: 2026-06-06 @ 04:35 AM
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
            btn.onclick = () => window.navigateTo('view_2_controls', { facility: f });
            list.appendChild(btn);
        });
    }
}
