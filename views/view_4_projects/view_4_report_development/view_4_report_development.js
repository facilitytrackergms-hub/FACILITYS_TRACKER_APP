/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_development.js
SUPABASE TBL : reports, report_notes, report_attachments
VIEW NAME    : Report Development View
POP-UP TITLE : Develop Project Report
LAST UPDATED : 2026-06-13 @ 02:05 PM
================================================================*/
const __FILENAME = 'view_4_report_development.js';

import {
    fetchReportsByProject,
    createReport,
    updateReport,
    fetchReportNotes,
    insertReportNote,
    fetchReportAttachments,
    insertReportAttachment,
    uploadCabinetFile
} from '../view_4_core/view_4_data.js';

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function normalizeReportType(value) {
    const raw = String(value || '').trim().toLowerCase();

    if (
        raw === 'project_start' ||
        raw === 'project start' ||
        raw === 'project start report' ||
        raw === 'start'
    ) {
        return 'project_start';
    }

    if (
        raw === 'follow_up' ||
        raw === 'follow-up' ||
        raw === 'follow up' ||
        raw === 'follow-up report' ||
        raw === 'follow up report' ||
        raw === 'followup'
    ) {
        return 'follow_up';
    }

    if (
        raw === 'project_completion' ||
        raw === 'project completion' ||
        raw === 'project completion report' ||
        raw === 'completion' ||
        raw === 'complete'
    ) {
        return 'project_completion';
    }

    return 'project_start';
}

function normalizeDevelopmentMode(value) {
    const raw = String(value || '').trim().toLowerCase();

    if (raw === 'edit' || raw === 'edit_sections' || raw === 'edit report sections') return 'edit';
    if (raw === 'preview' || raw === 'submit' || raw === 'preview_submit' || raw === 'preview / submit report') return 'preview';
    if (raw === 'photos' || raw === 'before_photos' || raw === 'during_photos' || raw === 'after_photos') return 'photos';
    if (raw === 'notes' || raw === 'project_special_notes' || raw === 'special_notes') return 'notes';
    if (raw === 'supplies' || raw === 'supplies_parts_needed') return 'supplies';
    if (raw === 'vendor' || raw === 'vendor_quotes_files') return 'vendor';
    if (raw === 'preview_report') return 'preview_report';
    if (raw === 'submit_report') return 'submit_report';
    if (raw === 'text_email_report') return 'text_email_report';

    return 'start';
}

function getReportTypeLabel(reportType) {
    if (reportType === 'follow_up') return 'Follow-Up Report';
    if (reportType === 'project_completion') return 'Project Completion Report';
    return 'Project Start Report';
}

function getPhotoWorkflow(reportType) {
    if (reportType === 'follow_up') {
        return {
            title: 'During Photos',
            photoType: 'during',
            actionKey: 'during_photos',
            buttonLabel: 'Open During Photos'
        };
    }

    if (reportType === 'project_completion') {
        return {
            title: 'After Photos',
            photoType: 'after',
            actionKey: 'after_photos',
            buttonLabel: 'Open After Photos'
        };
    }

    return {
        title: 'Before Photos',
        photoType: 'before',
        actionKey: 'before_photos',
        buttonLabel: 'Open Before Photos'
    };
}

function normalizeContext(data = {}) {
    const project = data.project || data.selectedProject || data.facilityProject || {};
    const facility = data.facility || data.selectedFacility || {};
    const report = data.report || data.selectedReport || {};

    const reportType = normalizeReportType(
        data.reportType ||
        data.report_type ||
        report.report_type ||
        report.type
    );

    const developmentMode = normalizeDevelopmentMode(
        data.developmentMode ||
        data.mode ||
        data.reportMode ||
        data.actionMode
    );

    return {
        ...data,
        project,
        facility,
        report,
        reportType,
        developmentMode,
        reportTypeLabel: getReportTypeLabel(reportType),
        photoWorkflow: getPhotoWorkflow(reportType)
    };
}

