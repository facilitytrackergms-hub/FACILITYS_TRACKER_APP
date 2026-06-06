/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_6_modal.js
SUPABASE TBL : facilities
VIEW NAME    : Gallery Image Manager
POP-UP TITLE : Facility Asset Documents
LAST UPDATED : 2026-06-06 @ 08:52 AM
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
const __FILENAME = 'view_6_modal.js';

import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupGalleryEvents(facility) {
    const wrapper = document.getElementById('galleryImageManager');
    if (!wrapper) return;

    // Inject visible UI tag tracking source file and last update metadata (Rule 8)
    const uiTagId = 'ui-tag-view-6-modal';
    let uiTag = document.getElementById(uiTagId);
    if (!uiTag) {
        uiTag = document.createElement('div');
        uiTag.id = uiTagId;
        uiTag.style.cssText = 'font-size: 11px; color: #888; padding: 5px 20px; border-bottom: 1px solid #eee; text-align: right;';
        wrapper.parentNode.insertBefore(uiTag, wrapper);
    }
    uiTag.textContent = `Source: ${__FILENAME} | Last Updated: 2026-06-06 @ 08:52 AM`;

    if (!facility || !facility.id) {
        // Unique alert referencing specific component/file layout (Rule 10)
        wrapper.innerHTML = '<div id="alert-err-view-6-modal" style="padding:20px; color:red; font-weight:bold;">Error [view_6_modal]: Invalid facility configuration payload context.</div>';
    } else {
        // Mount image manager attachment directly under targeted metadata conditions
        renderImageManagerSection(wrapper, 'facility', facility.id, { 
            title: 'Facility Asset Documents', 
            allowUpload: true, 
            allowDelete: true 
        });
    }

    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', facility);
            }
        };
    }
}
