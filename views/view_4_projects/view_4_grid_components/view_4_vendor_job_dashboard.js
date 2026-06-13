/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_vendor_job_dashboard.js
File path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid_components/view_4_vendor_job_dashboard.js
SUPABASE TBL : facility_projects, vendors, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Single Vendor Job View Dashboard
POP-UP TITLE : Vendor Timeline Tracker
LAST UPDATED : 2026-06-12 @ 11:25 PM
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

const __FILENAME = 'view_4_vendor_job_dashboard.js';

import {
    fetchFacilityProjects,
    fetchVendorJobById,
    fetchVendorJobFiles,
    fetchVendorJobFollowups,
    getProjectTitle,
    getVendorName
} from '../view_4_data.js';

// Fixed: Changed invalid import reference path to load from components subfolder location
import {
    escapeHtml,
    escapeAttr,
    renderFollowupRows,
    renderFileCards,
    renderVendorJobModals
} from './view_4_render_helpers.js';

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
                    Source: view_4_vendor_job_dashboard.js | Vendor Job Dashboard | Updated: 2026-06-12 @ 11:25 PM
                </div>
            </div>
        </div>
    `;

    // Fixed: Defensive validation to safely isolate unmounted layout triggers
    const triggerBtn = document.getElementById('jobBackVendorBtn');
    if (triggerBtn) {
        triggerBtn.onclick = () => {
            if (nav && nav.renderVendorDashboard) {
                nav.renderVendorDashboard({ facility, vendorId: job.vendor_id });
            }
        };
    }
    
    const followupBtn = document.getElementById('jobAddFollowupBtn');
    if (followupBtn) {
        followupBtn.onclick = () => alert('Action tracking setup interface initializing under view layout updates.');
    }

    const fileBtn = document.getElementById('jobAddFileBtn');
    if (fileBtn) {
        fileBtn.onclick = () => alert('Storage attachment interface initializing.');
    }

    const emailBtn = document.getElementById('jobEmailCorporateBtn');
    if (emailBtn) {
        emailBtn.onclick = () => alert('Corporate report email generation pipelines dispatching.');
    }
}

/*================================================================
END FILE: view_4_vendor_job_dashboard.js
================================================================*/
