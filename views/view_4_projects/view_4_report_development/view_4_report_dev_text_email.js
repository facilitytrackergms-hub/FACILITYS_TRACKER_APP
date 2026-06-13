/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_text_email.js
SUPABASE TBL : reports, report_notes, report_attachments
VIEW NAME    : Report Development Text / Email
POP-UP TITLE : Text / Email Report
LAST UPDATED : 2026-06-13 @ 03:05 PM
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

export function renderTextEmailSection() {
    return `
        <div class="v4-report-dev-panel">
            <h3>Text / Email Report</h3>
            <div id="v4ReportDevMessage" class="v4-report-dev-message"></div>
            <div id="v4ReportDevTextEmailContent" class="v4-report-dev-preview-box">Loading report message...</div>

            <button id="v4ReportDevBackPreviewMenu3" class="v4-report-dev-main-btn secondary">
                Back To Preview / Submit Report
            </button>
        </div>
    `;
}

export async function loadTextEmail(context) {
    const report = await ensureReport(context);
    const box = document.getElementById('v4ReportDevTextEmailContent');
    if (!box || !report?.id) return;

    const notes = await fetchReportNotes(report.id);
    const attachments = await fetchReportAttachments(report.id);

    box.innerHTML = `
        <div><strong>Subject:</strong> ${escapeHtml(report.report_title || getReportTitle(context))}</div>
        <br>
        <div><strong>Message:</strong></div>
        <div>
            ${escapeHtml(context.reportTypeLabel)}<br>
            Project: ${escapeHtml(getProjectName(context))}<br>
            Facility: ${escapeHtml(getFacilityName(context))}<br>
            Status: ${escapeHtml(report.report_status || 'Draft')}<br><br>
            Notes: ${escapeHtml(String(notes.length))}<br>
            Attachments: ${escapeHtml(String(attachments.length))}
        </div>
    `;
}

/*================================================================
END FILE: view_4_report_dev_text_email.js
================================================================*/
