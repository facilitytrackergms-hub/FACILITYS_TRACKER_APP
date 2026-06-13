/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_development.js
SUPABASE TBL : reports, report_notes, report_attachments
VIEW NAME    : Report Development View
POP-UP TITLE : Develop Project Report
LAST UPDATED : 2026-06-13 @ 03:15 PM
================================================================*/
const __FILENAME = 'view_4_report_development.js';

import {
    escapeHtml,
    normalizeContext,
    getProjectName,
    getFacilityName,
    getReportStatus,
    makeChildContext,
    ensureReport
} from './view_4_report_dev_helpers.js';

import { renderStyles } from './view_4_report_dev_styles.js';
import { renderStartContinue } from './view_4_report_dev_start.js';
import { renderEditSections } from './view_4_report_dev_edit_menu.js';

import {
    renderPhotosSection,
    loadAttachments,
    handlePhotoFileSelected
} from './view_4_report_dev_photos.js';

import {
    renderNotesSection,
    loadNotes,
    saveNote
} from './view_4_report_dev_notes.js';

import {
    renderSuppliesSection,
    saveSupplies,
    loadSupplies
} from './view_4_report_dev_supplies.js';

import {
    renderVendorSection,
    saveVendorAttachment,
    loadVendorAttachments
} from './view_4_report_dev_vendor.js';

import {
    renderPreviewSubmit,
    renderPreviewReportSection,
    loadPreview
} from './view_4_report_dev_preview.js';

import {
    renderSubmitReportSection,
    submitReport
} from './view_4_report_dev_submit.js';

import {
    renderTextEmailSection,
    loadTextEmail
} from './view_4_report_dev_text_email.js';

function renderHeader(context) {
    return `
        <div class="v4-report-dev-header">
            <button id="v4ReportDevBackType" class="v4-report-dev-back-btn">Back</button>
            <h2>Report Development</h2>
            <div class="v4-report-dev-subtitle">${escapeHtml(context.reportTypeLabel)}</div>
            <div class="v4-report-dev-meta">
                <div><strong>Project:</strong> ${escapeHtml(getProjectName(context))}</div>
                <div><strong>Facility:</strong> ${escapeHtml(getFacilityName(context))}</div>
                <div><strong>Status:</strong> ${escapeHtml(getReportStatus(context))}</div>
            </div>
        </div>
    `;
}

function renderBodyByMode(context) {
    if (context.developmentMode === 'edit') return renderEditSections(context);
    if (context.developmentMode === 'preview') return renderPreviewSubmit(context);
    if (context.developmentMode === 'photos') return renderPhotosSection(context);
    if (context.developmentMode === 'notes') return renderNotesSection(context);
    if (context.developmentMode === 'supplies') return renderSuppliesSection(context);
    if (context.developmentMode === 'vendor') return renderVendorSection(context);
    if (context.developmentMode === 'preview_report') return renderPreviewReportSection(context);
    if (context.developmentMode === 'submit_report') return renderSubmitReportSection(context);
    if (context.developmentMode === 'text_email_report') return renderTextEmailSection(context);

    return renderStartContinue(context);
}

async function openReportTypeDashboard(context, nav) {
    const nextContext = makeChildContext(context, {
        developmentMode: 'type_dashboard',
        mode: 'type_dashboard'
    });

    if (typeof nav?.renderReportTypeDashboard === 'function') {
        nav.renderReportTypeDashboard(nextContext, nav);
        return;
    }

    if (typeof nav?.openReportTypeDashboard === 'function') {
        nav.openReportTypeDashboard(nextContext);
        return;
    }

    try {
        const module = await import('../view_4_action_dashboards/view_4_report_type_dashboard.js');
        const renderer = module.renderReportTypeDashboard || module.renderReportType || module.default;

        if (typeof renderer === 'function') {
            renderer(nextContext, nav);
            return;
        }
    } catch (error) {
        console.error(`[${__FILENAME}] Could not open report type dashboard.`, error);
    }
}

function rerenderDevelopment(context, nav, developmentMode) {
    renderReportDevelopment(makeChildContext(context, {
        developmentMode,
        mode: developmentMode
    }), nav);
}

