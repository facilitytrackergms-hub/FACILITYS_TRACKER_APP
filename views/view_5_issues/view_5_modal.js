/* =================================================
FILE: views/view_5_issues/view_5_modal.js
UPDATED: 2026-06-03 09:10:00 AM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchFacilityContacts, insertFacilityContact, saveFacilityIssue } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupIssuesEvents(facility, renderFacilityIssuesFn, autoOpen, prefillData) {
    const modal = document.getElementById('issueModal');
    const alertModal = document.getElementById('customAlertModal');
    let activeContactsList = [];

    async function loadContactsCache() {
        activeContactsList = await fetchFacilityContacts(facility.id);
    }
    loadContactsCache();

    function showCustomAlert(title, message, icon = 'ℹ️') {
        document.getElementById('alertIcon').innerText = icon;
        document.getElementById('alertTitle').innerText = title;
        document.getElementById('alertMessage').innerText = message;
        alertModal.style.display = 'flex';
        return new Promise((resolve) => {
            document.getElementById('alertCloseBtn').onclick = () => {
                alertModal.style.display = 'none';
                resolve();
            };
        });
    }

    function openBlankModal(initialReporterName = '') {
        document.getElementById('issueId').value = '';
        document.getElementById('issueDescription').value = '';
        document.getElementById('issueInitiatedBy').value = initialReporterName;
        document.getElementById('issueStatus').value = 'Open';
        document.getElementById('issuePriority').value = 'Medium';
        
        document.getElementById('issueModalTitle').innerText = "File New Issue Report";
        document.getElementById('saveIssueBtn').innerText = "SUBMIT ISSUE REPORT";
        document.getElementById('issue-image-section').style.display = 'none';
        document.getElementById('issueFollowupsBtn').style.display = 'none';
        
        modal.style.display = 'block';
    }

    window.openSelectedIssueInModal = function(issue) {
        document.getElementById('issueId').value = issue.id || '';
        document.getElementById('issueDescription').value = issue.description || '';
        document.getElementById('issueInitiatedBy').value = issue.initiated_by || '';
        document.getElementById('issueStatus').value = issue.status || 'Open';
        document.getElementById('issuePriority').value = issue.priority || 'Medium';

        document.getElementById('issueModalTitle').innerText = "Modify Issue Entry Fields";
        document.getElementById('saveIssueBtn').innerText = "UPDATE INFO";
        
        const followupsBtn = document.getElementById('issueFollowupsBtn');
        followupsBtn.style.display = 'block';
        followupsBtn.onclick = () => {
            modal.style.display = 'none';
            if (window.navigateTo) {
                window.navigateTo('view_7_followups', { facility, issue });
            }
        };

        const imageContainer = document.getElementById('issue-image-container');
        document.getElementById('issue-image-section').style.display = 'block';
        imageContainer.innerHTML = '';
        
        renderImageManagerSection(imageContainer, 'issue', issue.id, { facility, title: 'Issue Photos' });
        
        modal.style.display = 'block';
    };

    document.getElementById('createNewIssueBtn').onclick = () => openBlankModal();

    document.getElementById('closeIssueModal').onclick = () => {
        modal.style.display = 'none';
        renderFacilityIssuesFn(facility);
    };

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', facility);
        }
    };

    document.getElementById('saveIssueBtn').onclick = async () => {
        const id = document.getElementById('issueId').value;
        const desc = document.getElementById('issueDescription').value.trim();
        const initiatedByName = document.getElementById('issueInitiatedBy').value.trim();
        const status = document.getElementById('issueStatus').value;
        const priority = document.getElementById('issuePriority').value;

        if (!desc) {
            await showCustomAlert("Validation Required", "Please enter an issue description summary text.", "⚠️");
            return;
        }

        const payload = {
            facility_id: facility.id,
            description: desc,
            initiated_by: initiatedByName || 'Staff',
            status: status,
            priority: priority,
            updated_at: new Date().toISOString()
        };

        if (!id) {
            payload.created_at = new Date().toISOString();
        }

        if (initiatedByName) {
            const match = activeContactsList.some(c => c.name && c.name.toLowerCase() === initiatedByName.toLowerCase());
            if (!match) {
                const confirmAdd = confirm(`The contact "${initiatedByName}" was not found in your directory list. Create a new entry row for them now?`);
                if (confirmAdd) {
                    await insertFacilityContact({
                        facility_id: facility.id,
                        name: initiatedByName,
                        role: 'Staff Participant Log'
                    });
                    await loadContactsCache();
                }
            }
        }

        const result = await saveFacilityIssue(payload, id || null);
        
        if (result.error) {
            await showCustomAlert("Error Saving", "Could not synchronize structural fields into cloud data table storage.", "❌");
            return;
        }

        const savedItem = result.data;
        if (savedItem) {
            document.getElementById('issueId').value = savedItem.id;
            document.getElementById('saveIssueBtn').innerText = "UPDATE INFO";
            
            const followupsBtn = document.getElementById('issueFollowupsBtn');
            followupsBtn.style.display = 'block';
            followupsBtn.onclick = () => {
                modal.style.display = 'none';
                if (window.navigateTo) {
                    window.navigateTo('view_7_followups', { facility, issue: savedItem });
                }
            };

            const imageSection = document.getElementById('issue-image-section');
            const imageContainer = document.getElementById('issue-image-container');
            imageSection.style.display = 'block';
            imageContainer.innerHTML = '';
            
            renderImageManagerSection(imageContainer, 'issue', savedItem.id, { facility, title: 'Issue Photos' });
            await showCustomAlert("Success Logged", "Issue tracked dataset fields saved successfully!", "✅");
        }
    };

    // Auto-open parsing trigger for contact-forwarded intents
    if (autoOpen && prefillData) {
        openBlankModal(prefillData.initiated_by);
    }
}
