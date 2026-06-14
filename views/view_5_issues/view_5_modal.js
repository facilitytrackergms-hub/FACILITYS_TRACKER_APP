/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_modal.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Modal
POP-UP TITLE : Issue Maintenance Request
LAST UPDATED : 2026-06-13 @ 08:10 PM
================================================================*/

import { saveFacilityIssue } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

let activeIssue = null;

export function setupIssuesEvents(facility, refreshFn) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    const saveBtn = document.getElementById('saveIssueBtn');

    saveBtn.onclick = async () => {

        const reporterName =
            document.getElementById('issueFormReporter')?.value?.trim() || '';

        const payload = {
            facility_id: facility.id,
            title: document.getElementById('issueTitleInput')?.value || '',
            description: document.getElementById('issueDescInput')?.value || '',
            priority: document.getElementById('issuePriorityInput')?.value || 'Medium',
            status: document.getElementById('issueStatusInput')?.value || 'Open',

            // FIX: THIS is what was missing
            reported_by: reporterName
        };

        const result = await saveFacilityIssue(payload, activeIssue?.id || null);

        if (result.error) {
            alert("Save failed");
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

    document.getElementById('issueId').value = issue?.id || '';
    document.getElementById('issueTitleInput').value = issue?.title || '';
    document.getElementById('issueDescInput').value = issue?.description || '';
    document.getElementById('issuePriorityInput').value = issue?.severity || 'Medium';
    document.getElementById('issueStatusInput').value = issue?.status || 'Open';

    const reporter = contactReporter?.name || issue?.reported_by || '';

    const reporterField = document.getElementById('issueFormReporter');
    if (reporterField) reporterField.value = reporter;

    modal.style.display = 'flex';
}
