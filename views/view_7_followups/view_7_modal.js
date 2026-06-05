/* =================================================
FILE: views/view_7_followups/view_7_modal.js
UPDATED: 2026-06-04 08:05:00 PM

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
        
        const modalTitle = document.getElementById('followupModalTitle');
        if (modalTitle) modalTitle.innerText = "Log Action Event";
        
        const imgSec = document.getElementById('followup-image-section');
        if (imgSec) imgSec.style.display = 'none';
        
        modal.style.display = 'block';
    }

    window.openSelectedFollowupInModal = function(followup) {
        document.getElementById('followupId').value = followup.id || '';
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
            renderImageManagerSection(imageContainer, 'followup', followup.id, { facility, title: 'Follow-up Photos' });
        }
        modal.style.display = 'block';
    };

    // 🌟 FIXED: Target the correct ID rendered on the grid view layout ('addNewFollowupBtn')
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

            if (!desc) {
                alert("Description text summary fields are required.");
                return;
            }

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

            modal.style.display = 'none'; 
            alert("Followup activity recorded successfully!");
            
            // 🌟 FIXED: Re-render list immediately upon successful submission loop context
            renderIssueFollowupsFn(facility, issue);
        };
    }
}
