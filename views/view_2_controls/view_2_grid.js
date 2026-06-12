/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_2_grid.js
SUPABASE TBL : facilities
VIEW NAME    : Modify Facility Information
POP-UP TITLE : Modify Facility Information
LAST UPDATED : 2026-06-12 @ 01:40 PM
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

    const styles = `...`; // your existing CSS unchanged

    app.innerHTML = `
        ${styles}
        <div class="controls-container">
            <div class="controls-card">
                <button id="openMgmtBtn" class="manage-trigger-btn">⚙️ Edit</button>
                
                <div>
                    <h1 class="controls-title">${facility?.name || 'FACILITY'}</h1>
                    
                    ${imageHtml}

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

            <div id="mgmtOverlay" class="mgmt-overlay"> ... </div>

            <div class="footer-tag">
                File: views/view_2_controls/view_2_grid.js | Updated: 2026-06-12 @ 01:40 PM
            </div>
        </div>
    `;

    setupControlsEvents(facility);

    // Attach address click safely
    const attachAddressNav = () => {
        const addressLink = document.getElementById('facilityAddressLink');
        if (addressLink) {
            addressLink.onclick = () => {
                if (window.navigateTo) window.navigateTo('view_4_projects', { facility: facility });
            };
        } else {
            console.warn('[view_2_grid.js] facilityAddressLink not found in DOM');
        }
    };
    requestAnimationFrame(attachAddressNav);

    // Existing handlers
    const mgmtOverlay = document.getElementById('mgmtOverlay');
    const openMgmtBtn = document.getElementById('openMgmtBtn');
    const closeMgmtBtn = document.getElementById('closeMgmtBtn');
    const saveMgmtBtn = document.getElementById('saveMgmtBtn');
    const deleteMgmtBtn = document.getElementById('deleteMgmtBtn');
    const editMgmtFile = document.getElementById('editMgmtFile');

    openMgmtBtn.onclick = () => { mgmtOverlay.style.display = 'block'; };
    closeMgmtBtn.onclick = () => { mgmtOverlay.style.display = 'none'; };

    saveMgmtBtn.onclick = async () => { ... };  // your existing save logic
    deleteMgmtBtn.onclick = async () => { ... }; // your existing delete logic

    // Navigation submenu
    document.getElementById('toIndividualIssues').onclick = () => { if(window.navigateTo) window.navigateTo('view_5_issues', { facility }); };
    document.getElementById('toContacts').onclick = () => { if(window.navigateTo) window.navigateTo('view_3_contacts', { facility }); };
    document.getElementById('toProjects').onclick = () => { if(window.navigateTo) window.navigateTo('view_4_projects', { facility }); };
    document.getElementById('toGallery').onclick = () => { if(window.navigateTo) window.navigateTo('view_6_images', { facility }); };
    document.getElementById('backDash').onclick = () => { if(window.navigateTo) window.navigateTo('view_1_facility'); };

    // Badge sync
    try {
        const activeIssues = await fetchFacilityIssues(facility.id);
        const activeCount = activeIssues ? activeIssues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length : 0;
        const badge = document.getElementById('issuesTrackBadge');
        if (badge && activeCount > 0) {
            badge.innerText = activeCount;
            badge.style.display = 'inline-block';
        }
    } catch (err) { console.warn("Could not sync active issue count badge parameters:", err); }
}
/*================================================================
END FILE: view_2_grid.js
UPDATED: 2026-06-12 @ 01:40 PM
================================================================*/