function setupReportDevelopmentEvents(context, nav) {
    const bind = (id, handler) => {
        const el = document.getElementById(id);
        if (el) el.onclick = handler;
    };

    bind('v4ReportDevBackType', () => openReportTypeDashboard(context, nav));
    bind('v4ReportDevBackType2', () => openReportTypeDashboard(context, nav));
    bind('v4ReportDevBackType3', () => openReportTypeDashboard(context, nav));
    bind('v4ReportDevBackType4', () => openReportTypeDashboard(context, nav));

    bind('v4ReportDevGoEdit', () => rerenderDevelopment(context, nav, 'edit'));
    bind('v4ReportDevGoEdit2', () => rerenderDevelopment(context, nav, 'edit'));
    bind('v4ReportDevGoPreview', () => rerenderDevelopment(context, nav, 'preview'));
    bind('v4ReportDevGoPreview2', () => rerenderDevelopment(context, nav, 'preview'));

    bind('v4ReportDevOpenPhotos', () => rerenderDevelopment(context, nav, 'photos'));
    bind('v4ReportDevEditPhotos', () => rerenderDevelopment(context, nav, 'photos'));
    bind('v4ReportDevEditNotes', () => rerenderDevelopment(context, nav, 'notes'));
    bind('v4ReportDevEditSupplies', () => rerenderDevelopment(context, nav, 'supplies'));
    bind('v4ReportDevEditVendor', () => rerenderDevelopment(context, nav, 'vendor'));

    bind('v4ReportDevPreviewReport', () => rerenderDevelopment(context, nav, 'preview_report'));
    bind('v4ReportDevSubmitReport', () => rerenderDevelopment(context, nav, 'submit_report'));
    bind('v4ReportDevTextEmail', () => rerenderDevelopment(context, nav, 'text_email_report'));

    bind('v4ReportDevBackEditFromPhotos', () => rerenderDevelopment(context, nav, 'edit'));
    bind('v4ReportDevBackEditFromNotes', () => rerenderDevelopment(context, nav, 'edit'));
    bind('v4ReportDevBackEditFromSupplies', () => rerenderDevelopment(context, nav, 'edit'));
    bind('v4ReportDevBackEditFromVendor', () => rerenderDevelopment(context, nav, 'edit'));

    bind('v4ReportDevBackPreviewMenu', () => rerenderDevelopment(context, nav, 'preview'));
    bind('v4ReportDevBackPreviewMenu2', () => rerenderDevelopment(context, nav, 'preview'));
    bind('v4ReportDevBackPreviewMenu3', () => rerenderDevelopment(context, nav, 'preview'));

    bind('v4ReportDevOpenCamera', () => {
        document.getElementById('v4ReportDevCameraInput')?.click();
    });

    bind('v4ReportDevUploadPhoto', () => {
        document.getElementById('v4ReportDevUploadInput')?.click();
    });

    const cameraInput = document.getElementById('v4ReportDevCameraInput');
    if (cameraInput) {
        cameraInput.onchange = async () => {
            const fileObj = cameraInput.files?.[0];
            await handlePhotoFileSelected(context, fileObj);
        };
    }

    const uploadInput = document.getElementById('v4ReportDevUploadInput');
    if (uploadInput) {
        uploadInput.onchange = async () => {
            const fileObj = uploadInput.files?.[0];
            await handlePhotoFileSelected(context, fileObj);
        };
    }

    bind('v4ReportDevSaveNote', async () => {
        await saveNote(
            context,
            document.getElementById('v4ReportDevNoteSubject')?.value || 'Special Note',
            document.getElementById('v4ReportDevNoteBody')?.value || '',
            1
        );
    });

    bind('v4ReportDevSaveSupplies', async () => {
        await saveSupplies(context);
    });

    bind('v4ReportDevSaveVendorAttachment', async () => {
        await saveVendorAttachment(context);
    });

    bind('v4ReportDevSaveSubmit', async () => {
        await submitReport(context);
    });
}

async function setupModeData(context) {
    if (context.developmentMode === 'photos') {
        await loadAttachments(context);
    }

    if (context.developmentMode === 'vendor') {
        await loadVendorAttachments(context);
    }

    if (context.developmentMode === 'notes') {
        await loadNotes(context);
    }

    if (context.developmentMode === 'supplies') {
        await loadSupplies(context);
    }

    if (context.developmentMode === 'preview_report') {
        await loadPreview(context);
    }

    if (context.developmentMode === 'text_email_report') {
        await loadTextEmail(context);
    }
}

export async function renderReportDevelopment(data = {}, nav = {}) {
    const app = document.getElementById('app');

    if (!app) {
        console.error(`[${__FILENAME}] App container not found.`);
        return;
    }

    let context = normalizeContext(data);
    const report = await ensureReport(context);

    if (report) {
        context = makeChildContext(context, { report });
    }

    app.innerHTML = `
        ${renderStyles()}
        <div class="v4-report-dev-wrap">
            ${renderHeader(context)}
            ${renderBodyByMode(context)}
            <div class="v4-report-dev-version">
                ${__FILENAME} | 2026-06-13 @ 03:15 PM
            </div>
        </div>
    `;

    setupReportDevelopmentEvents(context, nav);
    await setupModeData(context);
}

export function renderReportDevelopmentView(data = {}, nav = {}) {
    renderReportDevelopment(data, nav);
}

export default renderReportDevelopment;

/*================================================================
END FILE: view_4_report_development.js
================================================================*/
