/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_grid.js
SUPABASE TBL : facility_projects, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Vendor Project Filing Cabinet
POP-UP TITLE : Vendor Project Entry
LAST UPDATED : 2026-06-08 @ 11:25 PM
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
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_4_grid.js';

import {
    fetchFacilityProjects,
    fetchVendors,
    fetchVendorFiles,
    fetchVendorJobsForFacility,
    fetchVendorJobsForVendorInFacility,
    fetchVendorJobById,
    fetchVendorJobFiles,
    fetchVendorJobFollowups,
    getProjectTitle,
    getVendorName
} from './view_4_data.js';

import {
    setupCabinetHomeEvents,
    setupVendorDashboardEvents,
    setupVendorJobDashboardEvents
} from './view_4_modal.js';

export async function renderPendingProjects(data) {
    const facility = data?.facility ? data.facility : data;

    if (!facility || !facility.id) {
        console.error('[view_4_grid.js] Facility context missing inside vendor project filing cabinet.');
        const appMissing = document.getElementById('app');
        if (appMissing) {
            appMissing.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_grid.js] Missing facility context.</p>';
        }
        return;
    }

    const app = document.getElementById('app');
    const facilityName = escapeHtml(facility.name || facility.Name || 'Facility');

    const [projects, vendors, jobs] = await Promise.all([
        fetchFacilityProjects(facility.id),
        fetchVendors(),
        fetchVendorJobsForFacility(facility.id)
    ]);

    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">Vendor Project Filing Cabinet</h1>
                <p class="vendor-cabinet-sub">Facility: ${facilityName}</p>

                <div class="cabinet-action-grid">
                    <button id="cabinetAddProjectBtn" class="cabinet-btn cabinet-btn-green">➕ Add Project</button>
                    <button id="cabinetAddVendorBtn" class="cabinet-btn">➕ Add Vendor</button>
                    <button id="cabinetStartVendorJobBtn" class="cabinet-btn">🗂️ Start Vendor Job</button>
                    <button id="cabinetBackBtn" class="cabinet-btn cabinet-btn-gray">⬅️ Back</button>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Vendors</h2>
                    <div id="cabinetVendorList" class="cabinet-card-grid">
                        ${renderVendorCards(vendors, jobs)}
                    </div>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Open Vendor Jobs</h2>
                    <div id="cabinetJobList" class="cabinet-stack">
                        ${renderJobRows(jobs)}
                    </div>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Facility Projects</h2>
                    <div class="cabinet-stack">
                        ${renderProjectRows(projects)}
                    </div>
                </div>

                ${renderHomeModals(projects, vendors)}

                <div id="uiTag_view_4_grid" class="ui-metadata-tag-view4">
                    Source: view_4_grid.js | Updated: 2026-06-08 11:25 PM
                </div>
            </div>
        </div>
    `;

    setupCabinetHomeEvents({
        facility,
        projects,
        vendors,
        refreshHome: () => renderPendingProjects({ facility }),
        openVendor: vendorId => renderVendorDashboard({ facility, vendorId }),
        openVendorJob: vendorJobId => renderVendorJobDashboard({ facility, vendorJobId })
    });
}

export async function renderVendorDashboard({ facility, vendorId }) {
    const app = document.getElementById('app');
    const vendors = await fetchVendors();
    const vendor = vendors.find(v => String(v.id) === String(vendorId));

    if (!vendor) {
        app.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_grid.js] Vendor not found.</p>';
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

                <div id="uiTag_view_4_grid" class="ui-metadata-tag-view4">
                    Source: view_4_grid.js | Vendor Dashboard | Updated: 2026-06-08 11:25 PM
                </div>
            </div>
        </div>
    `;

    setupVendorDashboardEvents({
        facility,
        vendor,
        projects,
        refreshVendor: () => renderVendorDashboard({ facility, vendorId: vendor.id }),
        backHome: () => renderPendingProjects({ facility }),
        openVendorJob: vendorJobId => renderVendorJobDashboard({ facility, vendorJobId })
    });
}

