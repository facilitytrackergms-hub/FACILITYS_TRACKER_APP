/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_vendor_job_dashboard.js
SUPABASE TBL : project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Vendor Job Dashboard
POP-UP TITLE : Add Follow-up / Add Job File
LAST UPDATED : 2026-06-09 @ 03:40 AM
================================================================*/
const __FILENAME = 'view_4_vendor_job_dashboard.js';

import {
    fetchFacilityProjects,
    fetchVendorJobById,
    fetchVendorJobFiles,
    fetchVendorJobFollowups,
    getProjectTitle,
    getVendorName
} from '../view_4_data.js';

import {
    setupVendorJobDashboardEvents
} from '../view_4_modal.js';

// =================== UPDATED IMPORT ===================
import {
    escapeHtml,
    escapeAttr,
    renderFollowupRows,
    renderFileCards,
    renderVendorJobModals
} from './view_4_render_helpers.js';
// ======================================================

import {
    renderStyles
} from './view_4_styles.js';

export async function renderSingleVendorJobDashboard({ facility, vendorJobId }, nav) {
    const app = document.getElementById('app');

    const [job, projects, files, followups] = await Promise.all([
        fetchVendorJobById(vendorJobId),
        fetchFacilityProjects(facility.id),
        fetchVendorJobFiles(vendorJobId),
        fetchVendorJobFollowups(vendorJobId)
    ]);

    if (!job) {
        app.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_vendor_job_dashboard.js] Vendor job not found.</p>';
        return;
    }

    const project = projects.find(p => String(p.id) === String(job.project_id)) || job.facility_project || {};
    const vendorName = escapeHtml(getVendorName(job.vendors));
    const projectTitle = escapeHtml(getProjectTitle(project));

    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">${escapeHtml(job.job_title || 'Vendor Job')}</h1>
                <p class="vendor-cabinet-sub">${vendorName} · ${projectTitle}</p>

                ${job.main_image_url ? `
                    <img class="job-main-image" src="${escapeAttr(job.main_image_url)}" alt="Job main image">
                ` : ''}

                <div class="vendor-info-box">
                    <div><strong>Status:</strong> ${escapeHtml(job.job_status || 'open')}</div>
                    <div><strong>Estimated Amount:</strong> ${job.estimated_amount ? `$${Number(job.estimated_amount).toLocaleString()}` : ''}</div>
                    <div><strong>Approval:</strong> ${escapeHtml(job.approval_status || 'pending')}</div>
                    <div><strong>Scope:</strong> ${escapeHtml(job.job_scope || '')}</div>
                    <div><strong>Notes:</strong> ${escapeHtml(job.notes || '')}</div>
                </div>

                <div class="cabinet-action-grid">
                    <button id="jobAddFollowupBtn" class="cabinet-btn cabinet-btn-green">➕ Add Follow-up</button>
                    <button id="jobAddFileBtn" class="cabinet-btn">📎 Add File / Photo</button>
                    <button id="jobEmailCorporateBtn" class="cabinet-btn">✉️ Email Corporate</button>
                    <button id="jobBackVendorBtn" class="cabinet-btn cabinet-btn-gray">⬅️ Back to Vendor</button>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Timeline / Follow-ups</h2>
                    <div class="cabinet-stack">
                        ${renderFollowupRows(followups, files)}
                    </div>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Job Files / Photos</h2>
                    <div class="cabinet-card-grid">
                        ${renderFileCards(files)}
                    </div>
                </div>

                ${renderVendorJobModals(followups)}

                <div id="uiTag_view_4_vendor_job_dashboard" class="ui-metadata-tag-view4">
                    Source: view_4_vendor_job_dashboard.js | Vendor Job Dashboard | Updated: 2026-06-09 03:40 AM
                </div>
            </div>
        </div>
    `;

    setupVendorJobDashboardEvents({
        facility,
        job,
        project,
        files,
        followups,
        refreshJob: () => renderSingleVendorJobDashboard({ facility, vendorJobId: job.id }, nav),
        backVendor: () => nav.renderVendorDashboard({ facility, vendorId: job.vendor_id })
    });
}

/*================================================================
END FILE: view_4_vendor_job_dashboard.js
UPDATED: 2026-06-09 @ 03:40 AM
================================================================*/
