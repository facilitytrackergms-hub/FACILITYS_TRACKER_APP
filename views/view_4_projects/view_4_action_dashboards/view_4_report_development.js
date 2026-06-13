/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_development.js
SUPABASE TBL : reports, report_notes, report_attachments
VIEW NAME    : Report Development View
POP-UP TITLE : Develop Project Report
LAST UPDATED : 2026-06-13 @ 01:38 PM
================================================================*/
const __FILENAME = 'view_4_report_development.js';

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

    if (raw === 'edit' || raw === 'edit_sections' || raw === 'edit report sections') {
        return 'edit';
    }

    if (raw === 'preview' || raw === 'submit' || raw === 'preview_submit' || raw === 'preview / submit report') {
        return 'preview';
    }

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

function makeChildContext(context, extra = {}) {
    return {
        ...context,
        ...extra,
        project: context.project,
        facility: context.facility,
        report: context.report,
        reportType: context.reportType,
        report_type: context.reportType,
        reportTypeLabel: context.reportTypeLabel,
        photo_type: context.photoWorkflow.photoType,
        photoType: context.photoWorkflow.photoType,
        actionKey: extra.actionKey || context.photoWorkflow.actionKey
    };
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

function renderBodyByMode(context) {
    if (context.developmentMode === 'edit') return renderEditSections(context);
    if (context.developmentMode === 'preview') return renderPreviewSubmit(context);
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

            .v4-report-dev-header {
                background: #ffffff;
                border-radius: 14px;
                padding: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.10);
                margin-bottom: 14px;
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

            .v4-report-dev-meta {
                text-align: left;
                background: #f7fafc;
                border-radius: 10px;
                padding: 10px;
                line-height: 1.5;
                font-size: 15px;
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

            .v4-report-dev-panel {
                background: #ffffff;
                border-radius: 14px;
                padding: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.10);
            }

            .v4-report-dev-panel h3 {
                margin: 0 0 12px 0;
                font-size: 20px;
                text-align: center;
            }

            .v4-report-dev-note {
                background: #f7fafc;
                border-radius: 10px;
                padding: 10px;
                margin: 0 0 12px 0;
                font-size: 15px;
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

            .v4-report-dev-preview-box {
                background: #f7fafc;
                border-radius: 10px;
                padding: 12px;
                margin-bottom: 12px;
                line-height: 1.6;
                font-size: 15px;
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
        const module = await import('./view_4_report_type_dashboard.js');
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

function openProjectAction(context, nav, actionKey) {
    const nextContext = makeChildContext(context, { actionKey, action_type: actionKey });

    const possibleNavFunctions = [
        nav?.openProjectAction,
        nav?.renderProjectAction,
        nav?.openActionDashboard,
        nav?.renderActionDashboard,
        nav?.goToProjectAction
    ];

    for (const fn of possibleNavFunctions) {
        if (typeof fn === 'function') {
            fn(nextContext);
            return;
        }
    }

    window.dispatchEvent(new CustomEvent('view4:openProjectAction', {
        detail: nextContext
    }));

    console.warn(`[${__FILENAME}] Project action requested: ${actionKey}`, nextContext);
}

function openReportAction(context, nav, reportAction) {
    const nextContext = makeChildContext(context, { reportAction, actionKey: reportAction });

    const possibleNavFunctions = [
        nav?.openReportAction,
        nav?.renderReportAction,
        nav?.openReportPreview,
        nav?.openReportSubmit,
        nav?.openReportTextEmail
    ];

    for (const fn of possibleNavFunctions) {
        if (typeof fn === 'function') {
            fn(nextContext);
            return;
        }
    }

    window.dispatchEvent(new CustomEvent('view4:openReportAction', {
        detail: nextContext
    }));

    console.warn(`[${__FILENAME}] Report action requested: ${reportAction}`, nextContext);
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

    bind('v4ReportDevOpenPhotos', () => openProjectAction(context, nav, context.photoWorkflow.actionKey));
    bind('v4ReportDevEditPhotos', () => openProjectAction(context, nav, context.photoWorkflow.actionKey));
    bind('v4ReportDevEditNotes', () => openProjectAction(context, nav, 'project_special_notes'));
    bind('v4ReportDevEditSupplies', () => openProjectAction(context, nav, 'supplies_parts_needed'));
    bind('v4ReportDevEditVendor', () => openProjectAction(context, nav, 'vendor_quotes_files'));

    bind('v4ReportDevPreviewReport', () => openReportAction(context, nav, 'preview_report'));
    bind('v4ReportDevSubmitReport', () => openReportAction(context, nav, 'submit_report'));
    bind('v4ReportDevTextEmail', () => openReportAction(context, nav, 'text_email_report'));
}

export function renderReportDevelopment(data = {}, nav = {}) {
    const app = document.getElementById('app');

    if (!app) {
        console.error(`[${__FILENAME}] App container not found.`);
        return;
    }

    const context = normalizeContext(data);

    app.innerHTML = `
        ${renderStyles()}
        <div class="v4-report-dev-wrap">
            ${renderHeader(context)}
            ${renderBodyByMode(context)}
            <div class="v4-report-dev-version">
                ${__FILENAME} | 2026-06-13 @ 01:38 PM
            </div>
        </div>
    `;

    setupReportDevelopmentEvents(context, nav);
}

export function renderReportDevelopmentView(data = {}, nav = {}) {
    renderReportDevelopment(data, nav);
}

export default renderReportDevelopment;
