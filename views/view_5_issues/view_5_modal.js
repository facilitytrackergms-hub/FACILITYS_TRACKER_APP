/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_modal.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Modal
POP-UP TITLE : Issue Maintenance Request
LAST UPDATED : 2026-06-14 @ 04:10 PM
================================================================*/

import { saveFacilityIssue } from './view_5_data.js';

let activeIssue = null;

export function setupIssuesEvents(facility, refreshFn) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    // --- NEW: Add listeners for Save and Close ---
    const saveBtn = document.getElementById('saveIssueBtn');
    if (saveBtn) {
        saveBtn.onclick = async () => {
            // Add your save logic here, mirroring your main issue view
            console.log("Saving issue:", activeIssue);
            modal.style.display = 'none';
            if (refreshFn) await refreshFn();
        };
    }

    const closeBtn = document.getElementById('closeIssueModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    // ---------------------------------------------

    const shell = modal.querySelector('.modal-shell');
    if (shell) shell.style.background = '#f9fafb';

    // Existing Text/Email buttons...
    const textBtn = document.getElementById('issueTextBtn');
    if (textBtn) {
        textBtn.onclick = () => {
            const title = document.getElementById('issueTitleInput')?.value || '';
            const desc = document.getElementById('issueDescInput')?.value || '';
            const body = `Maintenance Update: ${title} - ${desc}`;
            window.open(`sms:?body=${encodeURIComponent(body)}`, '_blank');
        };
    }

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
        const val = (typeof issue?.id === 'object' && issue.id !== null) ? issue.id.id : issue?.id;
        issueIdField.value = String(val ?? '');
    }

    const titleField = document.getElementById('issueTitleInput');
    if (titleField) titleField.value = issue?.title || '';

    const descField = document.getElementById('issueDescInput');
    if (descField) descField.value = issue?.description || '';

    const statusField = document.getElementById('issueStatusInput');
    if (statusField) statusField.value = issue?.status || 'Open';

    const partsField = document.getElementById('issuePartsInput');
    if (partsField) partsField.value = issue?.parts_needed || '';

    const reporter = contactReporter?.name || issue?.reported_by || '';
    const reporterField = document.getElementById('issueFormReporter');
    if (reporterField) reporterField.value = reporter;

    modal.style.display = 'flex';
}
