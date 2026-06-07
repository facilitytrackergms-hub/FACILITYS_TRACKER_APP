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
VIEW NAME    : Directory Entries
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-07 @ 06:26 AM
================================================================*/

import { fetchContacts, insertContact } from '/FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_data.js';
import { insertFacilityIssue } from '/FACILITYS_TRACKER_APP/views/view_5_issues/view_5_data.js';

let localContactsList = [];
let activeSelectedContact = null;
let viewContext = {};

// Hardcoded local fallback SVG data stream to protect layout from via.placeholder timeouts
const rowFallbackSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af' width='32' height='32'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/></svg>`;

export async function initializeGridLogic(context) {
    viewContext = context;
    console.log("Initializing Contacts View Logic Layer with payload context:", viewContext);

    const activeFacilityId = viewContext.facility?.id || viewContext.facilityId;
    if (activeFacilityId) {
        localContactsList = await fetchContacts(activeFacilityId);
        renderGrid(localContactsList);
    }

    setupFormActionListeners();

    if (viewContext.openFormInstantly && viewContext.prefilledContactName) {
        const contactModal = document.getElementById('contactFormModal');
        const manualContactName = document.getElementById('manualContactName');
        if (contactModal && manualContactName) {
            manualContactName.value = viewContext.prefilledContactName;
            contactModal.style.display = 'flex';
        }
    }

    const addNewContactBtn = document.getElementById('addNewContactBtn');
    if (addNewContactBtn) {
        addNewContactBtn.onclick = () => {
            const contactModal = document.getElementById('contactFormModal');
            if (contactModal) contactModal.style.display = 'flex';
        };
    }

    const backToControlsBtn = document.getElementById('backToControlsBtn');
    if (backToControlsBtn) {
        backToControlsBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', { facility: viewContext.facility });
            }
        };
    }

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
                    if (hiddenImageInput) hiddenImageInput.value = evt.target.result;
                    if (cameraStatusText) {
                        cameraStatusText.textContent = "Photo captured successfully";
                        cameraStatusText.style.color = "#10b981";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const currentFacId = viewContext.facility?.id || viewContext.facilityId;
    setupContactsEvents({
        facilityId: currentFacId,
        onRefresh: async () => {
            localContactsList = await fetchContacts(currentFacId);
            renderGrid(localContactsList);
            hideContactProfile();
        },
        getActiveSelected: () => activeSelectedContact
    });
}

function renderGrid(contacts) {
    const gridBody = document.getElementById('contactsGridBody');
    if (!gridBody) return;

    if (!contacts || contacts.length === 0) {
        gridBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#9ca3af;">No directory records available.</td></tr>`;
        return;
    }

    gridBody.innerHTML = contacts.map(contact => {
        const imageSource = contact.avatar_url || rowFallbackSvg;
        return `
            <tr class="contact-row" data-id="${contact.id}" style="cursor:pointer; border-bottom:1px solid #e5e7eb;">
                <td style="padding:12px; display:flex; align-items:center; gap:10px;">
                    <img src="${imageSource}" 
                         alt="Avatar" 
                         style="width:32px; height:32px; border-radius:50%; object-fit:cover; vertical-align:middle;"
                         onerror="this.onerror=null; this.src='${rowFallbackSvg}';">
                    <span style="font-weight:500; color:#1f2937;">${contact.contact_name || 'Unnamed Contact'}</span>
                </td>
                <td style="padding:12px; color:#4b5563;">${contact.contact_role || contact.role || 'General Staff'}</td>
                <td style="padding:12px; color:#4b5563;">${contact.contact_phone || contact.phone || 'N/A'}</td>
                <td style="padding:12px; color:#4b5563;">${contact.contact_email || contact.email || 'N/A'}</td>
            </tr>
        `;
    }).join('');

    const rows = gridBody.querySelectorAll('.contact-row');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const id = row.getAttribute('data-id');
            const target = localContactsList.find(c => String(c.id) === String(id));
            if (target) showContactProfile(target);
        });
    });
}

