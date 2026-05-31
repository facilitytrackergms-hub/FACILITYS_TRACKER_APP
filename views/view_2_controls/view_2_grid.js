/* =================================================
FILE: controls_v2_grid.js
UPDATED: 2026-05-30 12:50:00 PM
STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { getContacts, getProjects, getFacilityIssues, subscribeFacilityIssues } from './controls_v2_data.js';
import { supabase } from '../js/supabaseClient.js';
import { renderImageManagerSection } from '../js/imageManager.js';

export async function renderFacilityControls(facility) {
    const app = document.getElementById('app');
    if (!app) return;

    window.navigateTo = window.navigateTo || ((view, data) => console.log('Navigate to:', view, data));

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center;">
            <h1 style="color:#00264d; font-size:22px; margin-bottom:14px; text-transform:uppercase;">
                ${facility?.name || 'FACILITY'} CONTROLS
            </h1>

            <div id="facility-header-image" style="width:160px; height:110px; border-radius:14px; overflow:hidden; background:white; border:2px solid #e5e7eb; margin:0 auto; display:flex; align-items:center; justify-content:center;">
                <span style="font-size:10px; color:#94a3b8;">IMAGE</span>
            </div>

            <input type="text" id="contactSearch" placeholder="Search contacts..." style="width:90%; margin-top:10px; padding:8px; border-radius:5px;">
            <select id="contactIssueFilter" style="width:90%; margin:10px auto; padding:8px; border-radius:5px;">
                <option value="all">All Contacts</option>
                <option value="withOpen">With Open Issues</option>
                <option value="noOpen">No Open Issues</option>
            </select>

            <div style="display:flex; flex-direction:column; gap:15px; max-width:320px; margin:20px auto;">
                <button id="toIndividualIssues" style="padding:20px; background:#28a745; color:white; font-weight:bold; border:none; border-radius:12px; cursor:pointer; font-size:16px;">
                    👤 INDIVIDUAL CONCERNS
                    <span id="issuesBadge" style="background:red; color:white; font-size:12px; padding:2px 6px; border-radius:8px; margin-left:6px; display:none;"></span>
                </button>

                <button id="toContacts" style="padding:20px; background:#f5c400; font-weight:bold; border:none; border-radius:12px; cursor:pointer; font-size:16px;">
                    MANAGE CONTACTS
                </button>

                <button id="toProjects" style="padding:20px; background:#00264d; color:white; font-weight:bold; border:none; border-radius:12px; cursor:pointer; font-size:16px;">
                    🏗️ PENDING PROJECTS
                    <span id="projectBadge" style="background:red; color:white; font-size:12px; padding:2px 6px; border-radius:8px; margin-left:6px; display:none;"></span>
                </button>

                <button id="toGallery" style="padding:20px; background:#10b981; color:white; font-weight:bold; border:none; border-radius:12px; cursor:pointer; font-size:16px;">
                    IMAGE GALLERY
                </button>

                <button id="backDash" style="padding:12px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer; margin-top:10px;">
                    BACK TO DASHBOARD
                </button>
            </div>

            <div style="margin-top:50px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px;">
                File: controls_v2_grid.js | Updated: 2026-05-30 12:50:00 PM
            </div>
        </div>
    `;

    await loadFacilityHeaderImage(facility?.id);
    renderImageManagerSection('facility-header-image', facility?.id);
}

// Load header image
async function loadFacilityHeaderImage(facilityId) {
    if (!facilityId) return;

    try {
        const { data, error } = await supabase
            .from('facility_images')
            .select('id, related_table, related_id, image_url, caption, uploaded_by, created_at, updated_at')
            .eq('related_table', 'facilities')
            .eq('related_id', facilityId)
            .order('created_at', { ascending: true })
            .limit(1);

        const container = document.getElementById('facility-header-image');
        if (!container) return;

        if (error || !data || data.length === 0) {
            container.innerHTML = '<span style="font-size:10px; color:#94a3b8;">No Image</span>';
            return;
        }

        const imgUrl = data[0].image_url;
        container.innerHTML = `<img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:14px;">`;
    } catch (err) {
        console.error("Error loading facility header image:", err);
        const container = document.getElementById('facility-header-image');
        if (container) container.innerHTML = '<span style="font-size:10px; color:#dc2626;">Error loading image</span>';
    }
}
