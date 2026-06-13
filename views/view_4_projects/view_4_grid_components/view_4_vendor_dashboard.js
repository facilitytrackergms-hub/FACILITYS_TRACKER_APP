/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_vendor_dashboard.js
File path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid_components/view_4_vendor_dashboard.js
SUPABASE TBL : facility_projects, vendors, vendor_files, project_vendor_jobs
VIEW NAME    : Single Vendor Dashboard View
POP-UP TITLE : Vendor Operations Panel
LAST UPDATED : 2026-06-12 @ 11:45 PM
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
   in this section. Never alter any system comments or structural 
   markers.

4. MINIMALIST EXPLANATION RULE: Limit explanations to a maximum of one 
   or two concise sentences. No fluff.

5. STRICT MODIFICATION RULE: Do not attempt to improve, refactor, or 
   optimize any code unless explicitly requested. Execute ONLY the 
   specific updates or bug fixes requested, and leave all other parts 
   of the file completely intact. All untouched business logic, UI, 
   event handlers, variables, functions, and style contexts must be 
   preserved exactly as they are. Always output the entire file with all 
   historical contexts preserved.
================================================================*/

const __FILENAME = 'view_4_vendor_dashboard.js';

import {
    fetchFacilityProjects,
    fetchVendors,
    fetchVendorFiles,
    fetchVendorJobsForVendorInFacility,
    getVendorName
} from '../view_4_data.js';

import {
    setupVendorDashboardEvents
} from '../view_4_modal.js';

// =================== UPDATED IMPORT ===================
import {
    escapeHtml,
    escapeAttr,
    normalizeWebsiteUrl,
    renderJobRows,
    renderFileCards,
    renderVendorDashboardModals
} from './view_4_render_helpers.js';
// ======================================================

import {
    renderStyles
} from './view_4_styles.js';

export async function renderSingleVendorDashboard({ facility, vendorId }, nav) {
    const app = document.getElementById('app');
    const vendors = await fetchVendors();
    const vendor = vendors.find(v => String(v.id) === String(vendorId));

    if (!vendor) {
        app.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_vendor_dashboard.js] Vendor not found.</p>';
        return;
    }

    const [projects, vendorFiles, vendorJobs] = await Promise.all([
        fetchFacilityProjects(facility.id),
        fetchVendorFiles(vendor.id),
        fetchVendorJobsForVendorInFacility(vendor.id, facility.id)
    ]);

    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">${escapeHtml(getVendorName(vendor))}</h1>
                <p class="vendor-cabinet-sub">Vendor Dashboard · ${escapeHtml(facility.name || facility.Name || 'Facility')}</p>

                ${vendor.main_image_url ? `
                    <img class="vendor-main-image" src="${escapeAttr(vendor.main_image_url)}" alt="Vendor image">
                ` : ''}

                <div class="vendor-info-box">
                    <div><strong>Contact:</strong> ${escapeHtml(vendor.contact_name || '')}</div>
                    <div><strong>Phone:</strong> ${vendor.phone ? `<a href="tel:${escapeAttr(vendor.phone)}">${escapeHtml(vendor.phone)}</a>` : ''}</div>
                    <div><strong>Email:</strong> ${vendor.email ? `<a href="mailto:${escapeAttr(vendor.email)}">${escapeHtml(vendor.email)}</a>` : ''}</div>
                    <div><strong>Website:</strong> ${vendor.website_url ? `<a href="${escapeAttr(normalizeWebsiteUrl(vendor.website_url))}" target="_blank" rel="noopener">${escapeHtml(vendor.website_url)}</a>` : ''}</div>
                    <div><strong>Notes:</strong> ${escapeHtml(vendor.notes || '')}</div>
                </div>

                <div class="cabinet-action-grid">
                    <button id="vendorAddProfileFileBtn" class="cabinet-btn cabinet-btn-green">📷 Add Vendor File</button>
                    <button id="vendorStartJobBtn" class="cabinet-btn">🗂️ Start Job</button>
                    <button id="vendorBackHomeBtn" class="cabinet-btn cabinet-btn-gray">⬅️ Back to Projects</button>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Open Jobs With This Vendor</h2>
                    <div class="cabinet-stack">
                        ${renderJobRows(vendorJobs)}
                    </div>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Vendor Profile Files</h2>
                    <div class="cabinet-card-grid">
                        ${renderFileCards(vendorFiles)}
                    </div>
                </div>

                ${renderVendorDashboardModals(projects, vendor)}

                <div id="uiTag_view_4_vendor_dashboard" class="ui-metadata-tag-view4">
                    Source: view_4_vendor_dashboard.js | Vendor Dashboard | Updated: 2026-06-12 @ 11:45 PM
                </div>
            </div>
        </div>
    `;

    setupVendorDashboardEvents({
        facility,
        vendor,
        projects,
        refreshVendor: () => renderSingleVendorDashboard({ facility, vendorId: vendor.id }, nav),
        backHome: () => nav.renderPendingProjects({ facility }),
        openVendorJob: vendorJobId => nav.renderVendorJobDashboard({ facility, vendorJobId })
    });
}

/*================================================================
END FILE: view_4_vendor_dashboard.js
================================================================*/
