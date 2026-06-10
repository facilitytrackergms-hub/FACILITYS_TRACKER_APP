/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_render_helpers.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : View 4 Shared Render Helpers
POP-UP TITLE : Shared Render Helpers
LAST UPDATED : 2026-06-10 @ 07:00 AM
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
export function renderHomeModals(projects, vendors) {
    return `<div id="homeModalsContainer">
        <!-- Modals for projects and vendors -->
    </div>`;
}

export function renderProjectButtons(projects) {
    return (projects || []).map(project => `
        <button class="cabinet-btn cabinet-btn-blue" data-open-project="${escapeAttr(project.id)}">
            ${escapeHtml(getProjectTitle(project))}
        </button>
    `).join('');
}

export function renderProjectActions(actions) {
    return (actions || []).map(action => `
        <div class="project-action-row">
            <div class="project-action-title">${escapeHtml(action.title || '')}</div>
            <div class="project-action-note">${escapeHtml(action.notes || '')}</div>
            <div class="project-action-meta">${formatDate(action.created_at)}</div>
        </div>
    `).join('');
}

export function renderProjectActionModal() {
    return `
        <div id="projectActionModal" class="cabinet-modal">
            <div class="cabinet-modal-body">
                <h3>New Project Action</h3>
                <label>Title</label>
                <input type="text" id="actionTitleInput" class="cabinet-input">
                <label>Notes</label>
                <textarea id="actionNotesInput" class="cabinet-textarea"></textarea>
                <button id="saveActionBtn" class="cabinet-btn cabinet-btn-green">Save Action</button>
            </div>
        </div>
    `;
}

export function renderVendorQuotesFilesDashboard(project, vendors) {
    if (!project) return '<div class="cabinet-empty">No project selected.</div>';
    return `
        <div class="cabinet-dashboard">
            <h3>Vendor Quotes / Files for ${escapeHtml(getProjectTitle(project))}</h3>
            <div class="cabinet-action-grid">
                <button id="addVendorBtn" class="cabinet-btn cabinet-btn-green">➕ Add Vendor</button>
                ${(vendors || []).map(vendor => `
                    <button class="cabinet-btn cabinet-btn-blue vendor-btn" data-vendor-id="${escapeAttr(vendor.id)}">
                        ${escapeHtml(getVendorName(vendor))}
                    </button>
                `).join('')}
            </div>
            <button id="backToProjectBtn" class="cabinet-btn cabinet-btn-gray">⬅️ Back to Project</button>
        </div>
    `;
}

// ===================== VENDOR DASHBOARD HELPERS =====================
export function renderJobRows(jobs) {
    return (jobs || []).map(job => `
        <div class="vendor-job-row">
            <div class="job-title">${escapeHtml(job.job_title || 'Untitled')}</div>
            <div class="job-status">${escapeHtml(job.job_status || '')}</div>
            <div class="job-meta">${formatDate(job.created_at)}</div>
        </div>
    `).join('');
}

export function renderVendorDashboardModals(vendors) {
    return `<div id="vendorDashboardModals">
        <!-- Vendor dashboard modals -->
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
        <!-- Vendor job modals -->
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
UPDATED: 2026-06-10 @ 07:00 AM
================================================================*/
