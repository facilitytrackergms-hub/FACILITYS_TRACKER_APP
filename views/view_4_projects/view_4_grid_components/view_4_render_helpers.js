/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_render_helpers.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : View 4 Shared Render Helpers
POP-UP TITLE : Shared Render Helpers
LAST UPDATED : 2026-06-09 @ 03:30 AM
================================================================*/
const __FILENAME = 'view_4_render_helpers.js';

import {
    getProjectTitle,
    getVendorName
} from '../view_4_data.js';

// ===================== EXISTING FUNCTIONS =====================
export function renderVendorQuotesFilesDashboard(project, vendors) {
    if (!project) return '<div class="cabinet-empty">No project selected.</div>';
    const projectId = escapeAttr(project.id);
    return `
        <div class="cabinet-dashboard">
            <h3>Vendor Quotes / Files for ${escapeHtml(getProjectTitle(project))}</h3>

            <div class="cabinet-action-grid">
                <button id="addVendorBtn" class="cabinet-btn cabinet-btn-green">
                    ➕ Add Vendor
                </button>

                ${(vendors || []).map(vendor => `
                    <button class="cabinet-btn cabinet-btn-blue vendor-btn" data-vendor-id="${escapeAttr(vendor.id)}">
                        ${escapeHtml(getVendorName(vendor))}
                    </button>
                `).join('')}
            </div>

            <button id="backToProjectBtn" class="cabinet-btn cabinet-btn-gray">
                ⬅️ Back to Project
            </button>
        </div>
    `;
}

// ===================== NEW FUNCTIONS ADDED =====================
export function renderHomeModals(projects, vendors) {
    return `
        <div id="homeModalsContainer">
            <!-- Render modals for projects and vendors -->
        </div>
    `;
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

// ===================== EXISTING FUNCTIONS CONTINUED =====================
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
UPDATED: 2026-06-09 @ 03:30 AM
================================================================*/