export async function renderVendorJobDashboard({ facility, vendorJobId }) {
    const app = document.getElementById('app');
    const [job, projects, files, followups] = await Promise.all([
        fetchVendorJobById(vendorJobId),
        fetchFacilityProjects(facility.id),
        fetchVendorJobFiles(vendorJobId),
        fetchVendorJobFollowups(vendorJobId)
    ]);

    if (!job) {
        app.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_grid.js] Vendor job not found.</p>';
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

                <div id="uiTag_view_4_grid" class="ui-metadata-tag-view4">
                    Source: view_4_grid.js | Vendor Job Dashboard | Updated: 2026-06-08 11:25 PM
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
        refreshJob: () => renderVendorJobDashboard({ facility, vendorJobId: job.id }),
        backVendor: () => renderVendorDashboard({ facility, vendorId: job.vendor_id })
    });
}

function renderVendorCards(vendors, jobs) {
    if (!vendors || vendors.length === 0) {
        return '<div class="cabinet-empty">No vendors yet. Add the first vendor.</div>';
    }

    return vendors.map(vendor => {
        const count = jobs.filter(job => String(job.vendor_id) === String(vendor.id)).length;
        const websiteLine = vendor.website_url ? `<span class="vendor-card-website">${escapeHtml(vendor.website_url)}</span>` : '';

        return `
            <button class="vendor-card-btn" data-open-vendor="${escapeAttr(vendor.id)}">
                ${vendor.main_image_url ? `
                    <img class="vendor-card-image" src="${escapeAttr(vendor.main_image_url)}" alt="Vendor image">
                ` : `
                    <span class="vendor-card-placeholder">🏢</span>
                `}
                <span class="vendor-card-title">${escapeHtml(getVendorName(vendor))}</span>
                ${websiteLine}
                <span class="vendor-card-sub">${count} open job${count === 1 ? '' : 's'}</span>
            </button>
        `;
    }).join('');
}

function renderJobRows(jobs) {
    if (!jobs || jobs.length === 0) {
        return '<div class="cabinet-empty">No vendor jobs found yet.</div>';
    }

    return jobs.map(job => `
        <button class="job-row-btn" data-open-vendor-job="${escapeAttr(job.id)}">
            <span class="job-row-title">${escapeHtml(job.job_title || 'Untitled Vendor Job')}</span>
            <span class="job-row-sub">
                ${escapeHtml(getVendorName(job.vendors))} · 
                ${escapeHtml(getProjectTitle(job.facility_project))} · 
                ${escapeHtml(job.job_status || 'open')}
            </span>
        </button>
    `).join('');
}

function renderProjectRows(projects) {
    if (!projects || projects.length === 0) {
        return '<div class="cabinet-empty">No facility projects found yet.</div>';
    }

    return projects.map(project => `
        <div class="project-row">
            <strong>${escapeHtml(getProjectTitle(project))}</strong>
            <span>${escapeHtml(project.status || project.active_status || '')}</span>
        </div>
    `).join('');
}

function renderFileCards(files) {
    if (!files || files.length === 0) {
        return '<div class="cabinet-empty">No files attached yet.</div>';
    }

    return files.map(file => {
        const isImage = String(file.file_type || '').includes('image') || /\.(png|jpg|jpeg|webp|gif)$/i.test(file.file_url || '');
        return `
            <a class="file-card" href="${escapeAttr(file.file_url)}" target="_blank" rel="noopener">
                ${isImage ? `<img src="${escapeAttr(file.file_url)}" alt="Attached file">` : `<div class="file-icon">📎</div>`}
                <span>${escapeHtml(file.file_label || file.file_name || file.file_type || 'Attachment')}</span>
                <small>${escapeHtml(file.notes || '')}</small>
            </a>
        `;
    }).join('');
}

