/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_vendor_job_dashboard.js
SUPABASE TBL : project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Vendor Job Dashboard
POP-UP TITLE : Add Follow-up / Add Job File
LAST UPDATED : 2026-06-12 @ 10:11 PM
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
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response before 
   showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents 
     of an existing file unless the current code is fully pasted 
     into the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for 
     custom notifications. Always add a distinct, visible ID or tag 
     to the message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
     including this header and all rules, wrapped completely inside 
     a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
     (File Name, Table, View, Title, Date, Time) are fully updated 
     and preserved at the top of the file.
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
                    Source: view_4_vendor_job_dashboard.js | Vendor Job Dashboard | Updated: 2026-06-12 10:11 PM
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
================================================================*/
