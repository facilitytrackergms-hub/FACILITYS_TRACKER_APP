/*================================================================
FACILITY_TRACKER_APP - CODEBASE EXECUTION PARAMETERS
================================================================
DESCRIPTION: The following parameters govern how the attached source 
code file must be processed, updated, and formatted upon output.

1. PROCESS COMPLIANCE: Apply all structural constraints outlined below during code modification.

2. MISSING METADATA HANDLING: If any fields in a FILE METADATA block are generic placeholders or missing, analyze the provided source code below to determine the correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly at the prompt text or comments for the exact sequential filename (e.g., view_2_data.js). NEVER invent, guess, or substitute a descriptive semantic name (like facility_data_service.js) based on the code context. If the exact filename cannot be verified, leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any parameters in this header block unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to make a fix work, explicitly state *why* in the text response before showing the code block.

7. CODE COMPLETENESS: Provide the full updated function or file so nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag identifying its source file, last update date, and time. If missing, add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of an existing file unless the current code is fully pasted into the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom notifications. Always add a distinct, visible ID or tag to the message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, including this header and all rules, wrapped completely inside a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields in this header (File Name, Table, View, Title, Date, Time) are fully updated and preserved at the top of the file.
================================================================*/
/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid_logic.js
SUPABASE TBL : contacts
VIEW NAME    : Directory Entries
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-06 @ 11:30 PM
================================================================*/

import { fetchContacts, insertContact } from './view_3_data.js';
import { insertFacilityIssue } from '../view_5_issues/view_5_data.js';

let localContactsList = [];
let activeSelectedContact = null;
let viewContext = {};

export async function initializeGridLogic(context) {
    viewContext = context;
    console.log("Initializing Contacts View Logic Layer with payload context:", viewContext);

    // Initial table refresh data fetch operations boundary
    if (viewContext.facility?.id) {
        localContactsList = await fetchContacts(viewContext.facility.id);
        renderGrid(localContactsList);
    }

    setupFormActionListeners();
    setupMediaCaptureHooks();

    // INTERCEPT: If coming from the Maintenance Request View fallback creation trigger
    if (viewContext.openFormInstantly && viewContext.prefilledContactName) {
        const contactModal = document.getElementById('contactFormModal');
        const manualContactName = document.getElementById('manualContactName');
        const manualContactRole = document.getElementById('manualContactRole');
        const manualContactPhone = document.getElementById('manualContactPhone');
        const manualContactEmail = document.getElementById('manualContactEmail');
        const manualContactNotes = document.getElementById('manualContactNotes');
        const hiddenImageInput = document.getElementById('manualContactImageBase64');
        const cameraStatusText = document.getElementById('cameraStatusText');

        if (contactModal && manualContactName) {
            // Clear all fields out of the shared form state
            manualContactName.value = viewContext.prefilledContactName;
            if (manualContactRole) manualContactRole.value = '';
            if (manualContactPhone) manualContactPhone.value = '';
            if (manualContactEmail) manualContactEmail.value = '';
            if (manualContactNotes) manualContactNotes.value = '';
            if (hiddenImageInput) hiddenImageInput.value = '';
            if (cameraStatusText) {
                cameraStatusText.textContent = "No capture stream active";
                cameraStatusText.style.color = "#9ca3af";
            }
            
            // Pop the Create Directory Entry box open instantly
            contactModal.style.display = 'flex';
        }
    }
}

