/*================================================================
FILE NAME    : view_2_grid.js
SUPABASE TBL : facilities
VIEW NAME    : Modify Facility Information
POP-UP TITLE : Modify Facility Information
LAST UPDATED : 2026-06-12 @ 12:50 PM
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
        imageHtml = `<div style="margin: 5px auto 15px auto; width: 90%; max-width: 440px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
            <img src="${facility.image_url}" alt="${facility.name}" style="width: 100%; height: auto; max-height: 200px; object-fit: cover; display: block;" />
        </div>`;
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

            .menu-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 400px; margin: 0 auto; }
            .action-btn { position:relative; width:100%; padding:16px 12px; background:#00264d; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:14px; text-align:center; box-sizing: border-box; box-shadow: 0 3px 6px rgba(0,0,0,0.08); }
            .badge-counter { position:absolute; top:-6px; right:-6px; background:#dc2626; color:white; font-size:12px; padding:3px 8px; border-radius: 9999px; font-weight:bold; border:2px solid white; display:none; }
            .back-btn { margin-top:5px; background:#6b7280; grid-column: span 2; }
            
            .mgmt-overlay { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index: 10000; box-sizing: border-box; }
            .mgmt-content { background: white; max-width: 440px; margin: 5vh auto; border-radius: 16px; padding: 20px; text-align: left; box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
            .mgmt-field { margin-bottom: 12px; }
            .mgmt-field label { display: block; font-size: 11px; font-weight: bold; color: #00264d; text-transform: uppercase; margin-bottom: 4px; }
            .mgmt-field input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
            .mgmt-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 15px; }
            .mgmt-btn-save { padding: 12px; background: #28a745; color: white; font-weight: bold; text-transform: uppercase; border:none; border-radius: 8px; cursor: pointer; text-align: center; }
            .mgmt-btn-delete { padding: 10px; background: #dc2625; color: white; font-weight: bold; text-transform: uppercase; border:none; border-radius: 8px; cursor: pointer; text-align: center; font-size:12px; margin-top: 10px; }
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
                            <a href="#" id="facilityAddressLink" style="color:#00264d; font-weight:500; text-decoration:underline;">
                                ${addressDisplay}
                            </a>
                        </div>
                        <div class="info-row" style="margin-top:10px;">
                            <span class="info-label">📞 Phone Contact</span>
                            ${phoneLink}
                        </div>
                    </div>
                </div>
                <div class="divider-line"></div>
                <div class="menu-layout">
                    <button id="toIndividualIssues" class="action-btn">🚨 1. Issues <span id="issuesTrackBadge" class="badge-counter">0</span></button>
                    <button id="toContacts" class="action-btn">👥 2. Contact</button>
                    <button id="toProjects" class="action-btn">📋 3. Projects</button>
                    <button id="toGallery" class="action-btn">🖼️ 4. Images</button>
                    <button id="backDash" class="action-btn back-btn">⬅️ 5. Back to Dashboard</button>
                </div>
            </div>
        </div>
    `;

    setupControlsEvents(facility);

    requestAnimationFrame(() => {
        const addressLink = document.getElementById('facilityAddressLink');
        if (addressLink) addressLink.onclick = () => { if(window.navigateTo) window.navigateTo('view_4_projects', { facility }); };
        const backDashBtn = document.getElementById('backDash');
        if (backDashBtn) backDashBtn.onclick = () => { if(window.navigateTo) window.navigateTo('view_1_facility'); };
    });

    // Remaining handlers for edit/save/delete
    const mgmtOverlay = document.getElementById('mgmtOverlay');
    const openMgmtBtn = document.getElementById('openMgmtBtn');
    const closeMgmtBtn = document.getElementById('closeMgmtBtn');
    const saveMgmtBtn = document.getElementById('saveMgmtBtn');
    const deleteMgmtBtn = document.getElementById('deleteMgmtBtn');
    const editMgmtFile = document.getElementById('editMgmtFile');

    if(openMgmtBtn) openMgmtBtn.onclick = () => { if(mgmtOverlay) mgmtOverlay.style.display = 'block'; };
    if(closeMgmtBtn) closeMgmtBtn.onclick = () => { if(mgmtOverlay) mgmtOverlay.style.display = 'none'; };

    if(saveMgmtBtn) saveMgmtBtn.onclick = async () => {
        const updatedName = document.getElementById('editMgmtName')?.value.trim();
        const updatedAddress = document.getElementById('editMgmtAddress')?.value.trim();
        const updatedPhone = document.getElementById('editMgmtPhone')?.value.trim();
        if(!updatedName || !updatedAddress) { alert("Name and Address cannot be empty."); return; }
        saveMgmtBtn.textContent = "⏳ Synchronizing Updates..."; saveMgmtBtn.disabled = true;
        if(editMgmtFile?.files?.[0]) await uploadFacilityImage(facility.id, editMgmtFile.files[0]);
        const success = await updateFacilityDetails(facility.id, updatedName, updatedAddress, updatedPhone);
        if(success && mgmtOverlay) { mgmtOverlay.style.display='none'; renderFacilityControls({id:facility.id}); }
        else { alert("Database write error."); saveMgmtBtn.textContent="Apply Configuration Changes"; saveMgmtBtn.disabled=false; }
    };

    if(deleteMgmtBtn) deleteMgmtBtn.onclick = async () => {
        if(confirm(`Delete "${facility.name}"? This cannot be undone.`)){
            deleteMgmtBtn.textContent="⏳ Cascading Dropped Records..."; deleteMgmtBtn.disabled=true;
            const success = await deleteFacilityRecord(facility.id);
            if(success && mgmtOverlay){ mgmtOverlay.style.display='none'; if(window.navigateTo) window.navigateTo('view_1_facility'); }
            else { alert("Database deletion failed."); deleteMgmtBtn.textContent="🗑️ Delete Facility Entirely"; deleteMgmtBtn.disabled=false; }
        }
    };

    // Navigation buttons
    const toIssues=document.getElementById('toIndividualIssues'); if(toIssues) toIssues.onclick=()=>{ if(window.navigateTo) window.navigateTo('view_5_issues',{facility}); };
    const toContacts=document.getElementById('toContacts'); if(toContacts) toContacts.onclick=()=>{ if(window.navigateTo) window.navigateTo('view_3_contacts',{facility}); };
    const toProjects=document.getElementById('toProjects'); if(toProjects) toProjects.onclick=()=>{ if(window.navigateTo) window.navigateTo('view_4_projects',{facility}); };
    const toGallery=document.getElementById('toGallery'); if(toGallery) toGallery.onclick=()=>{ if(window.navigateTo) window.navigateTo('view_6_images',{facility}); };
}
/*================================================================
END FILE: view_2_grid.js
================================================================*/
