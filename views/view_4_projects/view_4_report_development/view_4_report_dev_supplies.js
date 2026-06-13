/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_supplies.js
SUPABASE TBL : report_notes
VIEW NAME    : Report Development Supplies
POP-UP TITLE : Supplies / Parts Needed
LAST UPDATED : 2026-06-13 @ 02:45 PM
================================================================*/

import { saveNote, loadNotes } from './view_4_report_dev_notes.js';

export function renderSuppliesSection() {
    return `
        <div class="v4-report-dev-panel">
            <h3>Supplies / Parts Needed</h3>
            <div id="v4ReportDevMessage" class="v4-report-dev-message"></div>

            <label class="v4-report-dev-label">Supplies / Parts</label>
            <textarea id="v4ReportDevSuppliesBody" class="v4-report-dev-textarea" placeholder="List supplies or parts needed"></textarea>

            <button id="v4ReportDevSaveSupplies" class="v4-report-dev-main-btn">
                Save Supplies / Parts Needed
            </button>

            <div id="v4ReportDevNotesList" class="v4-report-dev-list-box">Loading...</div>

            <button id="v4ReportDevBackEditFromSupplies" class="v4-report-dev-main-btn secondary">
                Back To Edit Report Sections
            </button>
        </div>
    `;
}

export async function saveSupplies(context) {
    await saveNote(
        context,
        'Supplies / Parts Needed',
        document.getElementById('v4ReportDevSuppliesBody')?.value || '',
        2
    );
}

export async function loadSupplies(context) {
    await loadNotes(context);
}

/*================================================================
END FILE: view_4_report_dev_supplies.js
================================================================*/
