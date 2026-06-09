/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_render_helpers.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : View 4 Shared Render Helpers
POP-UP TITLE : Shared Render Helpers
LAST UPDATED : 2026-06-09 @ 01:45 AM
================================================================*/
const __FILENAME = 'view_4_render_helpers.js';

import {
    getProjectTitle,
    getVendorName
} from '../view_4_data.js';

export function renderProjectButtons(projects) {
    if (!projects || projects.length === 0) {
        return '<div class="cabinet-empty">No facility projects found yet.</div>';
    }

    return projects.map(project => `
        <button class="project-button" data-open-project="${escapeAttr(project.id)}">
            <span class="project-button-title">${escapeHtml(getProjectTitle(project))}</span>
            ${project.notes ? `<span class="project-button-sub">${escapeHtml(project.notes)}</span>` : ''}
        </button>
    `).join('');
}

export function renderProjectActions(actions) {
    if (!actions || actions.length === 0) {
        return '<div class="cabinet-empty">No project actions found yet.</div>';
    }

    return actions.map(action => `
        <div class="project-action-row">
            <div class="project-action-title">${escapeHtml(action.action_title_text || action.action_type || 'Project Action')}</div>
            <div class="project-action-note">${escapeHtml(action.notes || '')}</div>
            <div class="project-action-meta">
                ${escapeHtml(action.action_type || 'note')} · ${formatDate(action.created_at)}
            </div>
        </div>
    `).join('');
}

export function renderProjectActionModal() {
    return `
        <div id="projectActionModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>Add Project Action</h3>

                <label>Action Type</label>
                <select id="projectActionTypeInput" class="cabinet-input">
                    <option value="note">Note</option>
                    <option value="task">Task</option>
                    <option value="vendor">Vendor</option>
                    <option value="status_update">Status Update</option>
                    <option value="photo">Photo / Image</option>
                    <option value="cost">Cost</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="completed">Completed</option>
                </select>

                <label>Action Title</label>
                <input id="projectActionTitleInput" class="cabinet-input" placeholder="Example: Called AC vendor">

                <label>Notes</label>
                <textarea id="projectActionNotesInput" class="cabinet-input cabinet-textarea" placeholder="What happened?"></textarea>

                <div id="projectActionModalNotice" class="custom-modal-notice" style="display:none;"></div>

                <button id="saveProjectActionBtn" class="cabinet-btn cabinet-btn-green">Save Action</button>
                <button id="closeProjectActionModalBtn" class="cabinet-btn cabinet-btn-gray">Cancel</button>
            </div>
        </div>
    `;
}

export function renderJobRows(jobs) {
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

export function renderFileCards(files) {
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

export function renderFollowupRows(followups, files) {
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

export function renderHomeModals(projects, vendors) {
    return `
        <div id="cabinetProjectModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>Create New Project</h3>
                <label>Project Name</label>
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

export function renderVendorDashboardModals(projects, vendor) {
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

export function renderStartVendorJobModal(projects, vendors, prefix) {
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

export function renderVendorJobModals(followups) {
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

export function formatDate(value) {
    if (!value) return '';
    try {
        return new Date(value).toLocaleString();
    } catch {
        return String(value);
    }
}

export function normalizeWebsiteUrl(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    if (text.startsWith('http://') || text.startsWith('https://')) return text;
    return `https://${text}`;
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export function escapeAttr(value) {
    return escapeHtml(value).replaceAll('\n', ' ');
}

/*================================================================
END FILE: view_4_render_helpers.js
UPDATED: 2026-06-09 @ 01:45 AM
================================================================*/