function renderGrid(contacts) {
    const gridBody = document.getElementById('contactsGridBody');
    if (!gridBody) return;

    gridBody.innerHTML = '';

    if (!contacts || contacts.length === 0) {
        gridBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#9ca3af;">No workspace contact records active inside this facility directory.</td></tr>`;
        return;
    }

    contacts.forEach(contact => {
        const tr = document.createElement('tr');
        tr.className = 'contacts-grid-row';
        tr.onclick = () => showContactProfile(contact);

        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <img class="contact-avatar-badge" src="${contact.avatar_url || 'https://via.placeholder.com/40'}" alt="Avatar">
                    <div class="contact-cell-primary">${contact.contact_name || 'N/A'}</div>
                </div>
            </td>
            <td><span class="contact-role-pill">${contact.role || 'General'}</span></td>
            <td class="contact-cell-secondary">${contact.phone || 'N/A'}</td>
            <td class="contact-cell-secondary">${contact.email || 'N/A'}</td>
        `;
        gridBody.appendChild(tr);
    });
}

function showContactProfile(contact) {
    activeSelectedContact = contact;
    
    const panel = document.getElementById('contactDetailPanel');
    const placeholder = document.getElementById('contactPanelPlaceholder');
    
    if (!panel || !placeholder) return;

    document.getElementById('detailAvatar').src = contact.avatar_url || 'https://via.placeholder.com/90';
    document.getElementById('detailName').textContent = contact.contact_name || 'Contact Profile';
    document.getElementById('detailRole').textContent = contact.role || 'General Staff';
    document.getElementById('detailPhone').textContent = contact.phone || 'None Registered';
    document.getElementById('detailEmail').textContent = contact.email || 'None Registered';
    document.getElementById('detailNotes').textContent = contact.notes || 'No extended internal operational summaries submitted.';

    placeholder.style.display = 'none';
    panel.style.display = 'block';
}

function hideContactProfile() {
    activeSelectedContact = null;
    const panel = document.getElementById('contactDetailPanel');
    const placeholder = document.getElementById('contactPanelPlaceholder');
    
    if (panel) panel.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
}

function setupFormActionListeners() {
    const addContactTriggerBtn = document.getElementById('addContactTriggerBtn');
    const cancelContactModalBtn = document.getElementById('cancelContactModalBtn');
    const saveContactBtn = document.getElementById('saveContactBtn');
    const contactModal = document.getElementById('contactFormModal');

    const manualContactName = document.getElementById('manualContactName');
    const manualContactRole = document.getElementById('manualContactRole');
    const manualContactPhone = document.getElementById('manualContactPhone');
    const manualContactEmail = document.getElementById('manualContactEmail');
    const manualContactNotes = document.getElementById('manualContactNotes');
    const hiddenImageInput = document.getElementById('manualContactImageBase64');
    const cameraStatusText = document.getElementById('cameraStatusText');

    if (addContactTriggerBtn) {
        addContactTriggerBtn.onclick = () => {
            manualContactName.value = '';
            if (manualContactRole) manualContactRole.value = '';
            if (manualContactPhone) manualContactPhone.value = '';
            if (manualContactEmail) manualContactEmail.value = '';
            if (manualContactNotes) manualContactNotes.value = '';
            if (hiddenImageInput) hiddenImageInput.value = '';
            if (cameraStatusText) {
                cameraStatusText.textContent = "No capture stream active";
                cameraStatusText.style.color = "#9ca3af";
            }
            contactModal.style.display = 'flex';
        };
    }

    if (cancelContactModalBtn) {
        cancelContactModalBtn.onclick = () => {
            contactModal.style.display = 'none';
        };
    }

    if (saveContactBtn) {
        saveContactBtn.onclick = async () => {
            const nameValue = manualContactName.value.trim();
            const roleValue = manualContactRole?.value.trim() || '';
            const phoneValue = manualContactPhone?.value.trim() || '';
            const emailValue = manualContactEmail?.value.trim() || '';
            const notesValue = manualContactNotes?.value.trim() || '';
            const imgBase64 = hiddenImageInput?.value || null;

            if (!nameValue) {
                alert("Profile contact name tracking context is required.");
                return;
            }

            const payload = {
                facility_id: viewContext.facility?.id,
                contact_name: nameValue,
                role: roleValue,
                phone: phoneValue,
                email: emailValue,
                notes: notesValue,
                avatar_url: imgBase64
            };

            const savedContact = await insertContact(payload);

            if (savedContact) {
                contactModal.style.display = 'none';
                
                // BACKWARDS TIE-IN LOGIC: If a pending issue exists from the workflow interception
                if (viewContext.pendingIssueData) {
                    try {
                        // Link the newly generated contact ID right to the issue record
                        viewContext.pendingIssueData.contact_id = savedContact.id;
                        
                        await insertFacilityIssue(viewContext.pendingIssueData);
                    } catch (issueErr) {
                        console.error("Failed executing automated backwards issue registration:", issueErr);
                    }
                    
                    // Bounce cleanly back to the maintenance requests view screen with records saved
                    if (window.navigateTo) {
                        window.navigateTo('view_5_issues', { facility: viewContext.facility });
                        return;
                    }
                }

                // Default standard table refresh fallback if normal creation loop
                localContactsList = await fetchContacts(viewContext.facility?.id);
                renderGrid(localContactsList);
                hideContactProfile();
            } else {
                alert("Failed to submit directory profile record entry.");
            }
        };
    }
}

function setupMediaCaptureHooks() {
    const cameraTriggerBtn = document.getElementById('cameraTriggerBtn');
    const cameraFileInput = document.getElementById('cameraFileInput');
    const cameraStatusText = document.getElementById('cameraStatusText');
    const hiddenImageInput = document.getElementById('manualContactImageBase64');

    if (cameraTriggerBtn && cameraFileInput) {
        cameraTriggerBtn.addEventListener('click', () => {
            cameraFileInput.click();
        });

        cameraFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    if (hiddenImageInput) {
                        hiddenImageInput.value = evt.target.result;
                    }
                    if (cameraStatusText) {
                        cameraStatusText.textContent = "Photo captured successfully";
                        cameraStatusText.style.color = "#10b981";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    setupContactsEvents({
        facilityId: viewContext.facility?.id,
        onRefresh: async () => {
            localContactsList = await fetchContacts(viewContext.facility?.id);
            renderGrid(localContactsList);
            hideContactProfile();
        },
        getActiveSelected: () => activeSelectedContact
    });
}

export function setupContactsEvents(config) {
    console.log("Contacts module telemetry events loaded.", config);
}
