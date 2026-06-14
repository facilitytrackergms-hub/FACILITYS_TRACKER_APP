/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_modal.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Modal
POP-UP TITLE : Issue Maintenance Request
LAST UPDATED : 2026-06-07 @ 09:35 AM
================================================================*/
const __FILENAME = 'view_5_modal.js';

let activeIssueForFollowups = null;

import { saveFacilityIssue } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupIssuesEvents(facility, renderFacilityIssuesFn) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    let metaLabel = document.getElementById('view-metadata-label');
    if (!metaLabel) {
        metaLabel = document.createElement('div');
        metaLabel.id = 'view-metadata-label';
        metaLabel.style.cssText = 'font-size: 10px; color: #9ca3af; padding: 4px 8px; text-align: right; border-top: 1px solid #e5e7eb;';
        modal.appendChild(metaLabel);
    }
    metaLabel.innerText = `Source: view_5_modal.js | Updated: 2026-06-07 09:35 AM`;

    const addContactLink = document.getElementById('addInlineContactLink');
    if (addContactLink) {
        addContactLink.onclick = (e) => {
            e.preventDefault();

            const currentDraft = {
                id: document.getElementById('issueId')?.value || '',
                title: document.getElementById('issueTitleInput')?.value?.trim() || '',
                description: document.getElementById('issueDescInput')?.value?.trim() || '',
                severity: document.getElementById('issuePriorityInput')?.value || 'Medium',
                status: document.getElementById('issueStatusInput')?.value || 'Open'
            };

            modal.style.display = 'none';

            if (window.navigateTo) {
                window.navigateTo('view_3_contacts', {
                    facility,
                    openFormInstantly: true,
                    returnToView: 'view_5_issues',
                    cachedIssueForm: currentDraft
                });
            }
        };
    }

    const saveBtn = document.getElementById('saveIssueBtn');
    if (saveBtn) {
        saveBtn.onclick = async () => {
            const issueId = document.getElementById('issueId')?.value || '';
            const title = document.getElementById('issueTitleInput')?.value?.trim() || '';
            const desc = document.getElementById('issueDescInput')?.value?.trim() || '';
            const priority = document.getElementById('issuePriorityInput')?.value || 'Medium';
            const status = document.getElementById('issueStatusInput')?.value || 'Open';
            const reporterName = document.getElementById('hiddenReporterName')?.value || '';
            const reporterId = document.getElementById('hiddenReporterId')?.value || '';

            if (!title) {
                alert("[ERR-VIEW_5_MODAL-01] ⚠️ WARNING: The Issue Request Title cannot be left empty.");
                return;
            }

            if (!desc) {
                alert("[ERR-VIEW_5_MODAL-02] Please fill out the Description field.");
                return;
            }

            const payload = {
                facility_id: facility.id,
                title,
                description: desc,
                priority,
                status,
                initiated_by: reporterName || 'Staff',
                reported_by: reporterName || 'Staff'
            };

            const result = await saveFacilityIssue(payload, issueId || null, null);

            if (result.error) {
                alert("[ERR-VIEW_5_MODAL-03] Failed to save issue details.");
                return;
            }

            modal.style.display = 'none';

            if (renderFacilityIssuesFn) {
                await renderFacilityIssuesFn(facility);
            }
        };
    }

    const followupsBtn = document.getElementById('openFollowupsBtn');
    if (followupsBtn) {
        followupsBtn.onclick = () => {
            if (!activeIssueForFollowups || !activeIssueForFollowups.id) {
                alert("[ERR-VIEW_5_MODAL-FOLLOWUP-01] Please open a saved issue before adding follow-ups.");
                return;
            }

            modal.style.display = 'none';

            if (window.navigateTo) {
                window.navigateTo('view_7_followups', {
                    facility,
                    issue: activeIssueForFollowups
                });
            }
        };
    }

    const closeBtn = document.getElementById('closeIssueModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    const deleteBtn = document.getElementById('deleteIssueRequestBtn');

    if (deleteBtn) {
        deleteBtn.onclick = async () => {
            const issueId = document.getElementById('issueId')?.value;

            if (!issueId) {
                alert("[ERR-DELETE] No issue selected.");
                return;
            }

            const confirmed = confirm("Delete this issue permanently?");
            if (!confirmed) return;

            const result = await import('./view_5_data.js')
                .then(m => m.deleteFacilityIssue(issueId));

            if (!result?.success) {
                alert("[ERR-DELETE] Failed to delete issue.");
                return;
            }

            modal.style.display = 'none';

            if (renderFacilityIssuesFn) {
                await renderFacilityIssuesFn(facility);
            }
        };

        deleteBtn.style.display = 'block';
    }

    modal.style.display = 'flex';
}

export async function openIssueModal(facility, issue = null, contactReporter = null) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    activeIssueForFollowups = issue;

    const elIssueId = document.getElementById('issueId');
    const elIssueTitle = document.getElementById('issueTitleInput');
    const elIssueDesc = document.getElementById('issueDescInput');
    const elIssuePriority = document.getElementById('issuePriorityInput');
    const elIssueStatus = document.getElementById('issueStatusInput');
    const elHiddenReporterName = document.getElementById('hiddenReporterName');
    const elHiddenReporterId = document.getElementById('hiddenReporterId');

    if (elIssueId) elIssueId.value = issue?.id || '';
    if (elIssueTitle) elIssueTitle.value = issue?.title || '';
    if (elIssueDesc) elIssueDesc.value = issue?.description || '';
    if (elIssuePriority) elIssuePriority.value = issue?.severity || 'Medium';
    if (elIssueStatus) elIssueStatus.value = issue?.status || 'Open';

    const repName = contactReporter?.name || issue?.reported_by || 'Staff';
    const repId = contactReporter?.id || issue?.linked_contact_id || '';

    if (elHiddenReporterName) elHiddenReporterName.value = repName;
    if (elHiddenReporterId) elHiddenReporterId.value = repId;

    const modalTitle = document.getElementById('issueModalTitle');
    if (modalTitle) {
        modalTitle.innerText = `Before Issue: Reported By ${repName}`;
    }

    const mediaContainer = document.getElementById('issue-image-container');
    if (mediaContainer) {
        mediaContainer.innerHTML = '';

        if (issue?.id) {
            renderImageManagerSection(mediaContainer, 'issue', issue.id, {
                facility,
                title: 'Issue Evidence Photos',
                onUploadSuccess: () => {
                    console.log("Photo synced.");
                }
            });
        } else {
            mediaContainer.innerHTML = `<p style="font-size:11px;color:#6b7280;font-style:italic;">Photos can be attached after creating the issue.</p>`;
        }
    }

    const deleteBtn = document.getElementById('deleteIssueRequestBtn');
    if (deleteBtn) {
        deleteBtn.style.display = issue?.id ? 'block' : 'none';
    }

    modal.style.display = 'flex';
}
