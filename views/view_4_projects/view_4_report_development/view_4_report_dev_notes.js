/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_notes.js
SUPABASE TBL : report_notes
VIEW NAME    : Report Development Notes
POP-UP TITLE : Special Notes
LAST UPDATED : 2026-06-13 @ 02:40 PM
================================================================*/
const __FILENAME = 'view_4_report_dev_notes.js';

import {
    fetchReportNotes,
    insertReportNote
} from '../view_4_core/view_4_data.js';

import {
    escapeHtml,
    ensureReport,
    makeChildContext,
    showMessage
} from './view_4_report_dev_helpers.js';

export function renderNotesSection() {
    return `
        <div class="v4-report-dev-panel">
            <h3>Special Notes</h3>
            <div id="v4ReportDevMessage" class="v4-report-dev-message"></div>

            <label class="v4-report-dev-label">Note Subject</label>
            <input id="v4ReportDevNoteSubject" class="v4-report-dev-input" type="text" placeholder="Note subject">

            <label class="v4-report-dev-label">Note</label>
            <textarea id="v4ReportDevNoteBody" class="v4-report-dev-textarea" placeholder="Write report note"></textarea>

            <button id="v4ReportDevSaveNote" class="v4-report-dev-main-btn">
                Save Special Note
            </button>

            <div id="v4ReportDevNotesList" class="v4-report-dev-list-box">Loading...</div>

            <button id="v4ReportDevBackEditFromNotes" class="v4-report-dev-main-btn secondary">
                Back To Edit Report Sections
            </button>
        </div>
    `;
}

export function renderNotesList(notes) {
    if (!notes || notes.length === 0) return 'No notes saved yet.';

    return notes.map(note => `
        <div class="v4-report-dev-list-item">
            <div class="v4-report-dev-list-title">${escapeHtml(note.note_subject || 'Note')}</div>
            <div>${escapeHtml(note.note_body || '')}</div>
        </div>
    `).join('');
}

export async function loadNotes(context) {
    const report = await ensureReport(context);
    const box = document.getElementById('v4ReportDevNotesList');
    if (!box || !report?.id) return;

    const notes = await fetchReportNotes(report.id);
    box.innerHTML = renderNotesList(notes);
}

export async function saveNote(context, subject, body, sortOrder = 1) {
    const report = await ensureReport(context);

    if (!report?.id) {
        showMessage('Report could not be created.', true);
        return;
    }

    const { error } = await insertReportNote({
        report_id: report.id,
        note_subject: subject,
        note_body: body,
        sort_order: sortOrder,
        active_status: true
    });

    if (error) {
        console.error(`[${__FILENAME}] Error saving note.`, error);
        showMessage('Note save failed.', true);
        return;
    }

    showMessage('Saved.');
    await loadNotes(makeChildContext(context, { report }));
}

/*================================================================
END FILE: view_4_report_dev_notes.js
================================================================*/
