/* =================================================
FILE: views/view_2_controls/view_2_grid.js
UPDATED: 2026-06-02 09:20:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchFacilityIssues } from './view_2_data.js';
import { setupControlsEvents } from './view_2_modal.js';

export async function renderFacilityControls(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    // Default Fallback Image if none exists yet in your database profile rows
    const imageContent = facility?.image_url 
        ? `<img src="${facility.image_url}" style="width:100%; height:100%; object-fit:cover;" />` 
        : `<span style="font-size:11px; color:#64748b; font-weight:bold; text-align:center; padding:5px;">📷 Click to Add Photo</span>`;

    // Cleaned up syntax for phone numbers and click-to-dial mobile links
    const addressDisplay = facility?.address || 'No Address Listed';
    
    let phoneLink = `<span style="color:#94a3b8; font-style:italic;">No Phone Listed</span>`;
    if (facility?.phone) {
        const cleanPhone = String(facility.phone).replace(/[^0-9+]/g, '');
        phoneLink = `<a href="tel:${cleanPhone}" style="color:#00264d; text-decoration:none; font-weight:bold; border-bottom:1px dashed #00264d;">📞 ${facility.phone}</a>`;
    }

    const styles = `
        <style>
            .controls-container { padding: 20px; font-family: Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing: border-box; }
            .controls-card { background: white; border-radius: 18px; padding: 25px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
            .controls-title { color:#00264d; font-size:24px; margin:0 0 6px 0; line-height:1.1; text-transform:uppercase; font-weight: 900; }
            
            .image-box { width:180px; height:120px; border-radius:14px; overflow:hidden; background:#f8fafc; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; margin:0 auto 15px auto; cursor:pointer; transition: all 0.2s ease; }
            .image-box:hover { border-color: #00264d; background: #f1f5f9; transform: scale(1.02); }
            
            .info-panel { background:#f8fafc; border-radius:12px; padding:12px 15px; margin: 15px auto; width:90%; border:1px solid #e2e8f0; text-align:left; box-sizing: border-box; }
            .info-row { font-size:13px; color:#475569; margin-bottom:6px; line-height:1.4; }
            .info-row:last-child { margin-bottom: 0; }
            .info-label { font-weight:bold; color:#00264d; text-transform:uppercase; font-size:11px; display:block; margin-bottom:2px; }
            
            .divider-line { width:100%; max-width:320px; height:5px; background:#00264d; margin:20px auto; border-radius:2px; }
            .menu-layout { display:flex; flex-direction:column; gap:12px; max-width:320px; margin:0 auto; }
            .action-btn { position:relative; width:100%; padding:14px; background:#00264d; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:13px; text-align:center; box-sizing: border-box; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .badge-counter { position:absolute; top:-6px; right:-6px; background:#dc2626; color:white; font-size:11px; padding:3px 8px; border-radius:9999px; font-weight:bold; border:2px solid white; display:none; }
            .back-btn { margin-top:15px; background:#6b7280; }
            .footer-tag { margin-top:40px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="controls-container">
            <div class="controls-card">
                <div>
                    <h1 class="controls-title">${facility?.name || 'FACILITY'}</h1>
                    
                    <div class="image-box" id="facilityHeaderImageBox" title="Click to upload profile cover picture">
                        ${imageContent}
                    </div>
                    
                    <input type="file" id="facilityPhotoFileInput" accept="image/*" style="display:none;" />

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
                        🚨 Standard Issues Tracker
                        <span id="issuesTrackBadge" class="badge-counter">0</span>
                    </button>

                    <button id="toContacts" class="action-btn">👥 Facility Contact Directory</button>
                    <button id="toProjects" class="action-btn">📋 Capital Projects Tracker</button>
                    <button id="toGallery" class="action-btn">🖼️ Shared Image Gallery</button>
                    
                    <button id="backDash" class="action-btn back-btn">⬅️ Back to Dashboard</button>
                </div>
            </div>

            <div class="footer-tag">
                File: views/view_2_controls/view_2_grid.js | Updated: 2026-06-02 09:20:00 PM
            </div>
        </div>
    `;

    // Hook standard routing actions
    setupControlsEvents(facility);

    // Context Hook: Handle the local profile photo picker interaction rules
    const imageBox = document.getElementById('facilityHeaderImageBox');
    const fileInput = document.getElementById('facilityPhotoFileInput');
    
    if (imageBox && fileInput) {
        imageBox.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', async (e) => {
            const chosenFile = e.target.files[0];
            if (!chosenFile) return;
            
            console.log(`Uploading picture attachment for ${facility?.name || 'Facility'}:`, chosenFile.name);
            alert(`Selected file: "${chosenFile.name}". In our next step, we'll hook up the save functionality to persist this picture to the database profile!`);
        });
    }

    // Load active dashboard counter badges using the lowercase table layout logic
    async function loadBadges() {
        if (!facility?.id) return;
        const issues = await fetchFacilityIssues(facility.id);
        const openIssues = issues.filter(i => i.status && i.status.toLowerCase() !== 'closed');
        const badgeElement = document.getElementById('issuesTrackBadge');
        if (badgeElement) {
            badgeElement.style.display = openIssues.length > 0 ? 'inline-block' : 'none';
            badgeElement.textContent = openIssues.length;
        }
    }
    await loadBadges();
}
