/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_helpers.js
SUPABASE TBL : reports, report_notes, report_attachments
VIEW NAME    : Report Development Shared Helpers
POP-UP TITLE : None
LAST UPDATED : 2026-06-13 @ 02:20 PM
================================================================*/
const __FILENAME = 'view_4_report_dev_helpers.js';

import {
    fetchReportsByProject,
    createReport
} from '../view_4_core/view_4_data.js';

export function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export function normalizeReportType(value) {
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

export function normalizeDevelopmentMode(value) {
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

export function getReportTypeLabel(reportType) {
    if (reportType === 'follow_up') return 'Follow-Up Report';
    if (reportType === 'project_completion') return 'Project Completion Report';
    return 'Project Start Report';
}

export function getPhotoWorkflow(reportType) {
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

export function normalizeContext(data = {}) {
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

export function getProjectName(context) {
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

export function getProjectId(context) {
    return (
        context.project?.id ||
        context.project_id ||
        context.projectId ||
        null
    );
}

export function getFacilityId(context) {
    return (
        context.facility?.id ||
        context.facility_id ||
        context.facilityId ||
        null
    );
}

export function getFacilityName(context) {
    return (
        context.facility?.name ||
        context.facility?.facility_name ||
        context.facilityName ||
        context.facility_name ||
        'Selected Facility'
    );
}

export function getReportStatus(context) {
    return (
        context.report?.report_status ||
        context.reportStatus ||
        'Draft'
    );
}

export function getReportTitle(context) {
    return `${getReportTypeLabel(context.reportType)} - ${getProjectName(context)}`;
}

export function makeChildContext(context, extra = {}) {
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

export async function ensureReport(context) {
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

export function showMessage(message, isError = false) {
    const box = document.getElementById('v4ReportDevMessage');
    if (!box) return;

    box.innerHTML = escapeHtml(message);
    box.style.display = 'block';
    box.style.background = isError ? '#fee2e2' : '#dcfce7';
}

/*================================================================
END FILE: view_4_report_dev_helpers.js
================================================================*/