function getProjectName(context) {
    return (
        context.project?.project_name_text ||
        context.project?.project_title_text ||
        context.project?.title ||
        context.project?.name ||
        context.project_name_text ||
        context.project_title_text ||
        context.projectName ||
        'Selected Project'
    );
}

function getProjectId(context) {
    return (
        context.project?.id ||
        context.project_id ||
        context.projectId ||
        null
    );
}

function getFacilityId(context) {
    return (
        context.facility?.id ||
        context.facility_id ||
        context.facilityId ||
        null
    );
}

function getFacilityName(context) {
    return (
        context.facility?.name ||
        context.facility?.facility_name ||
        context.facilityName ||
        context.facility_name ||
        'Selected Facility'
    );
}

function getReportStatus(context) {
    return (
        context.report?.report_status ||
        context.reportStatus ||
        'Draft'
    );
}

function getReportTitle(context) {
    return `${getReportTypeLabel(context.reportType)} - ${getProjectName(context)}`;
}

function makeChildContext(context, extra = {}) {
    return {
        ...context,
        ...extra,
        project: context.project,
        facility: context.facility,
        report: extra.report || context.report,
        reportType: context.reportType,
        report_type: context.reportType,
        reportTypeLabel: context.reportTypeLabel,
        photo_type: context.photoWorkflow.photoType,
        photoType: context.photoWorkflow.photoType,
        actionKey: extra.actionKey || context.photoWorkflow.actionKey
    };
}

async function ensureReport(context) {
    if (context.report?.id) return context.report;

    const projectId = getProjectId(context);
    if (!projectId) return null;

    const reports = await fetchReportsByProject(projectId);
    const existingReport = (reports || []).find(r => r.report_type === context.reportType);

    if (existingReport) return existingReport;

    const { data, error } = await createReport({
        project_id: projectId,
        facility_id: getFacilityId(context),
        report_type: context.reportType,
        report_title: getReportTitle(context),
        report_status: 'Draft',
        report_version: 1,
        active_status: true
    });

    if (error) {
        console.error(`[${__FILENAME}] Error creating report.`, error);
        return null;
    }

    return data;
}

function showMessage(message, isError = false) {
    const box = document.getElementById('v4ReportDevMessage');
    if (!box) return;

    box.innerHTML = escapeHtml(message);
    box.style.display = 'block';
    box.style.background = isError ? '#fee2e2' : '#dcfce7';
}

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

