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

7. CODE COMPLETENESS: Provide the full updated file or function so nothing gets omitted during formatting.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag identifying its source file, last update date, and time. If missing, add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of an existing file unless the current code is fully pasted into the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom notifications. Always add a distinct, visible ID or tag to the message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, including this parameter header, wrapped completely inside a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields in the active metadata block (File Name, Table, View, Title, Date, Time) are fully updated and preserved at the top of the file.

13. LINE COUNT CONSTRAINT & AUTOMATIC FILE SPLITTING (GIT-ALIGNED):
- Absolute Ceiling: The maximum allowable length for the entire single file is 350 lines to accommodate local editor line-wrapping and Git line-ending interpretations.
- Mandatory Pre-Check: BEFORE outputting any code block, the AI must explicitly print a "LINE COUNT AUDIT" in plain text containing: Raw Line Count (including this 53-line header), Git-Scaled Line Count (Raw x 1.5), and Split Decision Status.
- Empty Line & Wrap Accounting: When calculating the total line count, all empty lines, blank spacing, and visually wrapped or long string layout blocks must be accounted for using a 1.5x scaling margin to guarantee strict alignment with Git repositories.
- Split Trigger: The exact moment the total Git-Scaled Line Count reaches or exceeds 350 lines, processing MUST stop automatically. NO CODE BLOCK MAY BE GENERATED.
- Action Required: Explicitly flag the line count to the user, cite this constraint, and propose an even split plan aimed at creating two balanced files of approximately 175 lines each.
- User Confirmation: Wait for the user's explicit approval or division plan before outputting any code blocks.
================================================================*/
/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid_logic.js
SUPABASE TBL : contacts
VIEW NAME    : Facility Directory Logic
POP-UP TITLE : Manage Directory Entries
LAST UPDATED : 2026-06-06 @ 10:25 PM
================================================================*/
import { fetchContacts, insertContact as createContact, updateContact, deleteContact } from '../view_3_data.js';
import { fetchFacilityIssues } from '../../view_5_issues/view_5_data.js';

