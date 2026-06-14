/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_modal.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Modal
POP-UP TITLE : Issue Maintenance Request
LAST UPDATED : 2026-06-07 @ 09:35 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_5_modal.js';

let activeIssueForFollowups = null;

import { saveFacilityIssue } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupIssuesEvents(facility, renderFacilityIssuesFn) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    // Ensure metadata identifier block exists inside the UI layer (Rule 8)
    let metaLabel = document.getElementById('view-metadata-label');
    if (!metaLabel) {
        metaLabel = document.createElement('div');
        metaLabel.id = 'view-metadata-label';
        metaLabel.style.cssText = 'font-size: 10px; color: #9ca3af; padding: 4px 8px; text-align: right; border-top: 1px solid #e5e7eb;';
        modal.appendChild(metaLabel);
    }
    metaLabel.innerText = `Source: view_5_modal.js | Updated: 2026-06-07 09:35 AM`;

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

            // Unique tracking alerts configured per Rule 10
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
                title: title,
                description: desc,
                priority: priority,
                status: status,
                initiated_by: reporterName || 'Staff',
                reported_by: reporterName || 'Staff'
            };

            const result = await saveFacilityIssue(payload, issueId || null, reporterId || null);

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
                    facility: facility,
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
}

export async function openIssueModal(facility, issue = null, contactReporter = null) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    activeIssueForFollowups = issue;

    // Ensure metadata identifier block is kept accurate in the UI layout (Rule 8)
    let metaLabel = document.getElementById('view-metadata-label');
    if (!metaLabel) {
        metaLabel = document.createElement('div');
        metaLabel.id = 'view-metadata-label';
        metaLabel.style.cssText = 'font-size: 10px; color: #9ca3af; padding: 4px 8px; text-align: right; border-top: 1px solid #e5e7eb;';
        modal.appendChild(metaLabel);
    }
    metaLabel.innerText = `Source: view_5_modal.js | Updated: 2026-06-07 09:35 AM`;

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
                onUploadSuccess: () => {
                    console.log("Photo synced.");
                }
            });
        } else {
            mediaContainer.innerHTML = `<p style="font-size:11px; color:#6b7280; font-style:italic; margin:0;">Photos can be attached after creating the issue.</p>`;
        }
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
}
        deleteBtn.style.display = issue?.id ? 'block' : 'none';
    }

    modal.style.display = 'flex';
}
