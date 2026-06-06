/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_7_modal.js
SUPABASE TBL : issue_followups
VIEW NAME    : Log Action Event / Modify Follow-up Entry
POP-UP TITLE : Follow-up Entry Modal
LAST UPDATED : 2026-06-06 @ 05:09 AM
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
const __FILENAME = 'view_7_modal.js';
import { saveIssueFollowup } from './view_7_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupFollowupsEvents(facility, issue, renderIssueFollowupsFn) {
    const modal = document.getElementById('followupModal');

    // Cleanly look across all potential database field variants for original reporter name
    const originalReporter = issue?.reported_by || issue?.initiated_by || issue?.reported_by_text || 'Staff Member';

    // Helper function to append or update UI identifier tags dynamically (Rule 8)
    function applyUIIdentifierTag(titleElement) {
        if (!titleElement) return;
        let infoTag = document.getElementById('view_7_modal_ui_tag');
        if (!infoTag) {
            infoTag = document.createElement('div');
            infoTag.id = 'view_7_modal_ui_tag';
            infoTag.style.fontSize = '10px';
            infoTag.style.color = '#888';
            infoTag.style.marginTop = '4px';
            titleElement.appendChild(infoTag);
        }
        infoTag.innerText = `Source: ${__FILENAME} | Updated: 2026-06-06 05:09 AM`;
    }

    function openBlankFollowupModal() {
        document.getElementById('followupId').value = '';
        document.getElementById('followupImageUrl').value = '';
        document.getElementById('actionTypeInput').value = 'Comment';
        document.getElementById('actionByInput').value = originalReporter;
        document.getElementById('descriptionInput').value = '';
        
        const modalTitle = document.getElementById('followupModalTitle');
        if (modalTitle) {
            modalTitle.innerText = "Log Action Event";
            applyUIIdentifierTag(modalTitle);
        }
        
        const imgSec = document.getElementById('followup-image-section');
        const imgCont = document.getElementById('followup-image-container');
        if (imgSec && imgCont) {
            imgSec.style.display = 'block';
            imgCont.innerHTML = '';
            // Pass unique placeholder ID to capture image before row generation
            const tempId = 'temp-' + Date.now();
            renderImageManagerSection(imgCont, 'followup', tempId, { 
                facility, 
                title: 'Capture Follow-up Photo',
                onUploadSuccess: (url) => {
                    document.getElementById('followupImageUrl').value = url;
                }
            });
        }
        modal.style.display = 'block';
    }

    window.openSelectedFollowupInModal = function(followup) {
        document.getElementById('followupId').value = followup.id || '';
        document.getElementById('followupImageUrl').value = followup.followup_image_url || '';
        document.getElementById('actionTypeInput').value = followup.followup_title || 'Comment';
        document.getElementById('actionByInput').value = followup.initiated_by_text || originalReporter;
        document.getElementById('descriptionInput').value = followup.followup_notes_text || '';

        const modalTitle = document.getElementById('followupModalTitle');
        if (modalTitle) {
            modalTitle.innerText = "Modify Follow-up Entry";
            applyUIIdentifierTag(modalTitle);
        }
        
        const imageSection = document.getElementById('followup-image-section');
        const imageContainer = document.getElementById('followup-image-container');
        if (imageSection && imageContainer) {
            imageSection.style.display = 'block';
            imageContainer.innerHTML = '';
            renderImageManagerSection(imageContainer, 'followup', followup.id, { 
                facility, 
                title: 'Follow-up Photos',
                onUploadSuccess: (url) => {
                    document.getElementById('followupImageUrl').value = url;
                }
            });
        }
        modal.style.display = 'block';
    };

    const addBtn = document.getElementById('addNewFollowupBtn') || document.getElementById('createNewFollowupBtn');
    if (addBtn) {
        addBtn.onclick = openBlankFollowupModal;
    }

    if (document.getElementById('closeFollowupModal')) {
        document.getElementById('closeFollowupModal').onclick = () => {
            modal.style.display = 'none';
            renderIssueFollowupsFn(facility, issue);
        };
    }

    if (document.getElementById('saveFollowupBtn')) {
        document.getElementById('saveFollowupBtn').onclick = async () => {
            const id = document.getElementById('followupId').value;
            const type = document.getElementById('actionTypeInput').value;
            const desc = document.getElementById('descriptionInput').value.trim();
            const by = document.getElementById('actionByInput').value.trim();
            const imageUrl = document.getElementById('followupImageUrl').value;

            if (!desc) {
                // Rule 10: Appended a distinct visible tag referencing its component context
                alert("[view_7_modal - Validation Error] Description text summary fields are required.");
                return;
            }

            // Carry original contact data into the row record mapping pipeline
            const payload = {
                related_issue: issue.id,
                followup_title: type,
                followup_notes_text: desc,
                initiated_by_text: by || originalReporter,
                reported_by_text: originalReporter,
                followup_image_url: imageUrl || null
            };

            const result = await saveIssueFollowup(payload, id || null);
            
            if (result.error) {
                // Rule 10: Appended a distinct visible tag referencing its component context
                alert("[view_7_modal - Sync Error] Could not sync followup metrics parameters.");
                return;
            }

            modal.style.display = 'none'; 
            
            // Re-render and hand off data cleanly to Custom Interactive Alert Prompts
            await renderIssueFollowupsFn(facility, issue);
            
            if (window.triggerNotificationPipelinePrompt && result.data) {
                window.triggerNotificationPipelinePrompt(result.data, issue);
            }
        };
    }
}
