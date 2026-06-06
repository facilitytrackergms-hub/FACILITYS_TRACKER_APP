/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_8_data.js
SUPABASE TBL : facility_issues
VIEW NAME    : [Insert View Name - e.g., Add New Facility]
POP-UP TITLE : [Insert Pop-Up Title - e.g., Create Directory Entry]
LAST UPDATED : 2026-06-06 @ 08:59 AM
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
const __FILENAME = 'view_8_data.js';

import { supabase } from '../../js/supabaseClient.js';

export async function fetchReportIssues(facilityId) {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Database Error fetching report issues:", error);
        return [];
    }
    return data || [];
}

export async function fetchIssueFollowups(issueId) {
    const { data, error } = await supabase
        .from('issue_followups')
        .select('*')
        .eq('issue_id', issueId)
        .order('timestamp', { ascending: true });

    if (error) {
        console.error("Database Error fetching issue followups:", error);
        return [];
    }
    return data || [];
}

export async function fetchFacilityImages(issueId) {
    const { data, error } = await supabase
        .from('facility_images')
        .select('*')
        .eq('issue_id', issueId);

    if (error) {
        console.error("Database Error fetching facility images:", error);
        return [];
    }
    return data || [];
}
