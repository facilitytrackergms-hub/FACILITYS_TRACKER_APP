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
            <img src="${facility.image_url}" alt="${facility.name}" style="width: 100%; height: auto; max-height: 150px; object-fit: cover; display: block;" />
        </div>`;
    }

    const styles = `
        <style>
            .controls-container { padding: 20px; font-family: Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing: border-box; }
            .controls-card { background: white; border-radius: 18px; padding: 25px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.06); position: relative; }
            .controls-title { color:#00264d; font-size:24px; margin:0 0 5px 0; line-height:1.1; text-transform:uppercase; font-weight: 900; padding-right: 40px; }

            .manage-trigger-btn { 
                position: absolute; 
                top: 16px; 
                right: 16px; 
                background: #e2e8f0; 
                border: none; 
                font-size: 13px; 
                padding: 6px 10px; 
                border-radius: 8px; 
                cursor: pointer; 
                font-weight: bold; 
                color: #334155; 
            }

            .info-panel { background:#f8fafc; border-radius:12px; padding:12px 15px; margin: 15px auto; width:90%; border:1px solid #e2e8f0; text-align:left; box-sizing: border-box; }
            .info-row { font-size:13px; color:#475569; margin-bottom:6px; line-height:1.4; }
            .info-label { font-weight:bold; color:#00264d; text-transform:uppercase; font-size:11px; display:block; margin-bottom:2px; }

            .divider-line { width:100%; max-width:320px; height:5px; background:#00264d; margin:20px auto; border-radius:2px; }

            .menu-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 400px; margin: 0 auto; }

            .action-btn { position:relative; width:100%; padding:16px 12px; background:#00264d; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:14px; }

            .back-btn { grid-column: span 2; background:#6b7280; }

            .footer-tag{
                margin-top: 25px;
                font-size: 10px;
                color: #94a3b8;
                border-top: 1px solid #e5e7eb;
                padding-top: 10px;
                text-align:center;
            }
        </style>
    `;

    const footerTag = `
        <div class="footer-tag">
            ${__FILENAME} | view_2_grid.js | v1 | 2026-06-13 06:20 PM
        </div>
    `;

    app.innerHTML = `
        ${styles}
        <div class="controls-container">
            <div class="controls-card">
                <button id="openMgmtBtn" class="manage-trigger-btn">⚙️ Edit</button>

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
                        <span class="info-label">  Phone Contact</span>
                        ${phoneLink}
                    </div>
                </div>

                <div class="divider-line"></div>

                <div class="menu-layout">
                    <button id="toIndividualIssues" class="action-btn">🚨 1. Issues</button>
                    <button id="toContacts" class="action-btn">👥 2. Contact</button>
                    <button id="toProjects" class="action-btn">📋 3. Projects</button>
                    <button id="toGallery" class="action-btn">🖼️ 4. Images</button>
                    <button id="backDash" class="action-btn back-btn">⬅️ Back</button>
                </div>

                ${footerTag}
            </div>
        </div>
    `;

    setupControlsEvents(facility);

    requestAnimationFrame(() => {
        const addressLink = document.getElementById('facilityAddressLink');

        if (addressLink) {
            addressLink.onclick = (e) => {
                e.preventDefault();
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address || '')}`;
                window.open(url, '_blank');
            };
        }

        const backDashBtn = document.getElementById('backDash');
        if (backDashBtn) {
            backDashBtn.onclick = () => {
                if (window.navigateTo) window.navigateTo('view_1_facility');
            };
        }
    });

    const openMgmtBtn = document.getElementById('openMgmtBtn');
    const mgmtOverlay = document.getElementById('mgmtOverlay');

    if (openMgmtBtn) {
        openMgmtBtn.onclick = () => {
            if (mgmtOverlay) mgmtOverlay.style.display = 'block';
        };
    }

    const toIssues = document.getElementById('toIndividualIssues');
    if (toIssues) toIssues.onclick = () => window.navigateTo('view_5_issues', { facility });

    const toContacts = document.getElementById('toContacts');
    if (toContacts) toContacts.onclick = () => window.navigateTo('view_3_contacts', { facility });

    const toProjects = document.getElementById('toProjects');
    if (toProjects) toProjects.onclick = () => window.navigateTo('view_4_projects', { facility });

    const toGallery = document.getElementById('toGallery');
    if (toGallery) toGallery.onclick = () => window.navigateTo('view_6_images', { facility });
}

/*================================================================
END FILE: view_2_grid.js
================================================================*/
