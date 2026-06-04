/* =================================================
FILE: views/view_7_followups/view_7_modal.js
UPDATED: 2026-06-04 02:26:00 AM

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
        document.getElementById('actionTypeInput').value = 'Comment';
        document.getElementById('actionByInput').value = '';
        document.getElementById('descriptionInput').value = '';
        
        document.getElementById('followupModalTitle').innerText = "Log Action Event";
        document.getElementById('followup-image-section').style.display = 'none';
        modal.style.display = 'block';
    }

    window.openSelectedFollowupInModal = function(followup) {
        // 🌟 FIXED: Reading from real column keys
        document.getElementById('followupId').value = followup.id || '';
        document.getElementById('actionTypeInput').value = followup.followup_title || 'Comment';
        document.getElementById('actionByInput').value = followup.initiated_by_text || '';
        document.getElementById('descriptionInput').value = followup.followup_notes_text || '';

        document.getElementById('followupModalTitle').innerText = "Modify Follow-up Entry";
        
        const imageSection = document.getElementById('followup-image-section');
        const imageContainer = document.getElementById('followup-image-container');
        imageSection.style.display = 'block';
        imageContainer.innerHTML = '';
        
        renderImageManagerSection(imageContainer, 'followup', followup.id, { facility, title: 'Follow-up Photos' });
        modal.style.display = 'block';
    };

    if (document.getElementById('createNewFollowupBtn')) {
        document.getElementById('createNewFollowupBtn').onclick = openBlankFollowupModal;
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

            if (!desc) {
                alert("Description text summary fields are required.");
                return;
            }

            // 🌟 FIXED: Created payload matching actual database column layout names
            const payload = {
                related_issue: issue.id,
                followup_title: type,
                followup_notes_text: desc,
                initiated_by_text: by || 'Staff'
            };

            const result = await saveIssueFollowup(payload, id || null);
            
            if (result.error) {
                alert("Could not sync followup metrics parameters.");
                return;
            }

            const savedItem = result.data;
            if (savedItem) {
                document.getElementById('followupId').value = savedItem.id;
                document.getElementById('followupModalTitle').innerText = "Modify Follow-up Entry";
                
                const imageSection = document.getElementById('followup-image-section');
                const imageContainer = document.getElementById('followup-image-container');
                imageSection.style.display = 'block';
                imageContainer.innerHTML = '';
                
                renderImageManagerSection(imageContainer, 'followup', savedItem.id, { facility, title: 'Follow-up Photos' });
                alert("Followup activity recorded successfully!");
            }
        };
    }
}
