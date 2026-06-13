/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_start.js
SUPABASE TBL : reports, report_notes, report_attachments
VIEW NAME    : Report Development Start / Continue
POP-UP TITLE : Start / Continue Report
LAST UPDATED : 2026-06-13 @ 02:25 PM
================================================================*/

import { escapeHtml } from './view_4_report_dev_helpers.js';

export function renderStartContinue(context) {
    return `
        <div class="v4-report-dev-panel">
            <h3>Start / Continue Report</h3>
            <p class="v4-report-dev-note">This report starts with ${escapeHtml(context.photoWorkflow.title)}.</p>

            <button id="v4ReportDevOpenPhotos" class="v4-report-dev-main-btn">
                1. ${escapeHtml(context.photoWorkflow.buttonLabel)}
            </button>
            <button id="v4ReportDevGoEdit" class="v4-report-dev-main-btn">
                2. Edit Report Sections
            </button>
            <button id="v4ReportDevGoPreview" class="v4-report-dev-main-btn">
                3. Preview / Submit Report
            </button>
            <button id="v4ReportDevBackType2" class="v4-report-dev-main-btn secondary">
                Back To Report Type Dashboard
            </button>
        </div>
    `;
}

/*================================================================
END FILE: view_4_report_dev_start.js
================================================================*/
