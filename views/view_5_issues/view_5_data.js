/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_data.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Data Service
POP-UP TITLE : Manage Facility Issues
LAST UPDATED : 2026-06-06 @ 08:45 AM
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
const __FILENAME = 'view_5_data.js';

import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityIssues(facilityId) {
    // Parse to an integer number to match the bigint database format
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return [];
    
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Database Error fetching issues:", error);
        return [];
    }

    if (data && data.length > 0) {
        return data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return data || [];
}

export async function fetchFacilityContacts(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return [];

    // Correct target to load explicitly from facility_contacts table structure
    const { data, error } = await supabase
        .from('facility_contacts')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Database Error fetching facility contacts:", error);
        return [];
    }
    return data || [];
}

export async function insertFacilityContact(contactPayload) {
    const safeFacilityId = parseInt(contactPayload.facility_id, 10);
    
    const mappedPayload = {
        facility_id: safeFacilityId,
        name: contactPayload.name || '',
        role: contactPayload.role || ''
    };

    const { data, error } = await supabase
        .from('facility_contacts')
        .insert([mappedPayload])
        .select();

    if (error) {
        console.error("Database Error inserting contact:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}

export async function saveFacilityIssue(payload, id = null, linkedContactId = null) {
    const safeFacilityId = parseInt(payload.facility_id, 10);
    
    // FIXED: Swapped 'initiated_by' out and mapped the incoming value to your true DB column: 'reported_by'
    const mappedPayload = {
        facility_id: safeFacilityId,
        title: payload.title || 'Maintenance Request',
        description: payload.description || '',
        severity: payload.priority || 'Medium',
        status: payload.status || 'Open',
       reported_by: payload.reported_by || payload.initiated_by || 'Staff'
    };

    let result;
    if (!id) {
        result = await supabase
            .from('facility_issues')
            .insert([mappedPayload])
            .select();
            
        // Junction linkage block: stitch relationship mapping inside memory rows if newly inserted
        if (!result.error && result.data && result.data[0] && linkedContactId) {
            const savedIssueId = result.data[0].id;
            const { error: junctionError } = await supabase
                .from('contact_issues')
                .insert([{
                    contact_id: parseInt(linkedContactId, 10),
                    issue_id: parseInt(savedIssueId, 10)
                }]);
                
            if (junctionError) {
                console.warn("Junction linkage mapping insertion error logged:", junctionError);
            }
        }
    } else {
        result = await supabase
            .from('facility_issues')
            .update(mappedPayload)
            .eq('id', parseInt(id, 10))
            .select();
    }

    if (result.error) {
        console.error("Database Error saving issue:", result.error);
        return { error: result.error, data: null };
    }
    return { error: null, data: result.data && result.data[0] ? result.data[0] : null };
}

/**
 * Permanently deletes an issue record from table storage.
 * Handles cleaning up related contact junction linkages seamlessly.
 */
export async function deleteFacilityIssue(issueId) {
    const safeIssueId = parseInt(issueId, 10);
    if (isNaN(safeIssueId)) return { success: false };

    // 1. Clean up junction linkages first to bypass relational dependency failures
    await supabase
        .from('contact_issues')
        .delete()
        .eq('issue_id', safeIssueId);

    // 2. Erase core issue entry completely
    const { error } = await supabase
        .from('facility_issues')
        .delete()
        .eq('id', safeIssueId);

    if (error) {
        console.error("Database Error deleting facility issue record:", error);
        return { success: false, error };
    }

    return { success: true };
}

// ALIAS EXPORT: Satisfies view_5_grid.js expecting 'insertFacilityIssue' 
export { saveFacilityIssue as insertFacilityIssue };
