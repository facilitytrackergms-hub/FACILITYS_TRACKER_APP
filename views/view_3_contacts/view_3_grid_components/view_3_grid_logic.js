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
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-06 @ 07:54 PM
================================================================*/
const __FILENAME = 'view_3_grid_logic.js';

import { fetchContacts, insertContact, deleteContact } from '../view_3_data.js';
import { setupContactsEvents, openEditContactModal } from '../view_3_modal.js';
import { fetchFacilityIssues } from '../../view_5_issues/view_5_data.js';
import { renderFacilityIssues } from '../../view_5_issues/view_5_grid.js';

let localContactsList = [];
let activeSelectedContact = null;
let viewContext = null;

const OFFLINE_AVATAR_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100" fill="%239ca3af"><circle cx="50" cy="50" r="50" fill="%23e5e7eb"/><circle cx="50" cy="40" r="20"/><path d="M20,80 C20,60 80,60 80,80 Z"/></svg>`;

function getSanitizedAvatar(url) {
    if (!url || typeof url !== 'string') {
        return OFFLINE_AVATAR_IMAGE;
    }
    const cleanedUrl = url.trim().toLowerCase();
    if (cleanedUrl === '' || cleanedUrl === 'undefined' || cleanedUrl === 'null' || cleanedUrl.includes('via.placeholder.com')) {
        return OFFLINE_AVATAR_IMAGE;
    }
    return url;
}

export async function initializeGridLogic(context) {
    viewContext = context;
    await init();
}

async function init() {
    try {
        localContactsList = await fetchContacts(viewContext.facility?.id);
        renderGrid(localContactsList);
    } catch (error) {
        console.error("Error loading directory data:", error);
        const grid = document.getElementById('contactsGridElement');
        if (grid) grid.innerHTML = `<p style="color:#dc2626; font-size:14px;">Failed to load contacts directory details.</p>`;
    }
    bindCoreDOMEvents();
}

function renderGrid(contacts) {
    const grid = document.getElementById('contactsGridElement');
    if (!grid) return;

    grid.innerHTML = '';

    if (!contacts || contacts.length === 0) {
        grid.innerHTML = `<p style="color:#6b7280; font-size:14px; grid-column:1/-1; text-align:center;">No contacts found for this facility.</p>`;
        return;
    }

    contacts.forEach(c => {
        const secureUrl = getSanitizedAvatar(c.avatar_url || c.image_url);

        const card = document.createElement('div');
        card.className = 'contact-thumbnail';
        card.setAttribute('data-contact-id', c.id);

        const img = document.createElement('img');
        img.src = secureUrl;
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'thumbnail-name';
        nameDiv.textContent = c.name || 'Unnamed';

        const roleDiv = document.createElement('div');
        roleDiv.className = 'thumbnail-role';
        roleDiv.textContent = c.role || 'General';

        card.appendChild(img);
        card.appendChild(nameDiv);
        card.appendChild(roleDiv);

        card.addEventListener('click', () => {
            const selected = localContactsList.find(item => String(item.id) === String(c.id));
            if (selected) {
                showContactProfile(selected);
            }
        });

        grid.appendChild(card);
    });
}

function showContactProfile(contact) {
    activeSelectedContact = contact;
    
    document.getElementById('directorySelectionLayout').style.display = 'none';
    const panel = document.getElementById('contactDetailPane');
    
    const contextUrl = getSanitizedAvatar(contact.avatar_url || contact.image_url);
    document.getElementById('detailAvatar').src = contextUrl;
    document.getElementById('detailName').textContent = contact.name || 'Contact Profile';
    document.getElementById('detailRole').textContent = contact.role || 'N/A';
    
    const phone = document.getElementById('detailPhoneLink');
    phone.textContent = contact.phone || 'N/A';
    phone.href = contact.phone ? `tel:${contact.phone}` : '#';

    const email = document.getElementById('detailEmailLink');
    email.textContent = contact.email || 'N/A';
    email.href = contact.email ? `mailto:${contact.email}` : '#';

    document.getElementById('detailNotes').textContent = contact.notes || 'No extra operational notes configured.';
    
    panel.style.display = 'block';
}

function hideContactProfile() {
    activeSelectedContact = null;
    document.getElementById('contactDetailPane').style.display = 'none';
    document.getElementById('directorySelectionLayout').style.display = 'block';
}

function bindCoreDOMEvents() {
    document.getElementById('backBtn')?.addEventListener('click', () => {
        if (typeof window.__switchToControlView === 'function') {
            window.__switchToControlView(viewContext.returnToView);
        }
    });

    document.getElementById('closeDetailPaneBtn')?.addEventListener('click', hideContactProfile);

    document.getElementById('profileEditBtn')?.addEventListener('click', () => {
        if (activeSelectedContact && typeof openEditContactModal === 'function') {
            openEditContactModal(activeSelectedContact);
        }
    });

    document.getElementById('profileDeleteBtn')?.addEventListener('click', async () => {
        if (activeSelectedContact) {
            const dynamicConfirm = confirm("[ID: view3-delete-alert] Are you sure you want to remove this contact entry?");
            if (dynamicConfirm) {
                try {
                    await deleteContact(activeSelectedContact.id);
                    localContactsList = await fetchContacts(viewContext.facility?.id);
                    renderGrid(localContactsList);
                    hideContactProfile();
                } catch (err) {
                    console.error("Error deleting contact entry:", err);
                }
            }
        }
    });

    document.getElementById('profileAddIssueBtn')?.addEventListener('click', () => {
        if (activeSelectedContact) {
            renderFacilityIssues({
                facility: viewContext.facility,
                returnToView: 'view_3_grid',
                cachedIssueForm: {
                    assigned_contact: activeSelectedContact.name
                }
            });
        }
    });

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
