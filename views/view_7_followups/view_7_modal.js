/* =================================================
FILE: views/view_7_followups/view_7_modal.js
UPDATED: 2026-06-04 01:15:00 AM

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
        document.getElementById('followupId').value = followup.id || '';
        document.getElementById('actionTypeInput').value = followup.action_type || 'Comment';
        document.getElementById('actionByInput').value = followup.action_by || '';
        document.getElementById('descriptionInput').value = followup.description || '';

        document.getElementById('followupModalTitle').innerText = "Modify Follow-up Entry";
        
        const imageSection = document.getElementById('followup-image-section');
        const imageContainer = document.getElementById('followup-image-container');
        imageSection.style.display = 'block';
        imageContainer.innerHTML = '';
        
        renderImageManagerSection(imageContainer, 'followup', followup.id, { facility, title: 'Follow-up Photos' });
        modal.style.display = 'block';
    };

    // FIXED: Corrected target reference to match template ID 'addNewFollowupBtn'
    const addBtn = document.getElementById('addNewFollowupBtn');
    if (addBtn) {
        addBtn.onclick = openBlankFollowupModal;
    }

    const closeBtn = document.getElementById('closeFollowupModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            renderIssueFollowupsFn(facility, issue);
        };
    }

    // FIXED: Corrected target reference to match template ID 'backToIssuesBtn'
    const backBtn = document.getElementById('backToIssuesBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_5_issues', { facility });
            }
        };
    }

    const saveBtn = document.getElementById('saveFollowupBtn');
    if (saveBtn) {
        saveBtn.onclick = async () => {
            const id = document.getElementById('followupId').value;
            const type = document.getElementById('actionTypeInput').value;
            const desc = document.getElementById('descriptionInput').value.trim();
            const by = document.getElementById('actionByInput').value.trim();

            if (!desc) {
                alert("Description text summary fields are required.");
                return;
            }

            const payload = {
                issue_id: issue.id,
                action_type: type,
                description: desc,
                action_by: by || 'Staff',
                timestamp: new Date().toISOString()
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
