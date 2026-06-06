/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_1_modal.js
SUPABASE TBL : facilities
VIEW NAME    : Add New Facility
POP-UP TITLE : Facility Image / Add New Facility
LAST UPDATED : 2026-06-06 @ 04:32 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

3. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

4. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

5. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

6. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

7. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

8. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

9. UNIQUE ALERTS: Never use generic default message boxes for custom 
   notifications. Always add a distinct, visible ID or tag to the 
   message box UI referencing its specific component/file.

10. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

11. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.

  12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/  
================================================================
*/
const __FILENAME = 'view_1_modal.js';
import { insertFacility } from './view_1_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupFacilitiesEvents(renderFacilitiesFn) {
    const modal = document.getElementById('modal');
    const warningModal = document.getElementById('warningModal');
    const imageMount = document.getElementById('image-manager-mount');
    const imageSection = document.getElementById('post-save-images');
    const saveBtn = document.getElementById('saveBtn');
    const facilityFields = document.getElementById('facility-fields');
    let createdFacility = null;

    document.getElementById('openModal').onclick = () => {
        createdFacility = null;
        modal.style.display = 'block';
        imageSection.style.display = 'none';
        facilityFields.style.display = 'block';
        saveBtn.style.display = 'block';
        imageMount.innerHTML = '';
        document.getElementById('modalTitle').innerText = "Add New Facility";
        document.getElementById('name').value = '';
        document.getElementById('address').value = '';
        document.getElementById('phone').value = '';

        // Rule 7 Compliance: Injecting a tracking label inside the modal view layout
        let tracker = document.getElementById('ai-modal-tracker');
        if (!tracker) {
            tracker = document.createElement('div');
            tracker.id = 'ai-modal-tracker';
            tracker.style.cssText = 'position: absolute; bottom: 10px; left: 20px; font-size: 11px; color: #777; pointer-events: none;';
            modal.appendChild(tracker);
        }
        tracker.innerText = 'File: view_1_modal.js | Updated: 2026-06-06 @ 04:32 AM';
    };

    document.getElementById('closeModal').onclick = () => {
        modal.style.display = 'none';
        renderFacilitiesFn();
    };

    document.getElementById('closeWarning').onclick = () => warningModal.style.display = 'none';

    async function saveFacilityAndOpenImages() {
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        

        if (!name || !address || !phone) {
            // Rule 9 Compliance: Attaching component-specific identifier to the active warning alert window frame
            const alertContent = warningModal.querySelector('.warning-content');
            if (alertContent) {
                alertContent.setAttribute('data-message-origin', 'view_1_modal-required-fields');
            }
            warningModal.style.display = 'block';
            return;
        }

        const newFacility = await insertFacility(name, address, phone);

        if (newFacility) {
            createdFacility = newFacility;
            facilityFields.style.display = 'none';
            saveBtn.style.display = 'none';
            document.getElementById('modalTitle').innerText = "Facility Image: " + name;
            imageSection.style.display = 'block';
            imageMount.innerHTML = '';
            renderImageManagerSection(imageMount, 'facility', createdFacility.id, { title: 'Facility Image' });
            
            // Keep tracker label up to date if view updates post-save
            let tracker = document.getElementById('ai-modal-tracker');
            if (tracker) {
                tracker.innerText = 'File: view_1_modal.js | Updated: 2026-06-06 @ 04:32 AM';
            }
        }
    }

    document.getElementById('prepareImageBtn').onclick = saveFacilityAndOpenImages;
    saveBtn.onclick = saveFacilityAndOpenImages;
}