function renderStartContinue(context) {
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

function renderEditSections(context) {
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

function renderPreviewSubmit(context) {
    return `
        <div class="v4-report-dev-panel">
            <h3>Preview / Submit Report</h3>

            <div class="v4-report-dev-preview-box">
                <div><strong>Report Type:</strong> ${escapeHtml(context.reportTypeLabel)}</div>
                <div><strong>Photo Section:</strong> ${escapeHtml(context.photoWorkflow.title)}</div>
                <div><strong>Report Status:</strong> ${escapeHtml(getReportStatus(context))}</div>
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

function renderPhotosSection(context) {
    return `
        <div class="v4-report-dev-panel">
            <h3>${escapeHtml(context.photoWorkflow.title)}</h3>
            <div id="v4ReportDevMessage" class="v4-report-dev-message"></div>

            <label class="v4-report-dev-label">Photo Title</label>
            <input id="v4ReportDevPhotoTitle" class="v4-report-dev-input" type="text" value="${escapeHtml(context.photoWorkflow.title)}">

            <input id="v4ReportDevCameraInput" class="v4-report-dev-hidden-file" type="file" accept="image/*" capture="environment">
            <input id="v4ReportDevUploadInput" class="v4-report-dev-hidden-file" type="file" accept="image/*">

            <button id="v4ReportDevOpenCamera" class="v4-report-dev-main-btn">
                Open Camera
            </button>

            <button id="v4ReportDevUploadPhoto" class="v4-report-dev-main-btn">
                Upload Photo
            </button>

            <div id="v4ReportDevSelectedPhotoBox" class="v4-report-dev-selected-photo-box">
                No photo selected.
            </div>

            <label class="v4-report-dev-label">Photo URL</label>
            <input id="v4ReportDevPhotoUrl" class="v4-report-dev-input" type="text" placeholder="Photo URL will appear here after upload">

            <label class="v4-report-dev-label">Description</label>
            <textarea id="v4ReportDevPhotoDescription" class="v4-report-dev-textarea" placeholder="Photo description"></textarea>

            <button id="v4ReportDevSavePhotoAttachment" class="v4-report-dev-main-btn">
                Save Photo To Report
            </button>

            <div id="v4ReportDevAttachmentList" class="v4-report-dev-list-box">Loading...</div>

            <button id="v4ReportDevBackEditFromPhotos" class="v4-report-dev-main-btn secondary">
                Back To Edit Report Sections
            </button>
        </div>
    `;
}

function renderNotesSection() {
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

function renderSuppliesSection() {
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

function renderVendorSection() {
    return `
        <div class="v4-report-dev-panel">
            <h3>Vendor Quotes / Files</h3>
            <div id="v4ReportDevMessage" class="v4-report-dev-message"></div>

            <label class="v4-report-dev-label">Vendor File Title</label>
            <input id="v4ReportDevVendorTitle" class="v4-report-dev-input" type="text" placeholder="Vendor quote or file title">

            <label class="v4-report-dev-label">File URL</label>
            <input id="v4ReportDevVendorUrl" class="v4-report-dev-input" type="text" placeholder="Paste vendor file URL here">

            <label class="v4-report-dev-label">Description</label>
            <textarea id="v4ReportDevVendorDescription" class="v4-report-dev-textarea" placeholder="Vendor quote or file description"></textarea>

            <button id="v4ReportDevSaveVendorAttachment" class="v4-report-dev-main-btn">
                Save Vendor Quote / File
            </button>

            <div id="v4ReportDevAttachmentList" class="v4-report-dev-list-box">Loading...</div>

            <button id="v4ReportDevBackEditFromVendor" class="v4-report-dev-main-btn secondary">
                Back To Edit Report Sections
            </button>
        </div>
    `;
}

function renderPreviewReportSection() {
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

function renderSubmitReportSection() {
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

function renderTextEmailSection() {
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

function renderStyles() {
    return `
        <style>
            .v4-report-dev-wrap {
                max-width: 680px;
                margin: 0 auto;
                padding: 14px;
                font-family: Arial, sans-serif;
                color: #17212b;
            }

            .v4-report-dev-header,
            .v4-report-dev-panel {
                background: #ffffff;
                border-radius: 14px;
                padding: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.10);
                margin-bottom: 14px;
            }

            .v4-report-dev-header {
                text-align: center;
            }

            .v4-report-dev-header h2 {
                margin: 8px 0 4px 0;
                font-size: 24px;
            }

            .v4-report-dev-subtitle {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 10px;
            }

            .v4-report-dev-meta,
            .v4-report-dev-note,
            .v4-report-dev-preview-box,
            .v4-report-dev-list-box,
            .v4-report-dev-selected-photo-box {
                text-align: left;
                background: #f7fafc;
                border-radius: 10px;
                padding: 10px;
                line-height: 1.5;
                font-size: 15px;
                margin-bottom: 12px;
            }

            .v4-report-dev-back-btn {
                float: left;
                border: 0;
                border-radius: 9px;
                padding: 8px 12px;
                font-size: 15px;
                cursor: pointer;
                background: #dfe7ef;
                color: #17212b;
            }

            .v4-report-dev-panel h3 {
                margin: 0 0 12px 0;
                font-size: 20px;
                text-align: center;
            }

            .v4-report-dev-main-btn {
                width: 100%;
                border: 0;
                border-radius: 12px;
                padding: 15px;
                margin: 7px 0;
                font-size: 17px;
                font-weight: 700;
                cursor: pointer;
                background: #f6c945;
                color: #17212b;
                text-align: left;
            }

            .v4-report-dev-main-btn.secondary {
                background: #dfe7ef;
            }

            .v4-report-dev-label {
                display: block;
                font-size: 14px;
                font-weight: 700;
                margin: 10px 0 4px 0;
            }

            .v4-report-dev-input,
            .v4-report-dev-textarea {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #d1d5db;
                border-radius: 10px;
                padding: 12px;
                font-size: 16px;
                font-family: Arial, sans-serif;
                margin-bottom: 8px;
            }

            .v4-report-dev-textarea {
                min-height: 110px;
                resize: vertical;
            }

            .v4-report-dev-message {
                display: none;
                border-radius: 10px;
                padding: 10px;
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 10px;
            }

            .v4-report-dev-list-item {
                background: #ffffff;
                border-radius: 9px;
                padding: 9px;
                margin-bottom: 8px;
                border: 1px solid #e5e7eb;
            }

            .v4-report-dev-list-title {
                font-weight: 700;
                margin-bottom: 4px;
            }

            .v4-report-dev-hidden-file {
                display: none;
            }

            .v4-report-dev-photo-preview {
                width: 100%;
                max-height: 280px;
                object-fit: contain;
                border-radius: 10px;
                margin-top: 8px;
                border: 1px solid #e5e7eb;
                background: #ffffff;
            }

            .v4-report-dev-version {
                text-align: center;
                margin-top: 14px;
                font-size: 11px;
                color: #6b7280;
            }
        </style>
    `;
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
    renderReportDevelopment(makeChildContext(context, { developmentMode, mode: developmentMode }), nav);
}

function renderNotesList(notes) {
    if (!notes || notes.length === 0) return 'No notes saved yet.';

    return notes.map(note => `
        <div class="v4-report-dev-list-item">
            <div class="v4-report-dev-list-title">${escapeHtml(note.note_subject || 'Note')}</div>
            <div>${escapeHtml(note.note_body || '')}</div>
        </div>
    `).join('');
}

function renderAttachmentList(attachments) {
    if (!attachments || attachments.length === 0) return 'No attachments saved yet.';

    return attachments.map(item => `
        <div class="v4-report-dev-list-item">
            <div class="v4-report-dev-list-title">${escapeHtml(item.title || item.attachment_type || 'Attachment')}</div>
            <div>${escapeHtml(item.description || '')}</div>
            ${item.file_url ? `<div><a href="${escapeHtml(item.file_url)}" target="_blank">Open File</a></div>` : ''}
            ${item.file_url && item.attachment_type === 'photo' ? `<img class="v4-report-dev-photo-preview" src="${escapeHtml(item.file_url)}" alt="${escapeHtml(item.title || 'Report Photo')}">` : ''}
        </div>
    `).join('');
}

async function loadNotes(context) {
    const report = await ensureReport(context);
    const box = document.getElementById('v4ReportDevNotesList');
    if (!box || !report?.id) return;

    const notes = await fetchReportNotes(report.id);
    box.innerHTML = renderNotesList(notes);
}

async function loadAttachments(context) {
    const report = await ensureReport(context);
    const box = document.getElementById('v4ReportDevAttachmentList');
    if (!box || !report?.id) return;

    const attachments = await fetchReportAttachments(report.id);
    box.innerHTML = renderAttachmentList(attachments);
}

async function saveNote(context, subject, body, sortOrder = 1) {
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

async function uploadReportPhoto(context, fileObj) {
    if (!fileObj) {
        showMessage('No photo selected.', true);
        return null;
    }

    const report = await ensureReport(context);

    if (!report?.id) {
        showMessage('Report could not be created.', true);
        return null;
    }

    const safeFileName = String(fileObj.name || 'report_photo.jpg')
        .replaceAll(' ', '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');

    const filePath = `report_attachments/${report.id}/${context.photoWorkflow.photoType}_${Date.now()}_${safeFileName}`;

    const result = await uploadCabinetFile('facility-assets', filePath, fileObj);

    if (result?.error || !result?.publicUrl) {
        console.error(`[${__FILENAME}] Photo upload failed.`, result?.error);
        showMessage('Photo upload failed.', true);
        return null;
    }

    const photoUrlInput = document.getElementById('v4ReportDevPhotoUrl');
    if (photoUrlInput) photoUrlInput.value = result.publicUrl;

    showMessage('Photo uploaded. Now save it to the report.');
    return result.publicUrl;
}

function showSelectedPhoto(fileObj) {
    const box = document.getElementById('v4ReportDevSelectedPhotoBox');
    if (!box || !fileObj) return;

    const localUrl = URL.createObjectURL(fileObj);

    box.innerHTML = `
        <div><strong>Selected Photo:</strong> ${escapeHtml(fileObj.name || 'Camera Photo')}</div>
        <img class="v4-report-dev-photo-preview" src="${localUrl}" alt="Selected Photo">
    `;
}

async function handlePhotoFileSelected(context, fileObj) {
    showSelectedPhoto(fileObj);
    await uploadReportPhoto(context, fileObj);
}

async function saveAttachment(context, attachmentType, title, fileUrl, description, photoType = null) {
    const report = await ensureReport(context);

    if (!report?.id) {
        showMessage('Report could not be created.', true);
        return;
    }

    if (attachmentType === 'photo' && !fileUrl) {
        showMessage('Upload a photo first.', true);
        return;
    }

    const { error } = await insertReportAttachment({
        report_id: report.id,
        project_id: getProjectId(context),
        facility_id: getFacilityId(context),
        attachment_type: attachmentType,
        source_table: 'manual_entry',
        source_id: '',
        title,
        description,
        file_url: fileUrl,
        photo_type: photoType,
        sort_order: 1,
        active_status: true
    });

    if (error) {
        console.error(`[${__FILENAME}] Error saving attachment.`, error);
        showMessage('Attachment save failed.', true);
        return;
    }

    showMessage('Saved to report.');
    await loadAttachments(makeChildContext(context, { report }));
}

async function loadPreview(context) {
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

async function loadTextEmail(context) {
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

    bind('v4ReportDevSavePhotoAttachment', async () => {
        await saveAttachment(
            context,
            'photo',
            document.getElementById('v4ReportDevPhotoTitle')?.value || context.photoWorkflow.title,
            document.getElementById('v4ReportDevPhotoUrl')?.value || '',
            document.getElementById('v4ReportDevPhotoDescription')?.value || '',
            context.photoWorkflow.photoType
        );
    });

    bind('v4ReportDevSaveNote', async () => {
        await saveNote(
            context,
            document.getElementById('v4ReportDevNoteSubject')?.value || 'Special Note',
            document.getElementById('v4ReportDevNoteBody')?.value || '',
            1
        );
    });

    bind('v4ReportDevSaveSupplies', async () => {
        await saveNote(
            context,
            'Supplies / Parts Needed',
            document.getElementById('v4ReportDevSuppliesBody')?.value || '',
            2
        );
    });

    bind('v4ReportDevSaveVendorAttachment', async () => {
        await saveAttachment(
            context,
            'vendor_quote_file',
            document.getElementById('v4ReportDevVendorTitle')?.value || 'Vendor Quote / File',
            document.getElementById('v4ReportDevVendorUrl')?.value || '',
            document.getElementById('v4ReportDevVendorDescription')?.value || '',
            null
        );
    });

    bind('v4ReportDevSaveSubmit', async () => {
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
    });
}

async function setupModeData(context) {
    if (context.developmentMode === 'photos' || context.developmentMode === 'vendor') {
        await loadAttachments(context);
    }

    if (context.developmentMode === 'notes' || context.developmentMode === 'supplies') {
        await loadNotes(context);
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
                ${__FILENAME} | 2026-06-13 @ 02:05 PM
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
