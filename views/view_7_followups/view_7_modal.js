/* =================================================
FILE: views/view_7_followups/view_7_modal.js
UPDATED: 2026-06-04 08:45:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { saveIssueFollowup } from './view_7_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupFollowupsEvents(facility, issue, renderIssueFollowupsFn) {
    const modal = document.getElementById('followupModal');

    function openBlankFollowupModal() {
        document.getElementById('followupId').value = '';
        document.getElementById('followupImageUrl').value = '';
        document.getElementById('actionTypeInput').value = 'Comment';
        document.getElementById('actionByInput').value = '';
        document.getElementById('descriptionInput').value = '';
        
        const modalTitle = document.getElementById('followupModalTitle');
        if (modalTitle) modalTitle.innerText = "Log Action Event";
        
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
        document.getElementById('actionByInput').value = followup.initiated_by_text || '';
        document.getElementById('descriptionInput').value = followup.followup_notes_text || '';

        const modalTitle = document.getElementById('followupModalTitle');
        if (modalTitle) modalTitle.innerText = "Modify Follow-up Entry";
        
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
                alert("Description text summary fields are required.");
                return;
            }

            // Cleanly look across all potential database field variants for original reporter name
            const originalReporter = issue?.reported_by || issue?.initiated_by || issue?.reported_by_text || 'Staff Member';

            // Carry original contact data into the row record mapping pipeline
            const payload = {
                related_issue: issue.id,
                followup_title: type,
                followup_notes_text: desc,
                initiated_by_text: by || 'Staff',
                reported_by_text: originalReporter,
                followup_image_url: imageUrl || null
            };

            const result = await saveIssueFollowup(payload, id || null);
            
            if (result.error) {
                alert("Could not sync followup metrics parameters.");
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
