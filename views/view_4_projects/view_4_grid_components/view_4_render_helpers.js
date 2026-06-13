/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_render_helpers.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : View 4 Shared Render Helpers
POP-UP TITLE : Shared Render Helpers
LAST UPDATED : 2026-06-12 @ 10:00 PM
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
const __FILENAME = 'view_4_render_helpers.js';

import { getProjectTitle, getVendorName } from '../view_4_data.js';

// ===================== GENERAL HELPERS =====================
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

export function normalizeWebsiteUrl(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    if (text.startsWith('http://') || text.startsWith('https://')) return text;
    return `https://${text}`;
}

export function formatDate(value) {
    if (!value) return '';
    try {
        return new Date(value).toLocaleString();
    } catch {
        return String(value);
    }
}

// ===================== HOME & PROJECT HELPERS =====================
export function renderProjectButtons(projects) {
    if (!projects || projects.length === 0) {
        return '<p class="cabinet-empty-text">No custom facility tracker projects mapped.</p>';
    }
    return projects.map(p => `
        <button class="project-btn text-left" data-open-project="${p.id}" style="width:100%; padding:14px; text-align:left; background:#ffffff; border:1px solid #ced4da; border-radius:6px; cursor:pointer; display:flex; flex-direction:column; gap:4px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <span style="font-weight:bold; color:#003366; font-size:15px;">📁 ${escapeHtml(getProjectTitle(p))}</span>
            <span style="font-size:12px; color:#666;">Status: <b style="color:#28a745;">${escapeHtml(p.status || 'Active')}</b></span>
        </button>
    `).join('');
}

export function renderHomeModals(projects, vendors) {
    return `
        <div id="cabinetProjectModal" class="cabinet-modal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
            <div class="cabinet-modal-body" style="background-color:#fefefe; margin:15% auto; padding:20px; border:1px solid #888; width:80%; max-width:500px; border-radius:8px;">
                <h3 style="margin-top:0; color:#003366;">Create New Facility Project</h3>
                <div id="cabinetProjectModalNotice" style="display:none; color:red; margin-bottom:10px; font-weight:bold;"></div>
                
                <label style="display:block; margin-bottom:5px; font-weight:bold;">Project Title</label>
                <input type="text" id="cabinetProjectTitleInput" class="cabinet-input" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px;" placeholder="Enter project title...">
                
                <label style="display:block; margin-bottom:5px; font-weight:bold;">Description Notes</label>
                <textarea id="cabinetProjectNotesInput" class="cabinet-textarea" style="width:100%; padding:8px; height:80px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px; resize:vertical;" placeholder="Enter general setup requirements..."></textarea>
                
                <div style="text-align:right; gap:10px; display:flex; justify-content:flex-end;">
                    <button id="cabinetCloseProjectModalBtn" class="cabinet-btn cabinet-btn-gray" type="button">Cancel</button>
                    <button id="cabinetSaveProjectBtn" class="cabinet-btn cabinet-btn-green" type="button">Create Project</button>
                </div>
            </div>
        </div>
    `;
}

export function renderProjectCards(projects) {
    if (!projects || projects.length === 0) {
        return '<p class="cabinet-empty-text">No active projects found for this facility context.</p>';
    }
    return projects.map(p => `
        <div class="project-card-item" data-project-id="${p.id}">
            <div class="project-card-header-title">${escapeHtml(getProjectTitle(p))}</div>
            <div class="project-card-status-badge ${String(p.status || '').toLowerCase()}">${escapeHtml(p.status || 'Pending')}</div>
            <div class="project-card-notes-line">${escapeHtml(p.notes || 'No description notes provided.')}</div>
        </div>
    `).join('');
}

export function renderProjectActionModal() {
    return `
        <div id="projectActionModal" class="cabinet-modal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
            <div class="cabinet-modal-body" style="background-color:#fefefe; margin:15% auto; padding:20px; border:1px solid #888; width:80%; max-width:500px; border-radius:8px;">
                <h3 style="margin-top:0; color:#003366;">Add Project Action Button</h3>
                <div id="projectActionModalNotice" style="display:none; color:red; margin-bottom:10px; font-weight:bold;"></div>
                
                <label style="display:block; margin-bottom:5px; font-weight:bold;">Action Title</label>
                <input type="text" id="projectActionTitleInput" class="cabinet-input" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px;" placeholder="e.g., Door measurements captured">
                
                <label style="display:block; margin-bottom:5px; font-weight:bold;">Action Type</label>
                <select id="projectActionTypeInput" class="cabinet-input" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px;">
                    <option value="note">Note Log</option>
                    <option value="milestone">Milestone Achieved</option>
                    <option value="alert">Alert / Issue Flag</option>
                </select>

                <label style="display:block; margin-bottom:5px; font-weight:bold;">Detailed Notes</label>
                <textarea id="projectActionNotesInput" class="cabinet-textarea" style="width:100%; padding:8px; height:80px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px; resize:vertical;" placeholder="Enter details..."></textarea>
                
                <div style="text-align:right; gap:10px; display:flex; justify-content:flex-end;">
                    <button id="closeProjectActionModalBtn" class="cabinet-btn cabinet-btn-gray">Cancel</button>
                    <button id="saveProjectActionBtn" class="cabinet-btn cabinet-btn-green">Save Action</button>
                </div>
            </div>
        </div>
    `;
}

