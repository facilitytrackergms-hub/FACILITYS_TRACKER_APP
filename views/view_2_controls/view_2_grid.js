/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_2_grid.js
SUPABASE TBL : facilities
VIEW NAME    : Modify Facility Information
POP-UP TITLE : Modify Facility Information
LAST UPDATED : 2026-06-12 @ 01:20 PM
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

            .menu-layout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 360px; margin: 0 auto; }
            .action-btn { position:relative; width:100%; padding:14px 8px; background:#00264d; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:12px; text-align:center; box-sizing: border-box; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .badge-counter { position:absolute; top:-6px; right:-6px; background:#dc2626; color:white; font-size:11px; padding:3px 8px; border-radius: 9999px; font-weight:bold; border:2px solid white; display:none; }
            .back-btn { margin-top:5px; background:#6b7280; grid-column: span 2; }
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

    // Safely attach click handlers after DOM is ready
    requestAnimationFrame(() => {
        const addressLink = document.getElementById('facilityAddressLink');
        if (addressLink) {
            addressLink.onclick = () => {
                if (window.navigateTo) window.navigateTo('view_4_projects', { facility: facility });
            };
        } else {
            console.warn('[view_2_grid.js] facilityAddressLink not found in DOM');
        }

        const backDashBtn = document.getElementById('backDash');
        if (backDashBtn) {
            backDashBtn.onclick = () => {
                if (window.navigateTo) window.navigateTo('view_1_facility');
            };
        } else {
            console.warn('[view_2_grid.js] backDash button not found in DOM');
        }
    });

    // Remaining existing handlers for edit, save, delete...
    const mgmtOverlay = document.getElementById('mgmtOverlay');
    const openMgmtBtn = document.getElementById('openMgmtBtn');
    const closeMgmtBtn = document.getElementById('closeMgmtBtn');
    const saveMgmtBtn = document.getElementById('saveMgmtBtn');
    const deleteMgmtBtn = document.getElementById('deleteMgmtBtn');
    const editMgmtFile = document.getElementById('editMgmtFile');

    openMgmtBtn.onclick = () => { mgmtOverlay.style.display = 'block'; };
    closeMgmtBtn.onclick = () => { mgmtOverlay.style.display = 'none'; };

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

    deleteMgmtBtn.onclick = async () => {
        if (confirm(`CRITICAL WARNING:\nAre you absolutely sure you want to permanently erase "${facility.name}"? This operation cannot be undone.`)) {
            deleteMgmtBtn.textContent = "⏳ Cascading Dropped Records...";
            deleteMgmtBtn.disabled = true;
            
            const success = await deleteFacilityRecord(facility.id);
            if (success) {
                mgmtOverlay.style.display = 'none';
                if (window.navigateTo) window.navigateTo('view_1_facility');
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
        if (window.navigateTo) window.navigateTo('view_6_images', { facility: facility });
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
/*================================================================
END FILE: view_2_grid.js
UPDATED: 2026-06-12 @ 01:20 PM
================================================================*/
