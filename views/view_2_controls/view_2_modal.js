/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_2_modal.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Controls
POP-UP TITLE : Facility Navigation Dashboard
LAST UPDATED : 2026-06-06 @ 05:17 AM
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
import { supabase } from '../../js/supabaseClient.js';

export function setupControlsEvents(data) {
    // Unpack context safely whether passed raw or wrapped under data.facility
    const facility = data?.facility ? data.facility : data;
    let controlsChannel = null;

    if (facility?.id && String(facility.id) !== '1') {
        const channelName = `facility_controls_realtime_${facility.id}`;
        supabase.removeChannel(supabase.channel(channelName));

        controlsChannel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'facility_issues', 
                    filter: `facility_id=eq.${facility.id}` 
                },
                () => {
                    // Triggers dynamic content re-evaluation on realtime table broadcasts
                    const badge = document.getElementById('issuesTrackBadge');
                    if (badge && window.renderFacilityControls) {
                        window.renderFacilityControls({ facility: facility });
                    }
                }
            )
            .subscribe();
    }

    const navigateWithCleanup = (targetViewKey) => {
        if (controlsChannel) {
            supabase.removeChannel(controlsChannel);
        }
        if (window.navigateTo) {
            // Standardize output data payload structure across sub-views
            window.navigateTo(targetViewKey, { facility: facility });
        }
    };

    // Corrected target keys to match real physical folder layouts and router definitions
    document.getElementById('toIndividualIssues').onclick = () => navigateWithCleanup('view_5_issues');
    document.getElementById('toContacts').onclick = () => navigateWithCleanup('view_3_contacts');
    document.getElementById('toProjects').onclick = () => navigateWithCleanup('view_4_projects');
    document.getElementById('toGallery').onclick = () => navigateWithCleanup('view_6_images');
    document.getElementById('backDash').onclick = () => navigateWithCleanup('view_1_facility');
}