export function renderProjectActions(actions) {
    if (!actions || actions.length === 0) {
        return '<p class="cabinet-empty-text">No action entries recorded for this project yet.</p>';
    }
    return actions.map(act => `
        <div class="action-log-card type-${escapeAttr(act.action_type || 'note')}">
            <div style="display:flex; justify-content:between; align-items:center; margin-bottom:4px;">
                <strong style="color:#003366; font-size:14px;">${escapeHtml(act.action_title_text || act.action_type)}</strong>
                <span style="font-size:11px; color:#777; margin-left:auto;">${formatDate(act.created_at)}</span>
            </div>
            <p style="margin:0; font-size:13px; color:#333; line-height:1.4;">${escapeHtml(act.notes || '')}</p>
        </div>
    `).join('');
}

// ===================== VENDOR CABINET HELPERS =====================
export function renderVendorQuotesFilesDashboard(project, vendors) {
    const projectTitle = getProjectTitle(project);
    return `
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">Vendor File Cabinet</h1>
                <p class="vendor-cabinet-sub">${escapeHtml(projectTitle)} · Storage Index</p>
                
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; gap:10px;">
                    <button id="backToProjectBtn" class="cabinet-btn cabinet-btn-gray" style="margin:0;">⬅️ Project Dashboard</button>
                    <button id="addVendorBtn" class="cabinet-btn cabinet-btn-green" style="margin:0;">➕ Add New Vendor</button>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Registered Active Vendors</h2>
                    <div style="display:grid; grid-template-columns:1fr; gap:10px;" id="vendorButtonListContainer">
                        ${(vendors && vendors.length > 0) ? vendors.map(v => `
                            <button class="vendor-btn text-left" data-vendor-id="${v.id}" style="width:100%; padding:12px; text-align:left; background:#f4f7f9; border:1px solid #ced4da; border-radius:6px; cursor:pointer; font-weight:bold; color:#003366;">
                                🏢 ${escapeHtml(getVendorName(v))} ${(v.phone_number ? `· 📞 ${escapeHtml(v.phone_number)}` : '')}
                            </button>
                        `).join('') : '<p class="cabinet-empty-text">No custom vendors registered. Click button above to insert.</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function renderVendorRows(vendors) {
    return (vendors || []).map(v => `
        <div class="vendor-row" data-id="${v.id}">
            <div class="vendor-name">${escapeHtml(getVendorName(v))}</div>
            <div class="vendor-phone">${escapeHtml(v.phone_number || '')}</div>
        </div>
    `).join('');
}

export function renderVendorJobRows(jobs) {
    return (jobs || []).map(job => `
        <div class="vendor-job-row" data-id="${job.id}">
            <div class="job-title">${escapeHtml(job.job_title || 'Untitled')}</div>
            <div class="job-status">${escapeHtml(job.job_status || '')}</div>
            <div class="job-meta">${formatDate(job.created_at)}</div>
        </div>
    `).join('');
}

/**
 * Maps to renderVendorJobRows to fulfill explicit imports referencing renderJobRows
 */
export function renderJobRows(jobs) {
    return renderVendorJobRows(jobs);
}

export function renderVendorDashboardModals(vendors) {
    return `<div id="vendorDashboardModals">
        </div>`;
}

// ===================== VENDOR JOB DASHBOARD HELPERS =====================
export function renderFollowupRows(followups, files) {
    return (followups || []).map(f => `
        <div class="followup-row">
            <div class="followup-type">${escapeHtml(f.action_type || '')}</div>
            <div class="followup-desc">${escapeHtml(f.description || '')}</div>
            <div class="followup-meta">${formatDate(f.created_at)}</div>
        </div>
    `).join('');
}

export function renderVendorJobModals(followups) {
    return `<div id="vendorJobModals">
        </div>`;
}

export function renderFileCards(files) {
    return (files || []).map(file => `
        <div class="file-card">
            <a href="${escapeAttr(file.file_url)}" target="_blank">${escapeHtml(file.file_name)}</a>
        </div>
    `).join('');
}

/*================================================================
END FILE: view_4_render_helpers.js
================================================================*/
