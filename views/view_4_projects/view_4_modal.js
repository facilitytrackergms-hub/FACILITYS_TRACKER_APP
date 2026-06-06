/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
SUPABASE TBL : facility_projects
VIEW NAME    : Project Track Form View
POP-UP TITLE : projectTrackFormModal
LAST UPDATED : 2026-06-06 @ 08:43 AM
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
const __FILENAME = 'view_4_modal.js';


import { insertFacilityProject } from './view_4_data.js';

export function setupProjectsEvents(facility, renderPendingProjectsFn) {
    const formModal = document.getElementById('projectTrackFormModal');

    document.getElementById('projectTrackCreateBtn').onclick = () => {
        document.getElementById('projectTrackTitleInput').value = '';
        document.getElementById('projectTrackBudgetInput').value = '';
        document.getElementById('projectTrackNotesInput').value = '';
        formModal.style.display = 'flex';
    };

    document.getElementById('projectTrackCloseBtn').onclick = () => {
        formModal.style.display = 'none';
    };

    document.getElementById('projectTrackSaveBtn').onclick = async () => {
        const titleVal = document.getElementById('projectTrackTitleInput').value.trim();
        if (!titleVal) {
            alert("[view_4_modal.js] Notification: Please supply a project scope title descriptor.");
            return;
        }

        const payload = {
            project_title: titleVal,
            project_name: titleVal,
            budget: document.getElementById('projectTrackBudgetInput').value.trim(),
            notes: document.getElementById('projectTrackNotesInput').value.trim(),
            facility_id: facility.id,
            facilityid: facility.id,
            active_status: true,
            created_at: new Date().toISOString()
        };

        try {
            await insertFacilityProject(payload);
            formModal.style.display = 'none';
            await renderPendingProjectsFn(facility);
        } catch (error) {
            if (error.code === '23505') {
                alert("[view_4_modal.js] Database Constraint Error: This facility is restricted to a single project row in the database schema.");
            } else {
                alert(`[view_4_modal.js] Error: Could not append project details: ${error.message}`);
            }
        }
    };

    document.getElementById('projectTrackBackBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', facility);
        }
    };
}