function showContactProfile(contact) {
    activeSelectedContact = contact;
    const placeholder = document.getElementById('contactPanelPlaceholder');
    const realPanel = document.getElementById('contactDetailPanel');

    if (placeholder) placeholder.style.display = 'none';
    if (realPanel) realPanel.style.display = 'block';

    const detailAvatar = document.getElementById('detailAvatar');
    const detailName = document.getElementById('detailName');
    const detailRole = document.getElementById('detailRole');
    const detailPhone = document.getElementById('detailPhone');
    const detailEmail = document.getElementById('detailEmail');
    const detailNotes = document.getElementById('detailNotes');

    if (detailAvatar) {
        detailAvatar.src = contact.avatar_url || rowFallbackSvg;
        detailAvatar.onerror = () => { detailAvatar.src = rowFallbackSvg; };
    }
    if (detailName) detailName.textContent = contact.contact_name || 'Contact Profile';
    if (detailRole) detailRole.textContent = contact.contact_role || contact.role || 'General Staff';
    if (detailPhone) detailPhone.textContent = contact.contact_phone || contact.phone || 'N/A';
    if (detailEmail) detailEmail.textContent = contact.contact_email || contact.email || 'N/A';
    if (detailNotes) detailNotes.textContent = contact.operational_notes || contact.notes || 'No extended operational summaries submitted.';
}

function hideContactProfile() {
    activeSelectedContact = null;
    const placeholder = document.getElementById('contactPanelPlaceholder');
    const realPanel = document.getElementById('contactDetailPanel');
    if (placeholder) placeholder.style.display = 'block';
    if (realPanel) realPanel.style.display = 'none';
}

function setupFormActionListeners() {
    const cancelBtn = document.getElementById('cancelContactModalBtn');
    const saveBtn = document.getElementById('saveContactBtn');
    const contactModal = document.getElementById('contactFormModal');

    if (cancelBtn && contactModal) {
        cancelBtn.onclick = () => {
            contactModal.style.display = 'none';
            resetFormFields();
        };
    }

    if (saveBtn && contactModal) {
        saveBtn.onclick = async () => {
            const activeFacId = viewContext.facility?.id || viewContext.facilityId;
            if (!activeFacId) return;

            const nameVal = document.getElementById('manualContactName')?.value.trim();
            const roleVal = document.getElementById('manualContactRole')?.value.trim();
            const phoneVal = document.getElementById('manualContactPhone')?.value.trim();
            const emailVal = document.getElementById('manualContactEmail')?.value.trim();
            const notesVal = document.getElementById('manualContactNotes')?.value.trim();
            const imageBase64 = document.getElementById('manualContactImageBase64')?.value || null;

            if (!nameVal) {
                alert("Please declare a structural contact name before saving.");
                return;
            }

            const payload = {
                facility_id: Number(activeFacId),
                contact_name: nameVal,
                contact_role: roleVal || 'General Staff',
                contact_phone: phoneVal || 'N/A',
                contact_email: emailVal || 'N/A',
                operational_notes: notesVal || '',
                avatar_url: imageBase64
            };

            const insertedRow = await insertContact(payload);
            if (insertedRow) {
                contactModal.style.display = 'none';
                resetFormFields();
                localContactsList = await fetchContacts(activeFacId);
                renderGrid(localContactsList);
                hideContactProfile();
            } else {
                alert("Database engine rejected directory insertion logic package.");
            }
        };
    }
}

function resetFormFields() {
    if (document.getElementById('manualContactName')) document.getElementById('manualContactName').value = '';
    if (document.getElementById('manualContactRole')) document.getElementById('manualContactRole').value = '';
    if (document.getElementById('manualContactPhone')) document.getElementById('manualContactPhone').value = '';
    if (document.getElementById('manualContactEmail')) document.getElementById('manualContactEmail').value = '';
    if (document.getElementById('manualContactNotes')) document.getElementById('manualContactNotes').value = '';
    if (document.getElementById('manualContactImageBase64')) document.getElementById('manualContactImageBase64').value = '';
    const cameraStatusText = document.getElementById('cameraStatusText');
    if (cameraStatusText) {
        cameraStatusText.textContent = "No capture stream active";
        cameraStatusText.style.color = "#9ca3af";
    }
}

export function setupContactsEvents(config) {
    console.log("Contacts module telemetry events loaded.", config);
}
