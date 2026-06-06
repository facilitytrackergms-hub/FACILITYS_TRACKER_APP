/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_2_grid.js
SUPABASE TBL : facilities
VIEW NAME    : Modify Facility Information
POP-UP TITLE : Modify Facility Information
LAST UPDATED : 2026-06-06 @ 05:13 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below, determine the 
   correct names/tables/views from the context, and fill them in 
   accurately before delivering the code block.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_2_grid.js';

import { fetchFacilityIssues, fetchSingleFacility, updateFacilityDetails, deleteFacilityRecord, uploadFacilityImage } from './view_2_data.js';
import { setupControlsEvents } from './view_2_modal.js';

export async function renderFacilityControls(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const initialFacility = data?.facility ? data.facility : data;
    const facility = await fetchSingleFacility(initialFacility?.id) || initialFacility;

    const addressDisplay = facility?.address || 'No Address Listed';
    
    let phoneLink = `<span style="color:#94a3b8; font-style:italic;">No Phone Listed</span>`;
    if (facility?.phone) {
        const cleanPhone = String(facility.phone).replace(/[^0-9+]/g, '');
        phoneLink = `<a href="tel:${cleanPhone}" style="color:#00264d; text-decoration:none; font-weight:bold; border-bottom:1px dashed #00264d;">📞 ${facility.phone}</a>`;
    }

    let imageHtml = '';
    if (facility?.image_url) {
        imageHtml = `
            <div style="margin: 5px auto 15px auto; width: 90%; max-width: 440px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                <img src="${facility.image_url}" alt="${facility.name}" style="width: 100%; height: auto; max-height: 200px; object-fit: cover; display: block;" />
            </div>
        `;
    }

    const styles = `
        <style>
            .controls-container { padding: 20px; font-family: Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing: border-box; }
            .controls-card { background: white; border-radius: 18px; padding: 25px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.06); position: relative; }
            .controls-title { color:#00264d; font-size:24px; margin:0 0 5px 0; line-height:1.1; text-transform:uppercase; font-weight: 900; padding-right: 40px; }
            
            .manage-trigger-btn { position: absolute; top: 20px; right: 20px; background: #e2e8f0; border: none; font-size: 16px; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: bold; color: #334155; }
            .manage-trigger-btn:hover { background: #cbd5e1; }

            .info-panel { background:#f8fafc; border-radius:12px; padding:12px 15px; margin: 15px auto; width:90%; border:1px solid #e2e8f0; text-align:left; box-sizing: border-box; }
            .info-row { font-size:13px; color:#475569; margin-bottom:6px; line-height:1.4; }
            .info-row:last-child { margin-bottom: 0; }
            .info-label { font-weight:bold; color:#00264d; text-transform:uppercase; font-size:11px; display:block; margin-bottom:2px; }
            
            .divider-line { width:100%; max-width:320px; height:5px; background:#00264d; margin:20px auto; border-radius:2px; }
            
            /* Two columns layout for a cleaner, compact fit */
            .menu-layout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 360px; margin: 0 auto; }
            .action-btn { position:relative; width:100%; padding:14px 8px; background:#00264d; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:12px; text-align:center; box-sizing: border-box; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .badge-counter { position:absolute; top:-6px; right:-6px; background:#dc2626; color:white; font-size:11px; padding:3px 8px; border-radius: 9999px; font-weight:bold; border:2px solid white; display:none; }
            
            /* Make the back button stretch all the way across both columns */
            .back-btn { margin-top:5px; background:#6b7280; grid-column: span 2; }
            
            /* Admin Management Overlay Styles */
            .mgmt-overlay { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index: 10000; box-sizing: border-box; }
            .mgmt-content { background: white; max-width: 440px; margin: 5vh auto; border-radius: 16px; padding: 20px; text-align: left; box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
            .mgmt-field { margin-bottom: 12px; }
            .mgmt-field label { display: block; font-size: 11px; font-weight: bold; color: #00264d; text-transform: uppercase; margin-bottom: 4px; }
            .mgmt-field input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
            .mgmt-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
            .mgmt-btn-save { padding: 12px; background: #28a745; color: white; font-weight: bold; text-transform: uppercase; border:none; border-radius: 8px; cursor: pointer; text-align: center; }
            .mgmt-btn-delete { padding: 10px; background: #dc2625; color: white; font-weight: bold; text-transform: uppercase; border:none; border-radius: 8px; cursor: pointer; text-align: center; font-size:11px; margin-top: 10px; }
            .mgmt-btn-cancel { padding: 10px; background: #6b7280; color: white; font-weight: bold; text-transform: uppercase; border:none; border-radius: 8px; cursor: pointer; text-align: center; }
            .footer-tag { margin-top:40px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="controls-container">
            <div class="controls-card">
                <button id="openMgmtBtn" class="manage-trigger-btn">⚙️ Edit</button>
                
                <div>
                    <h1 class="controls-title">${facility?.name || 'FACILITY'}</h1>
                    
                    ${imageHtml}

                    <div class="info-panel">
                        <div class="info-row">
                            <span class="info-label">📍 Address</span>
                            <span style="color:#1e293b; font-weight:500;">${addressDisplay}</span>
                        </div>
                        <div class="info-row" style="margin-top:10px;">
                            <span class="info-label">📞 Phone Contact</span>
                            ${phoneLink}
                        </div>
                    </div>
                </div>

                <div class="divider-line"></div>

                <div class="menu-layout">
                    <button id="toIndividualIssues" class="action-btn">
                        🚨 1. Issues
                        <span id="issuesTrackBadge" class="badge-counter">0</span>
                    </button>

                    <button id="toContacts" class="action-btn">👥 2. Contact</button>
                    <button id="toProjects" class="action-btn">📋 3. Projects</button>
                    <button id="toGallery" class="action-btn">🖼️ 4. Images</button>
                    
                    <button id="backDash" class="action-btn back-btn">⬅️ 5. Back to Dashboard</button>
                </div>
            </div>

            <div id="mgmtOverlay" class="mgmt-overlay">
                <div class="mgmt-content">
                    <h3 style="margin-top:0; color:#00264d; font-size:18px;">Modify Facility Information</h3>
                    
                    <div class="mgmt-field">
                        <label>Facility Name</label>
                        <input type="text" id="editMgmtName" value="${facility?.name || ''}">
                    </div>
                    <div class="mgmt-field">
                        <label>Street Address</label>
                        <input type="text" id="editMgmtAddress" value="${facility?.address || ''}">
                    </div>
                    <div class="mgmt-field">
                        <label>Phone Number</label>
                        <input type="text" id="editMgmtPhone" value="${facility?.phone || ''}">
                    </div>

                    <div class="mgmt-field" style="margin-top:15px; background: #f8fafc; padding: 10px; border-radius:8px; border: 1px dashed #cbd5e1;">
                        <label>Change Profile Banner Image</label>
                        <input type="file" id="editMgmtFile" accept="image/*" style="border:none; padding:4px 0;">
                    </div>

                    <div class="mgmt-actions">
                        <button id="saveMgmtBtn" class="mgmt-btn-save">Apply Configuration Changes</button>
                        <button id="closeMgmtBtn" class="mgmt-btn-cancel">Discard / Cancel</button>
                        <button id="deleteMgmtBtn" class="mgmt-btn-delete">🗑️ Delete Facility Entirely</button>
                    </div>
                </div>
            </div>

            <div class="footer-tag">
                File: views/view_2_controls/view_2_grid.js | Updated: 2026-06-06 @ 05:13 AM
            </div>
        </div>
    `;

    setupControlsEvents(facility);

    // Form DOM Management references
    const mgmtOverlay = document.getElementById('mgmtOverlay');
    const openMgmtBtn = document.getElementById('openMgmtBtn');
    const closeMgmtBtn = document.getElementById('closeMgmtBtn');
    const saveMgmtBtn = document.getElementById('saveMgmtBtn');
    const deleteMgmtBtn = document.getElementById('deleteMgmtBtn');
    const editMgmtFile = document.getElementById('editMgmtFile');

    openMgmtBtn.onclick = () => { mgmtOverlay.style.display = 'block'; };
    closeMgmtBtn.onclick = () => { mgmtOverlay.style.display = 'none'; };

    // Update Handler
    saveMgmtBtn.onclick = async () => {
        const updatedName = document.getElementById('editMgmtName').value.trim();
        const updatedAddress = document.getElementById('editMgmtAddress').value.trim();
        const updatedPhone = document.getElementById('editMgmtPhone').value.trim();

        if (!updatedName || !updatedAddress) {
            alert("[ERR-ALERT:view_2_grid:validation_failed] Name and Address parameters cannot be empty.");
            return;
        }

        saveMgmtBtn.textContent = "⏳ Synchronizing Updates...";
        saveMgmtBtn.disabled = true;

        if (editMgmtFile.files && editMgmtFile.files[0]) {
            await uploadFacilityImage(facility.id, editMgmtFile.files[0]);
        }

        const success = await updateFacilityDetails(facility.id, updatedName, updatedAddress, updatedPhone);
        if (success) {
            mgmtOverlay.style.display = 'none';
            renderFacilityControls({ id: facility.id });
        } else {
            alert("[ERR-ALERT:view_2_grid:db_write_failed] Database write error encountered updating your record details.");
            saveMgmtBtn.textContent = "Apply Configuration Changes";
            saveMgmtBtn.disabled = false;
        }
    };

    // Delete Handler
    deleteMgmtBtn.onclick = async () => {
        if (confirm(`CRITICAL WARNING:\nAre you absolutely sure you want to permanently erase "${facility.name}"? This operation cannot be undone.`)) {
            deleteMgmtBtn.textContent = "⏳ Cascading Dropped Records...";
            deleteMgmtBtn.disabled = true;
            
            const success = await deleteFacilityRecord(facility.id);
            if (success) {
                mgmtOverlay.style.display = 'none';
                if (window.navigateTo) window.navigateTo('view_1_dashboard');
            } else {
                alert("[ERR-ALERT:view_2_grid:db_delete_failed] Database deletion exception encountered.");
                deleteMgmtBtn.textContent = "🗑️ Delete Facility Entirely";
                deleteMgmtBtn.disabled = false;
            }
        }
    };

    // Navigation Submenu Routings
    document.getElementById('toIndividualIssues').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_5_issues', { facility: facility });
    };

    document.getElementById('toContacts').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_3_contacts', { facility: facility });
    };

    document.getElementById('toProjects').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_4_projects', { facility: facility });
    };

    document.getElementById('toGallery').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_6_gallery', { facility: facility });
    };

    document.getElementById('backDash').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_1_dashboard');
    };

    // Live Badge Sync Counter
    try {
        const activeIssues = await fetchFacilityIssues(facility.id);
        const activeCount = activeIssues ? activeIssues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length : 0;
        const badge = document.getElementById('issuesTrackBadge');
        if (badge && activeCount > 0) {
            badge.innerText = activeCount;
            badge.style.display = 'inline-block';
        }
    } catch (err) {
        console.warn("Could not sync active issue count badge parameters:", err);
    }
}
