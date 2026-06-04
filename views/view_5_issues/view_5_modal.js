/* =================================================
FILE: views/view_5_issues/view_5_modal.js
UPDATED: 2026-06-04 07:22:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { saveFacilityIssue, deleteFacilityIssue } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';
import { fetchContacts } from '../view_3_contacts/view_3_data.js';

export function setupIssuesEvents(facility, renderFacilityIssuesFn, autoOpen = false, prefillData = null) {
    const modal = document.getElementById('issueModal');
    const deleteBtn = document.getElementById('deleteIssueBtn');
    
    // Helper function to populate the contact dropdown list dynamically
    async function populateContactDropdown(selectedValue = '') {
        const selectEl = document.getElementById('issueInitiatedBy');
        if (!selectEl) return;

        // Start with a default empty/unlisted option to support the custom intercept logic
        selectEl.innerHTML = '<option value="">-- Select Existing Contact (Or Leave Blank) --</option>';

        try {
            const contacts = await fetchContacts(facility.id);
            if (contacts && contacts.length > 0) {
                contacts.forEach(contact => {
                    const option = document.createElement('option');
                    option.value = contact.name;
                    option.textContent = `${contact.name} (${contact.role || 'Staff'})`;
                    selectEl.appendChild(option);
                });
            }
        } catch (err) {
            console.error("Could not populate contact drop box options:", err);
        }

        // Apply selected value or restore cached input parameters
        selectEl.value = selectedValue;
    }

    // Check if we are returning from a cached session draft state
    if (facility.cachedIssueForm) {
        document.getElementById('issueDescription').value = facility.cachedIssueForm.description || '';
        document.getElementById('issueStatus').value = facility.cachedIssueForm.status || 'Open';
        document.getElementById('issuePriority').value = facility.cachedIssueForm.priority || 'Medium';
        document.getElementById('issueId').value = facility.cachedIssueForm.id || '';
        
        populateContactDropdown(facility.cachedIssueForm.initiated_by || '');
        
        modal.style.display = 'block';
        if (deleteBtn) {
            deleteBtn.style.display = facility.cachedIssueForm.id ? 'block' : 'none';
        }
        delete facility.cachedIssueForm;
    }

    if (autoOpen) {
        openBlankIssueModal();
        if (prefillData && prefillData.initiated_by) {
            populateContactDropdown(prefillData.initiated_by);
        }
    }

    function openBlankIssueModal() {
        document.getElementById('issueId').value = '';
        document.getElementById('issueDescription').value = '';
        document.getElementById('issueStatus').value = 'Open';
        document.getElementById('issuePriority').value = 'Medium';
        
        populateContactDropdown('');

        document.getElementById('issueModalTitle').innerText = "File New Issue Report";
        document.getElementById('issueModalTimestamp').style.display = 'none';
        document.getElementById('issue-image-section').style.display = 'none';
        document.getElementById('issueFollowupsBtn').style.display = 'none';
        
        if (deleteBtn) {
            deleteBtn.style.display = 'none'; // Hide delete button for unsaved issues
        }
        modal.style.display = 'block';
    }

    window.openSelectedIssueInModal = function(issue) {
        const idValue = issue.id || issue.issue_id || '';
        document.getElementById('issueId').value = idValue;
        document.getElementById('issueDescription').value = issue.description || '';
        document.getElementById('issueStatus').value = issue.status || 'Open';
        document.getElementById('issuePriority').value = issue.severity || issue.priority || 'Medium';

        const targetContact = issue.reported_by || issue.initiated_by || '';
        populateContactDropdown(targetContact);

        document.getElementById('issueModalTitle').innerText = "Modify Issue Entry Fields";
        
        const timestampEl = document.getElementById('issueModalTimestamp');
        if (issue.created_at) {
            timestampEl.innerText = `Report Created On: ${new Date(issue.created_at).toLocaleString()}`;
            timestampEl.style.display = 'block';
        } else {
            timestampEl.style.display = 'none';
        }

        const imageSection = document.getElementById('issue-image-section');
        const imageContainer = document.getElementById('issue-image-container');
        imageSection.style.display = 'block';
        imageContainer.innerHTML = '';
        
        renderImageManagerSection(imageContainer, 'issue', idValue, { facility, title: 'Issue Photos' });
        
        document.getElementById('issueFollowupsBtn').style.display = 'block';
        
        if (deleteBtn) {
            deleteBtn.style.display = idValue ? 'block' : 'none'; // Show delete option for existing items
        }
        modal.style.display = 'block';
    };

    document.getElementById('createNewIssueBtn').onclick = openBlankIssueModal;

    document.getElementById('closeIssueModal').onclick = () => {
        modal.style.display = 'none';
        renderFacilityIssuesFn(facility);
    };

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', { facility });
        }
    };

    document.getElementById('issueFollowupsBtn').onclick = () => {
        const currentIssueId = document.getElementById('issueId').value;
        const currentDesc = document.getElementById('issueDescription').value;
        if (window.navigateTo && currentIssueId) {
            modal.style.display = 'none';
            window.navigateTo('view_7_followups', { 
                facility, 
                issue: { id: currentIssueId, title: currentDesc } 
            });
        }
    };

    // Permanent deletion logic block
    if (deleteBtn) {
        deleteBtn.onclick = async () => {
            const id = document.getElementById('issueId').value;
            if (!id) return;

            const confirmRemoval = confirm("Are you sure you want to permanently delete this issue and all connected historic logs? This action cannot be undone.");
            if (!confirmRemoval) return;

            const result = await deleteFacilityIssue(id);
            if (result && !result.error) {
                modal.style.display = 'none';
                showCustomAlert("✅ Removed", "The facility issue record has been successfully scrubbed.");
            } else {
                showCustomAlert("❌ Error", "Could not complete table removal due to relational database dependency constraints.");
            }
        };
    }

    // Save action implementation with inline interceptor for missing dynamic properties
    document.getElementById('saveIssueBtn').onclick = async () => {
        const id = document.getElementById('issueId').value;
        const desc = document.getElementById('issueDescription').value.trim();
        const initiatedBy = document.getElementById('issueInitiatedBy').value.trim();
        const status = document.getElementById('issueStatus').value;
        const priority = document.getElementById('issuePriority').value;

        if (!desc) {
            showCustomAlert("⚠️ Notice", "Issue Summary/Description is a required field.");
            return;
        }

        // REQUIRED CHECK: If field is null/blank, pop up custom intercept option prompt
        if (!initiatedBy) {
            modal.style.display = 'none';
            
            const app = document.getElementById('app');
            const overlay = document.createElement('div');
            overlay.id = 'reportedByValidationOverlay';
            overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; display:flex; justify-content:center; align-items:center; font-family:Arial, sans-serif; padding:15px; box-sizing:border-box;';
            
            overlay.innerHTML = `
                <div style="background:white; border-radius:12px; max-width:400px; width:100%; padding:24px; box-shadow:0 10px 25px rgba(0,0,0,0.25); text-align:center; box-sizing:border-box;">
                    <div style="font-size:36px; margin-bottom:10px;">👤</div>
                    <h3 style="margin:0 0 8px 0; color:#00264d; font-size:18px;">Reported By Required</h3>
                    <p style="margin:0 0 20px 0; font-size:13px; color:#4b5563; line-height:1.4;">
                        Who submitted this report? Choose an attribute below or create an entry profile in the directory system.
                    </p>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button id="optReportByMDBtn" style="background:#00264d; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase;">🛠️ Report by MD for Maintenance</button>
                        <button id="optAddNewContactBtn" style="background:#28a745; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase;">➕ Add New Contact</button>
                        <button id="optCancelValidationBtn" style="background:#e5e7eb; color:#1f2937; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px;">Cancel</button>
                    </div>
                </div>
            `;
            app.appendChild(overlay);

            // Handle choice 1: Save with "MD" automatically loaded
            document.getElementById('optReportByMDBtn').onclick = async () => {
                app.removeChild(overlay);
                document.getElementById('issueInitiatedBy').value = "MD";
                modal.style.display = 'block';
                await performSaveOperation(id, desc, "MD", status, priority);
            };

            // Handle choice 2: Bypass directory contact grid list and target form directly
            document.getElementById('optAddNewContactBtn').onclick = () => {
                app.removeChild(overlay);
                if (window.navigateTo) {
                    window.navigateTo('view_3_contacts', {
                        facility: facility,
                        openFormInstantly: true,
                        cachedIssueForm: { id, description: desc, status, priority }
                    });
                }
            };

            // Handle choice 3: Gracefully close overlay prompt
            document.getElementById('optCancelValidationBtn').onclick = () => {
                app.removeChild(overlay);
                modal.style.display = 'block';
            };

            return;
        }

        await performSaveOperation(id, desc, initiatedBy, status, priority);
    };

    async function performSaveOperation(id, desc, initiatedBy, status, priority) {
        const payload = {
            facility_id: facility.id,
            description: desc,
            initiated_by: initiatedBy,
            status: status,
            priority: priority
        };

        const result = await saveFacilityIssue(payload, id || null);
        
        if (result.error) {
            showCustomAlert("❌ Error", "Could not synchronize maintenance record metrics.");
            return;
        }

        const savedItem = result.data;
        if (savedItem) {
            document.getElementById('issueId').value = savedItem.id;
            document.getElementById('issueModalTitle').innerText = "Modify Issue Entry Fields";
            
            const imageSection = document.getElementById('issue-image-section');
            const imageContainer = document.getElementById('issue-image-container');
            imageSection.style.display = 'block';
            imageContainer.innerHTML = '';
            
            renderImageManagerSection(imageContainer, 'issue', savedItem.id, { facility, title: 'Issue Photos' });
            document.getElementById('issueFollowupsBtn').style.display = 'block';
            
            if (deleteBtn) {
                deleteBtn.style.display = 'block';
            }
            
            showCustomAlert("✅ Success", "Facility issue log updated successfully!");
        }
    }

    function showCustomAlert(title, message) {
        const alertModal = document.getElementById('customAlertModal');
        const alertTitle = document.getElementById('alertTitle');
        const alertMessage = document.getElementById('alertMessage');
        const alertCloseBtn = document.getElementById('alertCloseBtn');
        const alertIcon = document.getElementById('alertIcon');

        if (alertModal && alertTitle && alertMessage && alertCloseBtn) {
            alertTitle.innerText = title;
            alertMessage.innerText = message;
            alertIcon.innerText = title.includes("Success") || title.includes("Removed") ? "🎉" : "⚠️";
            alertModal.style.display = 'flex';
            
            alertCloseBtn.onclick = () => {
                alertModal.style.display = 'none';
                renderFacilityIssuesFn(facility);
            };
        } else {
            alert(message);
            renderFacilityIssuesFn(facility);
        }
    }
}
