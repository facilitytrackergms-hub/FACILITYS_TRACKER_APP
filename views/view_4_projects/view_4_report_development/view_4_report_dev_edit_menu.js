
/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_edit_menu.js
SUPABASE TBL : reports, report_notes, report_attachments
VIEW NAME    : Report Development Edit Menu
POP-UP TITLE : Edit Report Sections
LAST UPDATED : 2026-06-13 @ 02:30 PM
================================================================*/

import { escapeHtml } from './view_4_report_dev_helpers.js';

export function renderEditSections(context) {
    return `
        <div class="v4-report-dev-panel">
            <h3>Edit Report Sections</h3>

            <button id="v4ReportDevEditPhotos" class="v4-report-dev-main-btn">
                1. ${escapeHtml(context.photoWorkflow.title)}
            </button>
            <button id="v4ReportDevEditNotes" class="v4-report-dev-main-btn">
                2. Special Notes
            </button>
            <button id="v4ReportDevEditSupplies" class="v4-report-dev-main-btn">
                3. Supplies / Parts Needed
            </button>
            <button id="v4ReportDevEditVendor" class="v4-report-dev-main-btn">
                4. Vendor Quotes / Files
            </button>
            <button id="v4ReportDevGoPreview2" class="v4-report-dev-main-btn">
                5. Preview / Submit Report
            </button>
            <button id="v4ReportDevBackType3" class="v4-report-dev-main-btn secondary">
                Back To Report Type Dashboard
            </button>
        </div>
    `;
}

/*================================================================
END FILE: view_4_report_dev_edit_menu.js
================================================================*/
