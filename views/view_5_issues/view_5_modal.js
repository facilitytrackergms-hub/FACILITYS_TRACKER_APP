/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_modal.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Modal
POP-UP TITLE : Issue Maintenance Request
LAST UPDATED : 2026-06-14 @ 06:40 AM
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

        const rawId = document.getElementById('issueId')?.value;
        const id = Number(rawId);

        // HARD SAFE GUARD: prevent NaN ever reaching Supabase
        if (!rawId || rawId === '' || !Number.isFinite(id)) {
            console.warn("Invalid issue ID → forcing INSERT instead of UPDATE", rawId);

            const insertResult = await saveFacilityIssue(payload, null);

            if (insertResult?.error) {
                alert("Save failed: " + insertResult.error.message);
                return;
            }

            modal.style.display = 'none';
            await refreshFn();
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
    document.getElementById('issuePriorityInput').value = issue?.severity || 'Medium';
    document.getElementById('issueStatusInput').value = issue?.status || 'Open';

    const reporter = contactReporter?.name || issue?.reported_by || '';
    const reporterField = document.getElementById('issueFormReporter');
    if (reporterField) reporterField.value = reporter;

    modal.style.display = 'flex';
}
