/* =================================================
FILE: views/view_2_controls/view_2_grid.js
UPDATED: 2026-06-02 05:40:00 PM

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

    const styles = `
        <style>
            .controls-container { padding: 20px; font-family: Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing: border-box; }
            .controls-card { background: white; border-radius: 12px; padding: 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .controls-title { color:#00264d; font-size:22px; margin:0 0 12px 0; line-height:1.1; text-transform:uppercase; font-weight: 900; }
            .image-box { width:160px; height:110px; border-radius:14px; overflow:hidden; background:white; border:2px solid #e5e7eb; display:flex; align-items:center; justify-content:center; margin:0 auto; }
            .search-input { width:90%; margin-top:10px; padding:8px; border-radius:5px; border: 1px solid #ccc; box-sizing: border-box; }
            .filter-select { width:90%; margin:10px auto; padding:8px; border-radius:5px; border: 1px solid #ccc; box-sizing: border-box; }
            .divider-line { width:100%; max-width:320px; height:5px; background:#000; margin:0 auto 25px auto; border-radius:2px; }
            .menu-layout { display:flex; flex-direction:column; gap:12px; max-width:320px; margin:0 auto; }
            .action-btn { position:relative; width:100%; padding:14px; background:#00264d; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:13px; text-align:center; box-sizing: border-box; }
            .badge-counter { position:absolute; top:-6px; right:-6px; background:#dc2626; color:white; font-size:11px; padding:3px 8px; border-radius:9999px; font-weight:bold; border:2px solid white; display:none; }
            .back-btn { margin-top:20px; background:#6b7280; }
            .footer-tag { margin-top:40px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="controls-container">
            <div class="controls-card">
                <div style="margin-bottom:14px;">
                    <h1 class="controls-title">${facility?.name || 'FACILITY'} CONTROLS</h1>

                    <div class="image-box" id="facility-header-image">
                        <span style="font-size:10px; color:#94a3b8;">IMAGE</span>
                    </div>

                    <input type="text" id="contactSearch" class="search-input" placeholder="Search contacts...">
                    <select id="contactIssueFilter" class="filter-select">
                        <option value="all">All Contacts</option>
                        <option value="withOpen">With Open Issues</option>
                        <option value="noOpen">No Open Issues</option>
                    </select>
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
                File: views/view_2_controls/view_2_grid.js | Updated: 2026-06-02 05:40:00 PM
            </div>
        </div>
    `;

    setupControlsEvents(facility);

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
