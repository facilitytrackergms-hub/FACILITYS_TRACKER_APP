/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_vendor_dashboard.js
SUPABASE TBL : vendors, vendor_files, facility_projects, project_vendor_jobs
VIEW NAME    : Vendor Dashboard
POP-UP TITLE : Vendor Files / Start Vendor Job
LAST UPDATED : 2026-06-09 @ 03:35 AM
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
                    Source: view_4_vendor_dashboard.js | Vendor Dashboard | Updated: 2026-06-09 03:35 AM
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
UPDATED: 2026-06-09 @ 03:35 AM
================================================================*/