function renderFollowupRows(followups, files) {
    if (!followups || followups.length === 0) {
        return '<div class="cabinet-empty">No follow-ups yet.</div>';
    }

    return followups.map(followup => {
        const attachedCount = files.filter(file => String(file.followup_id || '') === String(followup.id)).length;
        return `
            <div class="followup-row">
                <div class="followup-title">${escapeHtml(followup.followup_type || 'note')}</div>
                <div class="followup-note">${escapeHtml(followup.followup_note || '')}</div>
                <div class="followup-meta">
                    ${formatDate(followup.followup_date)} · ${escapeHtml(followup.followup_by || '')}
                    ${attachedCount ? ` · ${attachedCount} file${attachedCount === 1 ? '' : 's'}` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderHomeModals(projects, vendors) {
    return `
        <div id="cabinetProjectModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>Add Facility Project</h3>
                <label>Project Title</label>
                <input id="newProjectTitleInput" class="cabinet-input" placeholder="Example: Kitchen AC">
                <label>Notes</label>
                <textarea id="newProjectNotesInput" class="cabinet-input cabinet-textarea" placeholder="Short project notes"></textarea>
                <button id="saveProjectBtn" class="cabinet-btn cabinet-btn-green">Save Project</button>
                <button id="closeProjectModalBtn" class="cabinet-btn cabinet-btn-gray">Cancel</button>
            </div>
        </div>

        <div id="cabinetVendorModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>Add Vendor</h3>
                <label>Company Name</label>
                <input id="newVendorCompanyInput" class="cabinet-input" placeholder="Example: Tomorrow AC">
                <label>Contact Name</label>
                <input id="newVendorContactInput" class="cabinet-input">
                <label>Phone</label>
                <input id="newVendorPhoneInput" class="cabinet-input">
                <label>Email</label>
                <input id="newVendorEmailInput" class="cabinet-input">
                <label>Website</label>
                <input id="newVendorWebsiteInput" class="cabinet-input" placeholder="https://example.com">
                <label>Main Vendor Image</label>
                <input id="newVendorImageInput" class="cabinet-input" type="file" accept="image/*" capture="environment">
                <label>Notes</label>
                <textarea id="newVendorNotesInput" class="cabinet-input cabinet-textarea"></textarea>
                <button id="saveVendorBtn" class="cabinet-btn cabinet-btn-green">Save Vendor</button>
                <button id="closeVendorModalBtn" class="cabinet-btn cabinet-btn-gray">Cancel</button>
            </div>
        </div>

        ${renderStartVendorJobModal(projects, vendors, 'cabinet')}
    `;
}

function renderVendorDashboardModals(projects, vendor) {
    return `
        <div id="vendorProfileFileModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>Add Vendor Profile File</h3>
                <label>File Label</label>
                <input id="vendorFileLabelInput" class="cabinet-input" placeholder="Business card, van photo, website screenshot">
                <label>Take Photo / Upload File</label>
                <input id="vendorFileInput" class="cabinet-input" type="file" accept="image/*,application/pdf" capture="environment">
                <label>Or Paste File URL</label>
                <input id="vendorFileUrlInput" class="cabinet-input" placeholder="https://...">
                <label>Notes</label>
                <textarea id="vendorFileNotesInput" class="cabinet-input cabinet-textarea"></textarea>
                <button id="saveVendorFileBtn" class="cabinet-btn cabinet-btn-green">Save Vendor File</button>
                <button id="closeVendorFileModalBtn" class="cabinet-btn cabinet-btn-gray">Cancel</button>
            </div>
        </div>

        ${renderStartVendorJobModal(projects, [vendor], 'vendor')}
    `;
}

function renderStartVendorJobModal(projects, vendors, prefix) {
    return `
        <div id="${prefix}StartJobModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>Start Vendor Job</h3>
                <label>Facility Project</label>
                <select id="${prefix}JobProjectSelect" class="cabinet-input">
                    <option value="">Select project</option>
                    ${(projects || []).map(project => `<option value="${escapeAttr(project.id)}">${escapeHtml(getProjectTitle(project))}</option>`).join('')}
                </select>
                <label>Vendor</label>
                <select id="${prefix}JobVendorSelect" class="cabinet-input">
                    <option value="">Select vendor</option>
                    ${(vendors || []).map(vendor => `<option value="${escapeAttr(vendor.id)}">${escapeHtml(getVendorName(vendor))}</option>`).join('')}
                </select>
                <label>Job Title</label>
                <input id="${prefix}JobTitleInput" class="cabinet-input" placeholder="Example: Kitchen AC">
                <label>Estimated Amount</label>
                <input id="${prefix}JobAmountInput" class="cabinet-input" placeholder="Example: 1250">
                <label>Status</label>
                <select id="${prefix}JobStatusInput" class="cabinet-input">
                    <option value="open">Open</option>
                    <option value="waiting_quote">Waiting Quote</option>
                    <option value="quote_received">Quote Received</option>
                    <option value="approved">Approved</option>
                    <option value="waiting_parts">Waiting Parts</option>
                    <option value="work_scheduled">Work Scheduled</option>
                    <option value="work_completed">Work Completed</option>
                    <option value="complaint_open">Complaint Open</option>
                    <option value="closed">Closed</option>
                </select>
                <label>Main Picture</label>
                <input id="${prefix}JobImageInput" class="cabinet-input" type="file" accept="image/*" capture="environment">
                <label>Scope / Notes</label>
                <textarea id="${prefix}JobNotesInput" class="cabinet-input cabinet-textarea"></textarea>
                <button id="${prefix}SaveJobBtn" class="cabinet-btn cabinet-btn-green">Create Vendor Job</button>
                <button id="${prefix}CloseJobModalBtn" class="cabinet-btn cabinet-btn-gray">Cancel</button>
            </div>
        </div>
    `;
}

function renderVendorJobModals(followups) {
    return `
        <div id="jobFollowupModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>Add Follow-up</h3>
                <label>Type</label>
                <select id="jobFollowupTypeInput" class="cabinet-input">
                    <option value="note">Note</option>
                    <option value="quote_received">Quote Received</option>
                    <option value="invoice_received">Invoice Received</option>
                    <option value="approval">Approval</option>
                    <option value="complaint">Complaint</option>
                    <option value="inspection">Inspection</option>
                    <option value="email_sent">Email Sent</option>
                    <option value="call_log">Call Log</option>
                    <option value="waiting_parts">Waiting Parts</option>
                    <option value="work_completed">Work Completed</option>
                    <option value="closed">Closed</option>
                </select>
                <label>Note</label>
                <textarea id="jobFollowupNoteInput" class="cabinet-input cabinet-textarea" placeholder="What happened?"></textarea>
                <label>Follow-up By</label>
                <input id="jobFollowupByInput" class="cabinet-input" placeholder="Your name">
                <label>Next Follow-up Date</label>
                <input id="jobNextFollowupDateInput" class="cabinet-input" type="date">
                <button id="saveJobFollowupBtn" class="cabinet-btn cabinet-btn-green">Save Follow-up</button>
                <button id="closeJobFollowupModalBtn" class="cabinet-btn cabinet-btn-gray">Cancel</button>
            </div>
        </div>

        <div id="jobFileModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>Add Job File / Photo</h3>
                <label>Attach To Follow-up</label>
                <select id="jobFileFollowupSelect" class="cabinet-input">
                    <option value="">General job file</option>
                    ${(followups || []).map(f => `<option value="${escapeAttr(f.id)}">${escapeHtml(f.followup_type || 'note')} - ${escapeHtml((f.followup_note || '').slice(0, 40))}</option>`).join('')}
                </select>
                <label>File Type</label>
                <select id="jobFileTypeInput" class="cabinet-input">
                    <option value="image">Image / Photo</option>
                    <option value="quote">Quote</option>
                    <option value="invoice">Invoice</option>
                    <option value="approval">Approval</option>
                    <option value="complaint_photo">Complaint Photo</option>
                    <option value="email_screenshot">Email Screenshot</option>
                    <option value="file">Other File</option>
                </select>
                <label>Take Photo / Upload File</label>
                <input id="jobFileInput" class="cabinet-input" type="file" accept="image/*,application/pdf" capture="environment">
                <label>Or Paste File URL</label>
                <input id="jobFileUrlInput" class="cabinet-input" placeholder="https://...">
                <label>Notes</label>
                <textarea id="jobFileNotesInput" class="cabinet-input cabinet-textarea"></textarea>
                <button id="saveJobFileBtn" class="cabinet-btn cabinet-btn-green">Save File</button>
                <button id="closeJobFileModalBtn" class="cabinet-btn cabinet-btn-gray">Cancel</button>
            </div>
        </div>
    `;
}

function renderStyles() {
    return `
        <style>
            .vendor-cabinet-shell { padding:18px; background:#f3f4f6; min-height:100vh; box-sizing:border-box; font-family:Arial, sans-serif; }
            .vendor-cabinet-card { max-width:850px; margin:0 auto; background:white; border-radius:14px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
            .vendor-cabinet-title { color:#00264d; font-size:22px; text-align:center; margin:0 0 5px 0; text-transform:uppercase; }
            .vendor-cabinet-sub { text-align:center; color:#4b5563; font-size:14px; margin:0 0 15px 0; }
            .cabinet-action-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:14px 0; }
            .cabinet-btn { border:none; background:#00264d; color:white; border-radius:8px; padding:13px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:13px; }
            .cabinet-btn-green { background:#28a745; }
            .cabinet-btn-gray { background:#6b7280; }
            .cabinet-section { margin-top:18px; }
            .cabinet-section-title { color:#00264d; font-size:15px; margin:0 0 8px 0; text-transform:uppercase; border-bottom:2px solid #00264d; padding-bottom:5px; }
            .cabinet-card-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:10px; }
            .cabinet-stack { display:flex; flex-direction:column; gap:8px; }
            .vendor-card-btn, .job-row-btn { text-align:left; border:1px solid #d1d5db; background:#ffffff; border-radius:10px; padding:13px; cursor:pointer; display:flex; flex-direction:column; gap:4px; }
            .vendor-card-btn:hover, .job-row-btn:hover { border-color:#00264d; }
            .vendor-card-title, .job-row-title { color:#00264d; font-weight:bold; font-size:14px; }
            .vendor-card-sub, .job-row-sub { color:#6b7280; font-size:12px; }
            .vendor-card-image { width:100%; height:95px; object-fit:cover; border-radius:8px; border:1px solid #d1d5db; margin-bottom:6px; }
            .vendor-card-placeholder { width:100%; height:95px; border-radius:8px; border:1px dashed #d1d5db; display:flex; align-items:center; justify-content:center; font-size:32px; background:#f9fafb; margin-bottom:6px; }
            .vendor-card-website { color:#2563eb; font-size:11px; word-break:break-word; }
            .vendor-main-image { width:100%; max-height:240px; object-fit:cover; border-radius:10px; border:1px solid #d1d5db; margin-bottom:12px; }
            .project-row { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:10px; display:flex; justify-content:space-between; gap:10px; font-size:13px; }
            .cabinet-empty { color:#6b7280; font-size:13px; text-align:center; padding:14px; border:1px dashed #d1d5db; border-radius:10px; background:#f9fafb; }
            .cabinet-modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:50; padding:20px; overflow:auto; align-items:flex-start; justify-content:center; }
            .cabinet-modal-body { background:white; width:100%; max-width:430px; border-radius:12px; padding:18px; box-sizing:border-box; margin-top:20px; box-shadow:0 4px 16px rgba(0,0,0,0.2); }
            .cabinet-modal-body h3 { color:#00264d; margin:0 0 12px 0; text-transform:uppercase; }
            .cabinet-modal-body label { display:block; font-size:12px; font-weight:bold; color:#374151; margin-top:10px; text-transform:uppercase; }
            .cabinet-input { width:100%; box-sizing:border-box; padding:10px; border:1px solid #d1d5db; border-radius:7px; margin-top:4px; font-size:14px; }
            .cabinet-textarea { min-height:70px; resize:vertical; }
            .vendor-info-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:12px; font-size:13px; color:#374151; line-height:1.6; }
            .file-card { border:1px solid #d1d5db; border-radius:10px; padding:10px; color:#00264d; text-decoration:none; display:flex; flex-direction:column; gap:6px; min-height:90px; justify-content:center; align-items:center; text-align:center; }
            .file-card img { max-width:100%; width:110px; height:90px; object-fit:cover; border-radius:8px; }
            .file-icon { font-size:30px; }
            .file-card small { color:#6b7280; }
            .job-main-image { width:100%; max-height:260px; object-fit:cover; border-radius:10px; border:1px solid #d1d5db; margin-bottom:12px; }
            .followup-row { border:1px solid #d1d5db; border-left:5px solid #00264d; border-radius:10px; padding:12px; background:#fff; }
            .followup-title { color:#00264d; font-weight:bold; text-transform:uppercase; font-size:12px; }
            .followup-note { color:#374151; margin-top:5px; font-size:14px; white-space:pre-wrap; }
            .followup-meta { color:#6b7280; margin-top:6px; font-size:12px; }
            .ui-metadata-tag-view4 { margin-top:20px; font-size:10px; color:#9ca3af; font-family:monospace; text-align:center; }
        </style>
    `;
}

function formatDate(value) {
    if (!value) return '';
    try {
        return new Date(value).toLocaleString();
    } catch {
        return String(value);
    }
}

function normalizeWebsiteUrl(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    if (text.startsWith('http://') || text.startsWith('https://')) return text;
    return `https://${text}`;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
    return escapeHtml(value).replaceAll('\n', ' ');
}

/*================================================================
END FILE: view_4_grid.js
UPDATED: 2026-06-08 @ 11:25 PM
================================================================*/