export async function initializeGridLogic(viewContext) {
    let localContactsList = [];
    let activeSelectedContact = null;

    const gridContainer = document.getElementById('contactsGridElement');
    const profilePane = document.getElementById('contactDetailPane');
    const directorySelectionLayout = document.getElementById('directorySelectionLayout');
    const backBtn = document.getElementById('backBtn');

    const modalShell = document.getElementById('manualContactModal');
    const openModalBtn = document.getElementById('manualContactTriggerBtn');
    const closeModalBtn = document.getElementById('cancelContactModalBtn');
    const saveContactBtn = document.getElementById('saveContactBtn');

    // Load directory details
    if (viewContext.facility?.id) {
        localContactsList = await fetchContacts(viewContext.facility.id);
        renderGrid(localContactsList);
    }

    function renderGrid(contacts) {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        if (!contacts || contacts.length === 0) {
            gridContainer.innerHTML = `<p style="grid-column: 1/-1; color:#6b7280; font-size:14px; font-style:italic; margin:10px 0;">No contacts added yet.</p>`;
            return;
        }

        contacts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'contact-thumbnail';
            
            const fallbackAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
            const displayPhoto = item.profile_photo_url || fallbackAvatar;

            card.innerHTML = `
                <img src="${displayPhoto}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; background:#e5e7eb;" />
                <div class="thumbnail-name">${item.contact_name || 'Unnamed Contact'}</div>
                <div class="thumbnail-role">${item.role_title || 'No Title'}</div>
            `;

            card.onclick = () => showContactProfile(item);
            gridContainer.appendChild(card);
        });
    }

    async function showContactProfile(contact) {
        activeSelectedContact = contact;
        if (!profilePane || !directorySelectionLayout) return;

        const fallbackAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
        
        document.getElementById('detailAvatar').src = contact.profile_photo_url || fallbackAvatar;
        document.getElementById('detailName').textContent = contact.contact_name || 'Unnamed Contact';
        document.getElementById('detailRole').textContent = contact.role_title || 'N/A';
        
        const phoneLink = document.getElementById('detailPhoneLink');
        phoneLink.textContent = contact.phone_number || 'N/A';
        phoneLink.href = contact.phone_number ? `tel:${contact.phone_number}` : '#';

        const emailLink = document.getElementById('detailEmailLink');
        emailLink.textContent = contact.email_address || 'N/A';
        emailLink.href = contact.email_address ? `mailto:${contact.email_address}` : '#';

        document.getElementById('detailNotes').textContent = contact.operational_notes || 'No operational notes provided.';

        directorySelectionLayout.style.display = 'none';
        if (backBtn) backBtn.style.display = 'none';
        profilePane.style.display = 'block';

        // Load contextual history reports matching this contact's name verbatim
        const targetHistoryContainer = document.getElementById('contactIssuesHistoryList');
        if (targetHistoryContainer && viewContext.facility?.id) {
            targetHistoryContainer.innerHTML = '<div style="font-size:12px; color:#6b7280; font-style:italic;">Querying reported issues...</div>';
            
            try {
                const allFacilityIssues = await fetchFacilityIssues(viewContext.facility.id);
                const matchedIssues = (allFacilityIssues || []).filter(issue => {
                    return String(issue.reported_by || '').trim().toLowerCase() === String(contact.contact_name || '').trim().toLowerCase();
                });

                targetHistoryContainer.innerHTML = '';
                if (matchedIssues.length === 0) {
                    targetHistoryContainer.innerHTML = '<div style="font-size:12px; color:#9ca3af; padding:5px 0;">No reported maintenance logs under this name.</div>';
                } else {
                    matchedIssues.forEach(issue => {
                        const issueActionBtn = document.createElement('button');
                        issueActionBtn.className = 'contacts-view-btn';
                        issueActionBtn.style.cssText = 'background:white; border:1px solid #d1d5db; border-radius:6px; padding:10px; margin-bottom:6px; display:flex; flex-direction:column; align-items:flex-start; width:100%; text-align:left; text-transform:none; font-weight:normal; font-family:Arial, sans-serif; cursor:pointer; box-sizing:border-box; box-shadow:0 1px 2px rgba(0,0,0,0.05);';
                        
                        issueActionBtn.innerHTML = `
                            <div style="font-weight:bold; color:#00264d; font-size:13px;">🛠️ ${issue.title || 'Untitled Request'}</div>
                            <div style="font-size:11px; color:#6b7280; margin-top:2px;">Status: <b style="color:#10b981;">${issue.status || 'Open'}</b></div>
                        `;

                        // Routes back to maintenance grid displaying detailed workflow context
                        issueActionBtn.onclick = () => {
                            if (window.navigateTo) {
                                window.navigateTo('view_5_issues', { facility: viewContext.facility });
                            }
                        };
                        targetHistoryContainer.appendChild(issueActionBtn);
                    });
                }
            } catch (err) {
                console.error("Contextual database parsing error:", err);
                targetHistoryContainer.innerHTML = '<div style="font-size:12px; color:#dc2626;">Failed to load history parameters.</div>';
            }
        }
    }

    function hideContactProfile() {
        activeSelectedContact = null;
        if (!profilePane || !directorySelectionLayout) return;

        profilePane.style.display = 'none';
        directorySelectionLayout.style.display = 'block';
        if (backBtn) backBtn.style.display = 'block';
    }

    if (document.getElementById('closeDetailPaneBtn')) {
        document.getElementById('closeDetailPaneBtn').onclick = hideContactProfile;
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) window.navigateTo('view_2_controls', { facility: viewContext.facility });
        };
    }

    // Modal Control Workflows
    if (openModalBtn && modalShell) {
        openModalBtn.onclick = () => {
            document.getElementById('modalTemplateTitle').textContent = "Create Directory Entry";
            document.getElementById('editingContactId').value = "";
            document.getElementById('manualContactImage').value = "";
            document.getElementById('manualContactName').value = "";
            document.getElementById('manualContactRole').value = "";
            document.getElementById('manualContactPhone').value = "";
            document.getElementById('manualContactEmail').value = "";
            document.getElementById('manualContactNotes').value = "";
            document.getElementById('cameraStatusText').textContent = "No photo captured";
            document.getElementById('cameraStatusText').style.color = "#6b7280";
            
            if (typeof window.attachModalStampTracker === 'function') {
                window.attachModalStampTracker();
            }
            modalShell.style.display = 'flex';
        };
    }

    if (closeModalBtn && modalShell) {
        closeModalBtn.onclick = () => { modalShell.style.display = 'none'; };
    }

    if (saveContactBtn && modalShell) {
        saveContactBtn.onclick = async () => {
            const contactId = document.getElementById('editingContactId').value;
            
            const payload = {
                facility_id: viewContext.facility?.id,
                contact_name: document.getElementById('manualContactName').value.trim(),
                role_title: document.getElementById('manualContactRole').value.trim(),
                phone_number: document.getElementById('manualContactPhone').value.trim(),
                email_address: document.getElementById('manualContactEmail').value.trim(),
                operational_notes: document.getElementById('manualContactNotes').value.trim(),
                profile_photo_url: document.getElementById('manualContactImage').value
            };

            if (!payload.contact_name) {
                alert("Please assign a contact name field baseline before saving.");
                return;
            }

            if (contactId) {
                await updateContact(contactId, payload);
            } else {
                await createContact(payload);
            }

            localContactsList = await fetchContacts(viewContext.facility?.id);
            renderGrid(localContactsList);
            modalShell.style.display = 'none';
            hideContactProfile();
        };
    }

    // Edit and Delete Profiles Toolbar
    if (document.getElementById('profileEditBtn')) {
        document.getElementById('profileEditBtn').onclick = () => {
            if (!activeSelectedContact || !modalShell) return;

            document.getElementById('modalTemplateTitle').textContent = "Modify Contact Details";
            document.getElementById('editingContactId').value = activeSelectedContact.id;
            document.getElementById('manualContactImage').value = activeSelectedContact.profile_photo_url || "";
            document.getElementById('manualContactName').value = activeSelectedContact.contact_name || "";
            document.getElementById('manualContactRole').value = activeSelectedContact.role_title || "";
            document.getElementById('manualContactPhone').value = activeSelectedContact.phone_number || "";
            document.getElementById('manualContactEmail').value = activeSelectedContact.email_address || "";
            document.getElementById('manualContactNotes').value = activeSelectedContact.operational_notes || "";
            
            if (activeSelectedContact.profile_photo_url) {
                document.getElementById('cameraStatusText').textContent = "Existing photo active";
                document.getElementById('cameraStatusText').style.color = "#10b981";
            }

            if (typeof window.attachModalStampTracker === 'function') {
                window.attachModalStampTracker();
            }
            modalShell.style.display = 'flex';
        };
    }

    if (document.getElementById('profileDeleteBtn')) {
        document.getElementById('profileDeleteBtn').onclick = async () => {
            if (!activeSelectedContact) return;
            if (confirm(`Are you certain you want to remove ${activeSelectedContact.contact_name || 'this contact'}?`)) {
                await deleteContact(activeSelectedContact.id);
                localContactsList = await fetchContacts(viewContext.facility?.id);
                renderGrid(localContactsList);
                hideContactProfile();
            }
        };
    }

    const cameraTriggerBtn = document.getElementById('cameraTriggerBtn');
    const cameraFileInput = document.getElementById('manualContactImageFile');
    const cameraStatusText = document.getElementById('cameraStatusText');
    const hiddenImageInput = document.getElementById('manualContactImage');

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

/**
 * Custom event listener initializer invoked by main app engine routes
 */
export function setupContactsEvents(config) {
    console.log("Contacts module telemetry events loaded.", config);
    // Custom workflow configurations can be structuralized here if needed downstream
}
