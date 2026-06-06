/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_modal.js
SUPABASE TBL : contacts
VIEW NAME    : Modify Contact Details
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-06 @ 08:35 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_3_modal.js';
import { insertContact, updateContact } from './view_3_data.js';
import { supabase } from '../../js/supabaseClient.js';

export function setupContactsEvents(facility, refreshCallback) {
    const modal = document.getElementById('manualContactModal');
    const closeBtn = document.getElementById('manualContactCloseBtn');
    const saveBtn = document.getElementById('customSaveContactBtn');
    const triggerBtn = document.getElementById('manualContactTriggerBtn');

    // Rule 8: UI Source Tracker Tag Management
    updateUiMetadataTag();

    if (triggerBtn) {
        triggerBtn.onclick = () => {
            clearFormFields();
            document.getElementById('modalTemplateTitle').innerText = "Create Directory Entry";
            document.getElementById('editingContactId').value = "";
            modal.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const name = document.getElementById('manualContactName').value.trim();
            const role = document.getElementById('manualContactRole').value.trim();
            const phone = document.getElementById('manualContactPhone').value.trim();
            const email = document.getElementById('manualContactEmail').value.trim();
            const notes = document.getElementById('manualContactNotes').value.trim();
            const imageUrl = document.getElementById('manualContactImage') ? document.getElementById('manualContactImage').value.trim() : '';
            const editingId = document.getElementById('editingContactId').value;

            if (!name) {
                showUniqueAlert("alert_view_3_modal_missing_name", "Please provide at least a name.");
                return;
            }

            const payload = {
                facility_id: Number(facility.id),
                name,
                role: role || 'Staff',
                phone: phone || 'N/A',
                email: email || '',
                image_url: imageUrl || '',
                notes: notes || ''
            };

            let success = false;
            if (editingId) {
                const res = await updateContact(editingId, payload);
                if (res) success = true;
            } else {
                const res = await insertContact(payload);
                if (res) success = true;
            }

            if (success) {
                modal.style.display = 'none';
                if (refreshCallback) await refreshCallback(facility);
            } else {
                showUniqueAlert("alert_view_3_modal_save_failed", "Could not process directory database save request.");
            }
        };
    }
}

export function openEditContactModal(contact) {
    const modal = document.getElementById('manualContactModal');
    if (!modal) return;

    updateUiMetadataTag();

    document.getElementById('modalTemplateTitle').innerText = "Modify Contact Details";
    document.getElementById('editingContactId').value = contact.id;

    if (document.getElementById('manualContactName')) document.getElementById('manualContactName').value = contact.name || '';
    if (document.getElementById('manualContactRole')) document.getElementById('manualContactRole').value = contact.role || '';
    if (document.getElementById('manualContactPhone')) document.getElementById('manualContactPhone').value = contact.phone || '';
    if (document.getElementById('manualContactEmail')) document.getElementById('manualContactEmail').value = contact.email || '';
    if (document.getElementById('manualContactNotes')) document.getElementById('manualContactNotes').value = contact.notes || '';
    if (document.getElementById('manualContactImage')) document.getElementById('manualContactImage').value = contact.image_url || '';

    modal.style.display = 'flex';
}

function clearFormFields() {
    if (document.getElementById('manualContactName')) document.getElementById('manualContactName').value = '';
    if (document.getElementById('manualContactRole')) document.getElementById('manualContactRole').value = '';
    if (document.getElementById('manualContactPhone')) document.getElementById('manualContactPhone').value = '';
    if (document.getElementById('manualContactEmail')) document.getElementById('manualContactEmail').value = '';
    if (document.getElementById('manualContactNotes')) document.getElementById('manualContactNotes').value = '';
    if (document.getElementById('manualContactImage')) document.getElementById('manualContactImage').value = '';
}

/**
 * Rule 8 Helper: Creates/updates a visible identifier tag containing source file info and compilation timestamps.
 */
function updateUiMetadataTag() {
    let tag = document.getElementById('ui_tag_view_3_modal');
    if (!tag) {
        tag = document.createElement('div');
        tag.id = 'ui_tag_view_3_modal';
        tag.style.fontSize = '10px';
        tag.style.color = '#888';
        tag.style.padding = '5px 10px';
        tag.style.textAlign = 'right';
        const modalContent = document.querySelector('#manualContactModal .modal-content') || document.getElementById('manualContactModal');
        if (modalContent) modalContent.appendChild(tag);
    }
    tag.innerText = `Source: view_3_modal.js | Updated: 2026-06-06 08:35 AM`;
}

/**
 * Rule 10 Helper: Renders custom component-anchored warning dialog items to bypass native alert mechanisms.
 */
function showUniqueAlert(alertId, message) {
    let alertBox = document.getElementById(alertId);
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = alertId;
        alertBox.className = 'custom-unique-alert';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.backgroundColor = '#ffdddd';
        alertBox.style.color = '#d8000c';
        alertBox.style.border = '1px solid #d8000c';
        alertBox.style.padding = '10px 20px';
        alertBox.style.borderRadius = '4px';
        alertBox.style.zIndex = '9999';
        alertBox.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        document.body.appendChild(alertBox);
    }
    alertBox.innerText = `[${alertId}] ${message}`;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
}
