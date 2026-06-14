/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_modal.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Modal
POP-UP TITLE : Issue Maintenance Request
LAST UPDATED : 2026-06-13 @ 09:30 PM
================================================================*/

import { saveFacilityIssue } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

let activeIssue = null;

export function setupIssuesEvents(facility, refreshFn) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    const saveBtn = document.getElementById('saveIssueBtn');

    saveBtn.onclick = async () => {
        const reporterName = document.getElementById('issueFormReporter')?.value?.trim() || '';

        const payload = {
            facility_id: facility.id,
            title: document.getElementById('issueTitleInput')?.value || '',
            description: document.getElementById('issueDescInput')?.value || '',
            priority: document.getElementById('issuePriorityInput')?.value || 'Medium',
            status: document.getElementById('issueStatusInput')?.value || 'Open',
            reported_by: reporterName
        };

        // SAFETY FIX: Ensure ID is primitive (e.g., string/number) and not an object
        let rawId = activeIssue?.id ?? document.getElementById('issueId')?.value;
        const id = (typeof rawId === 'object' && rawId !== null) ? rawId.id : rawId;

        if (!id) {
            console.error("Save aborted: No valid ID found.");
            return;
        }

        const result = await saveFacilityIssue(payload, id);

        if (result?.error) {
            alert("Save failed: " + result.error.message);
            return;
        }

        modal.style.display = 'none';
        await refreshFn();
    };
}

export function openIssueModal(facility, issue, contactReporter) {
    activeIssue = issue;

    const modal = document.getElementById('issueModal');
    if (!modal) return;

    // Ensure we store the primitive ID
    const issueIdField = document.getElementById('issueId');
    if (issueIdField) {
        issueIdField.value = (typeof issue?.id === 'object') ? issue.id.id : (issue?.id ?? '');
    }

    document.getElementById('issueTitleInput').value = issue?.title || '';
    document.getElementById('issueDescInput').value = issue?.description || '';
    document.getElementById('issuePriorityInput').value = issue?.severity || 'Medium';
    document.getElementById('issueStatusInput').value = issue?.status || 'Open';

    const reporter = contactReporter?.name || issue?.reported_by || '';
    const reporterField = document.getElementById('issueFormReporter');
    if (reporterField) reporterField.value = reporter;

    modal.style.display = 'flex';
}
