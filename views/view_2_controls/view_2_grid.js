/*================================================================
FILE NAME    : view_2_grid.js
LAST UPDATED : 2026-06-12 @ 12:45 PM
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
        imageHtml = `<div style="margin:5px auto 15px auto;width:90%;max-width:440px;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);border:1px solid #e2e8f0;">
            <img src="${facility.image_url}" alt="${facility.name}" style="width:100%;height:auto;max-height:200px;object-fit:cover;display:block;" />
        </div>`;
    }

    app.innerHTML = `
        <div class="controls-container">
            <div class="controls-card">
                <button id="openMgmtBtn" class="manage-trigger-btn">⚙️ Edit</button>
                <div>
                    <h1 class="controls-title">${facility?.name || 'FACILITY'}</h1>
                    ${imageHtml}
                    <div class="info-panel">
                        <div class="info-row">
                            <span class="info-label">📍 Address</span>
                            <a href="#" id="facilityAddressLink" style="color:#00264d;font-weight:500;text-decoration:underline;">${addressDisplay}</a>
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

    // Navigation buttons
    const toIssues = document.getElementById('toIndividualIssues');
    if (toIssues) toIssues.onclick = () => { if(window.navigateTo) window.navigateTo('view_5_issues', { facility }); };

    const toContacts = document.getElementById('toContacts');
    if (toContacts) toContacts.onclick = () => { if(window.navigateTo) window.navigateTo('view_3_contacts', { facility }); };

    const toProjects = document.getElementById('toProjects');
    if (toProjects) toProjects.onclick = () => { if(window.navigateTo) window.navigateTo('view_4_projects', { facility }); };

    const toGallery = document.getElementById('toGallery');
    if (toGallery) toGallery.onclick = () => { if(window.navigateTo) window.navigateTo('view_6_images', { facility }); };

    // Badge counter
    try {
        const activeIssues = await fetchFacilityIssues(facility.id);
        const activeCount = activeIssues ? activeIssues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length : 0;
        const badge = document.getElementById('issuesTrackBadge');
        if (badge && activeCount > 0) {
            badge.innerText = activeCount;
            badge.style.display = 'inline-block';
        }
    } catch (err) { console.warn(err); }
}
/*================================================================
END FILE: view_2_grid.js
================================================================*/
