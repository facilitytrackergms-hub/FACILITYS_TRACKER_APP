/* =================================================
FILE: views/view_5_issues/view_5_modal.js
UPDATED: 2026-06-05 03:40:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { saveFacilityIssue } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupIssuesEvents(facility, renderFacilityIssuesFn) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    // Handle jumping to create contact while preserving typed inputs
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
                    facility: facility,
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
                alert("⚠️ WARNING: The Issue Request Title cannot be left empty.");
                return;
            }
            if (!desc) {
                alert("Please fill out the Description field.");
                return;
            }

            const payload = {
                facility_id: facility.id,
                title: title,
                description: desc,
                priority: priority,
                status: status,
                initiated_by: reporterName || 'Staff',
                reported_by: reporterName || 'Staff'
            };

            const result = await saveFacilityIssue(payload, issueId || null, reporterId || null);
            if (result.error) {
                alert("Failed to save issue details.");
                return;
            }

            modal.style.display = 'none';
            if (renderFacilityIssuesFn) {
                await renderFacilityIssuesFn(facility);
            }
        };
    }

    const closeBtn = document.getElementById('closeIssueModal');
    if (closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; };
    }
}

export async function openIssueModal(facility, issue = null, contactReporter = null) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    // Defensive references to catch missing DOM elements safely
    const elIssueId = document.getElementById('issueId');
    const elIssueTitle = document.getElementById('issueTitleInput');
    const elIssueDesc = document.getElementById('issueDescInput');
    const elIssuePriority = document.getElementById('issuePriorityInput');
    const elIssueStatus = document.getElementById('issueStatusInput');
    const elHiddenReporterName = document.getElementById('hiddenReporterName');
    const elHiddenReporterId = document.getElementById('hiddenReporterId');

    // Load either database variables or active wizard drafts safely
    if (elIssueId) elIssueId.value = issue?.id || '';
    if (elIssueTitle) elIssueTitle.value = issue?.title || ''; 
    if (elIssueDesc) elIssueDesc.value = issue?.description || '';
    if (elIssuePriority) elIssuePriority.value = issue?.severity || 'Medium';
    if (elIssueStatus) elIssueStatus.value = issue?.status || 'Open';

    // Store profile reference hooks invisibly
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
                onUploadSuccess: () => { console.log("Photo synced."); }
            });
        } else {
            mediaContainer.innerHTML = `<p style="font-size:11px; color:#6b7280; font-style:italic; margin:0;">Photos can be attached after creating the issue.</p>`;
        }
    }

    const deleteBtn = document.getElementById('deleteIssueRequestBtn');
    if (deleteBtn) {
        deleteBtn.style.display = issue?.id ? 'block' : 'none';
    }
    
    modal.style.display = 'block';
}
