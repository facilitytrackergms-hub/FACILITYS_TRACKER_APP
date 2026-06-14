/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_modal.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Modal
POP-UP TITLE : Issue Maintenance Request
LAST UPDATED : 2026-06-14 @ FINAL UPDATED FIX
================================================================*/

import { saveFacilityIssue } from './view_5_data.js';

let activeIssue = null;

export function setupIssuesEvents(facility, refreshFn) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    // Apply specific background change to distinguish this modal view
    const shell = modal.querySelector('.modal-shell');
    if (shell) shell.style.background = '#f9fafb';

    // Text Button Functionality
    const textBtn = document.getElementById('issueTextBtn');
    if (textBtn) {
        textBtn.onclick = () => {
            const title = document.getElementById('issueTitleInput')?.value || '';
            const desc = document.getElementById('issueDescInput')?.value || '';
            const body = `Maintenance Update: ${title} - ${desc}`;
            // Using window.open for better mobile compatibility
            window.open(`sms:?body=${encodeURIComponent(body)}`, '_blank');
        };
    }

    // Email Button Functionality
    const emailBtn = document.getElementById('issueEmailBtn');
    if (emailBtn) {
        emailBtn.onclick = () => {
            const title = document.getElementById('issueTitleInput')?.value || '';
            const desc = document.getElementById('issueDescInput')?.value || '';
            const subject = `Maintenance Request: ${title}`;
            const body = `Details: ${desc}`;
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        };
    }
}

export function openIssueModal(facility, issue, contactReporter) {
    activeIssue = issue;

    const modal = document.getElementById('issueModal');
    if (!modal) return;

    const issueIdField = document.getElementById('issueId');

    if (issueIdField) {
        const val =
            (typeof issue?.id === 'object' && issue.id !== null)
                ? issue.id.id
                : issue?.id;

        issueIdField.value = String(val ?? '');
    }

    document.getElementById('issueTitleInput').value = issue?.title || '';
    document.getElementById('issueDescInput').value = issue?.description || '';
    document.getElementById('issueStatusInput').value = issue?.status || 'Open';
    document.getElementById('issuePartsInput').value = issue?.parts_needed || '';

    const reporter = contactReporter?.name || issue?.reported_by || '';
    const reporterField = document.getElementById('issueFormReporter');
    if (reporterField) reporterField.value = reporter;

    modal.style.display = 'flex';
}
