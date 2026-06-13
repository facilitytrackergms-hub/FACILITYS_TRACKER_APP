/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_submit.js
SUPABASE TBL : reports
VIEW NAME    : Report Development Submit
POP-UP TITLE : Submit / Resubmit Report
LAST UPDATED : 2026-06-13 @ 03:00 PM
================================================================*/
const __FILENAME = 'view_4_report_dev_submit.js';

import { updateReport } from '../view_4_core/view_4_data.js';

import {
    ensureReport,
    showMessage
} from './view_4_report_dev_helpers.js';

export function renderSubmitReportSection() {
    return `
        <div class="v4-report-dev-panel">
            <h3>Submit / Resubmit Report</h3>
            <div id="v4ReportDevMessage" class="v4-report-dev-message"></div>

            <label class="v4-report-dev-label">Submit To Name</label>
            <input id="v4ReportDevSubmitTo" class="v4-report-dev-input" type="text" placeholder="Name">

            <label class="v4-report-dev-label">Submit To Email</label>
            <input id="v4ReportDevSubmitEmail" class="v4-report-dev-input" type="email" placeholder="Email">

            <label class="v4-report-dev-label">Submit To Phone</label>
            <input id="v4ReportDevSubmitPhone" class="v4-report-dev-input" type="tel" placeholder="Phone">

            <button id="v4ReportDevSaveSubmit" class="v4-report-dev-main-btn">
                Mark Report Submitted
            </button>

            <button id="v4ReportDevBackPreviewMenu2" class="v4-report-dev-main-btn secondary">
                Back To Preview / Submit Report
            </button>
        </div>
    `;
}

export async function submitReport(context) {
    const report = await ensureReport(context);

    if (!report?.id) {
        showMessage('Report could not be submitted.', true);
        return;
    }

    const { error } = await updateReport(report.id, {
        report_status: 'Submitted',
        submitted_to_text: document.getElementById('v4ReportDevSubmitTo')?.value || '',
        submitted_to_email: document.getElementById('v4ReportDevSubmitEmail')?.value || '',
        submitted_to_phone: document.getElementById('v4ReportDevSubmitPhone')?.value || '',
        submitted_at: new Date().toISOString()
    });

    if (error) {
        console.error(`[${__FILENAME}] Error submitting report.`, error);
        showMessage('Submit failed.', true);
        return;
    }

    showMessage('Report submitted.');
}

/*================================================================
END FILE: view_4_report_dev_submit.js
================================================================*/
