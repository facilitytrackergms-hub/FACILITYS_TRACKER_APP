/* =================================================
FILE: views/view_5_issues/view_5_modal.js
UPDATED: 2026-06-05 12:20:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { saveFacilityIssue, fetchFacilityContacts, insertFacilityContact } from './view_5_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

/**
 * Main event initialization for View 5 Modals.
 * Fully exported to match what view_5_grid.js imports.
 */
export function setupIssuesEvents(facility, renderFacilityIssuesFn) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    // 1. Setup the Add Contact Inline Click
    const addContactLink = document.getElementById('addInlineContactLink');
    if (addContactLink) {
        addContactLink.onclick = async (e) => {
            e.preventDefault();
            const name = prompt("Enter Contact Name:");
            if (!name) return;
            const role = prompt("Enter Contact Role (e.g. Manager, Tenant):") || 'Staff';

            const newContact = await insertFacilityContact({
                facility_id: facility.id,
                name: name,
                role: role
            });

            if (newContact) {
                await populateContactDropdown(facility.id, newContact.id);
            } else {
                alert("Could not save new contact parameter.");
            }
        };
    }

    // 2. Setup the Save Issue Click with explicit empty title validation warning pop-up
    const saveBtn = document.getElementById('saveIssueBtn');
    if (saveBtn) {
        saveBtn.onclick = async () => {
            const issueId = document.getElementById('issueId').value;
            const title = document.getElementById('issueTitleInput').value.trim();
            const desc = document.getElementById('issueDescInput').value.trim();
            const priority = document.getElementById('issuePriorityInput').value;
            const status = document.getElementById('issueStatusInput').value;
            const contactSelect = document.getElementById('issueContactSelect');
            const selectedContactId = contactSelect ? contactSelect.value : null;

            // Strict Validation: check for empty title box first and throw warning pop-up alert
            if (!title) {
                alert("⚠️ WARNING: The Issue Request Title cannot be left empty. Please input a specific title description before saving.");
                return;
            }

            if (!desc) {
                alert("Please fill out the Description field.");
                return;
            }

            let reportedByName = 'Staff';
            if (contactSelect && contactSelect.selectedIndex > 0) {
                reportedByName = contactSelect.options[contactSelect.selectedIndex].text.split('(')[0].trim();
            }

            const payload = {
                facility_id: facility.id,
                title: title,
                description: desc,
                priority: priority,
                status: status,
                initiated_by: reportedByName,
                reported_by: reportedByName
            };

            const result = await saveFacilityIssue(payload, issueId || null, selectedContactId);

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

    // 3. Setup Close Button click listeners
    const closeBtn = document.getElementById('closeIssueModal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
}

/**
 * Shared utility helper function to open the modal context cleanly.
 * Populates fields for updating or clears them completely for a new entry.
 */
export async function openIssueModal(facility, issue = null, preselectContactId = null) {
    const modal = document.getElementById('issueModal');
    if (!modal) return;

    // Reset inputs or set them to values of current issue object parameters
    // CHANGED: Title textbox is strictly empty string by default
    document.getElementById('issueId').value = issue?.id || '';
    document.getElementById('issueTitleInput').value = issue?.title || ''; 
    document.getElementById('issueDescInput').value = issue?.description || '';
    document.getElementById('issuePriorityInput').value = issue?.severity || 'Medium';
    document.getElementById('issueStatusInput').value = issue?.status || 'Open';

    const modalTitle = document.getElementById('issueModalTitle');
    if (modalTitle) {
        modalTitle.innerText = issue ? "Modify Issue Parameters" : "Create Maintenance Request";
    }

    // Determine target contact ID to select by default inside dropdown selection sequence
    const targetContactSelection = issue ? (issue.linked_contact_id || null) : preselectContactId;

    // Load available dynamic dropdown items matching current facility ID
    await populateContactDropdown(facility.id, targetContactSelection);

    // Initialize the associated multimedia attachment management pipeline frame elements
    const mediaContainer = document.getElementById('issue-image-container');
    if (mediaContainer) {
        mediaContainer.innerHTML = '';
        if (issue?.id) {
            renderImageManagerSection(mediaContainer, 'issue', issue.id, {
                facility,
                title: 'Issue Evidence Photos',
                onUploadSuccess: () => {
                    console.log("Photo synced to asset storage bucket.");
                }
            });
        } else {
            mediaContainer.innerHTML = `<p style="font-size:11px; color:#6b7280; font-style:italic; margin:0;">Photos can be attached after creating the issue.</p>`;
        }
    }

    modal.style.display = 'block';
}

/**
 * Internal helper to safely bind structural dynamic contact records to dropdown picklist elements
 */
async function populateContactDropdown(facilityId, selectedContactId = null) {
    const contactSelect = document.getElementById('issueContactSelect');
    if (!contactSelect) return;

    contactSelect.innerHTML = '<option value="">-- Choose/Assign Reporter --</option>';
    const contacts = await fetchFacilityContacts(facilityId);

    if (contacts && contacts.length > 0) {
        contacts.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.text = `${c.name} (${c.role || 'Staff'})`;
            if (selectedContactId && parseInt(c.id, 10) === parseInt(selectedContactId, 10)) {
                opt.selected = true;
            }
            contactSelect.appendChild(opt);
        });
    }
}
