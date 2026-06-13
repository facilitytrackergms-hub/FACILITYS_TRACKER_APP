/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_preview.js
SUPABASE TBL : reports, report_notes, report_attachments
VIEW NAME    : Report Development Preview
POP-UP TITLE : Preview Report
LAST UPDATED : 2026-06-13 @ 02:55 PM
================================================================*/

import {
    fetchReportNotes,
    fetchReportAttachments
} from '../view_4_core/view_4_data.js';

import {
    escapeHtml,
    ensureReport,
    getReportTitle,
    getProjectName,
    getFacilityName
} from './view_4_report_dev_helpers.js';

import { renderNotesList } from './view_4_report_dev_notes.js';
import { renderAttachmentList } from './view_4_report_dev_photos.js';

export function renderPreviewSubmit(context) {
    return `
        <div class="v4-report-dev-panel">
            <h3>Preview / Submit Report</h3>

            <div class="v4-report-dev-preview-box">
                <div><strong>Report Type:</strong> ${escapeHtml(context.reportTypeLabel)}</div>
                <div><strong>Photo Section:</strong> ${escapeHtml(context.photoWorkflow.title)}</div>
                <div><strong>Report Status:</strong> ${escapeHtml(context.report?.report_status || 'Draft')}</div>
            </div>

            <button id="v4ReportDevPreviewReport" class="v4-report-dev-main-btn">
                1. Preview Report
            </button>
            <button id="v4ReportDevSubmitReport" class="v4-report-dev-main-btn">
                2. Submit / Resubmit Report
            </button>
            <button id="v4ReportDevTextEmail" class="v4-report-dev-main-btn">
                3. Text / Email Report
            </button>
            <button id="v4ReportDevGoEdit2" class="v4-report-dev-main-btn">
                4. Edit Report Sections
            </button>
            <button id="v4ReportDevBackType4" class="v4-report-dev-main-btn secondary">
                Back To Report Type Dashboard
            </button>
        </div>
    `;
}

export function renderPreviewReportSection() {
    return `
        <div class="v4-report-dev-panel">
            <h3>Preview Report</h3>
            <div id="v4ReportDevPreviewContent" class="v4-report-dev-preview-box">Loading report preview...</div>
            <button id="v4ReportDevBackPreviewMenu" class="v4-report-dev-main-btn secondary">
                Back To Preview / Submit Report
            </button>
        </div>
    `;
}

export async function loadPreview(context) {
    const report = await ensureReport(context);
    const box = document.getElementById('v4ReportDevPreviewContent');
    if (!box || !report?.id) return;

    const notes = await fetchReportNotes(report.id);
    const attachments = await fetchReportAttachments(report.id);

    box.innerHTML = `
        <div><strong>Report Title:</strong> ${escapeHtml(report.report_title || getReportTitle(context))}</div>
        <div><strong>Report Type:</strong> ${escapeHtml(context.reportTypeLabel)}</div>
        <div><strong>Project:</strong> ${escapeHtml(getProjectName(context))}</div>
        <div><strong>Facility:</strong> ${escapeHtml(getFacilityName(context))}</div>
        <div><strong>Status:</strong> ${escapeHtml(report.report_status || 'Draft')}</div>
        <hr>
        <div><strong>Notes:</strong></div>
        ${renderNotesList(notes)}
        <div><strong>Attachments:</strong></div>
        ${renderAttachmentList(attachments)}
    `;
}

/*================================================================
END FILE: view_4_report_dev_preview.js
================================================================*/
