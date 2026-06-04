/* =================================================
FILE: views/view_7_followups/view_7_modal.js
UPDATED: 2026-06-04 02:02:00 AM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { saveIssueFollowup, deleteIssueFollowup } from './view_7_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupFollowupsEvents(facility, issue, renderIssueFollowupsFn) {
    const modal = document.getElementById('followupModal');
    const deleteBtn = document.getElementById('deleteFollowupBtn');

    function openBlankFollowupModal() {
        document.getElementById('followupId').value = '';
        document.getElementById('actionTypeInput').value = 'Comment';
        document.getElementById('actionByInput').value = '';
        document.getElementById('descriptionInput').value = '';
        
        document.getElementById('followupModalTitle').innerText = "Log Action Event";
        document.getElementById('followup-image-section').style.display = 'none';
        
        if (deleteBtn) {
            deleteBtn.style.display = 'none'; // Hide delete for unsaved entries
        }
        modal.style.display = 'block';
    }

    window.openSelectedFollowupInModal = function(followup) {
        const idValue = followup.id || '';
        document.getElementById('followupId').value = idValue;
        document.getElementById('actionTypeInput').value = followup.action_type || 'Comment';
        document.getElementById('actionByInput').value = followup.action_by || '';
        document.getElementById('descriptionInput').value = followup.description || '';

        document.getElementById('followupModalTitle').innerText = "Modify Follow-up Entry";
        
        const imageSection = document.getElementById('followup-image-section');
        const imageContainer = document.getElementById('followup-image-container');
        imageSection.style.display = 'block';
        imageContainer.innerHTML = '';
        
        renderImageManagerSection(imageContainer, 'followup', idValue, { facility, title: 'Follow-up Photos' });
        
        if (deleteBtn) {
            deleteBtn.style.display = idValue ? 'block' : 'none'; // Show delete for existing records
        }
        modal.style.display = 'block';
    };

    // Correctly routes button activation hooks
    const addBtn = document.getElementById('addNewFollowupBtn');
    if (addBtn) {
        addBtn.onclick = openBlankFollowupModal;
    }

    document.getElementById('closeFollowupModal').onclick = () => {
        modal.style.display = 'none';
        renderIssueFollowupsFn(facility, issue);
    };

    // Permanent removal action listener implementation
    if (deleteBtn) {
        deleteBtn.onclick = async () => {
            const id = document.getElementById('followupId').value;
            if (!id) return;

            const confirmRemoval = confirm("Are you sure you want to permanently delete this action entry log? This cannot be undone.");
            if (!confirmRemoval) return;

            // Make sure view_7_data.js exports deleteIssueFollowup
            const result = await deleteIssueFollowup(id);
            if (result && (result.success || !result.error)) {
                modal.style.display = 'none';
                alert("Activity entry log removed successfully.");
                renderIssueFollowupsFn(facility, issue);
            } else {
                alert("Could not complete removal transaction parameters.");
            }
        };
    }

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
            
            if (deleteBtn) {
                deleteBtn.style.display = 'block';
            }
            alert("Followup activity recorded successfully!");
        }
    };
}
