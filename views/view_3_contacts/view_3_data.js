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

7. CODE COMPLETENESS: Provide the full updated function or file so nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag identifying its source file, last update date, and time. If missing, add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of an existing file unless the current code is fully pasted into the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom notifications. Always add a distinct, visible ID or tag to the message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, including this header and all rules, wrapped completely inside a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields in this header (File Name, Table, View, Title, Date, Time) are fully updated and preserved at the top of the file.
================================================================*/
/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_data.js
SUPABASE TBL : contacts
VIEW NAME    : Add New Facility
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-07 @ 05:56 AM
================================================================*/

import { supabase } from '../../js/supabaseClient.js';

export async function fetchContacts(facilityId) {
    try {
        if (!facilityId) return [];
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('facility_id', facilityId)
            .order('contact_name', { ascending: true });

        if (error) {
            console.error("Error retrieving directory dataset context:", error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error("Unexpected exception inside fetchContacts matrix handler:", err);
        return [];
    }
}

export async function insertContact(contactPayload) {
    try {
        if (!contactPayload) return null;
        const normalizedPayload = { ...contactPayload };
        if ('name' in normalizedPayload && !normalizedPayload.contact_name) {
            normalizedPayload.contact_name = normalizedPayload.name;
            delete normalizedPayload.name;
        }

        const { data, error } = await supabase
            .from('contacts')
            .insert([normalizedPayload])
            .select();

        if (error) {
            console.error("Error executing directory insert workflow operation:", error.message);
            return null;
        }
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Unexpected system exception inside insertContact service context:", err);
        return null;
    }
}

export async function updateContact(contactId, contactPayload) {
    try {
        if (!contactId || !contactPayload) return null;
        const normalizedPayload = { ...contactPayload };
        if ('name' in normalizedPayload) {
            normalizedPayload.contact_name = normalizedPayload.name;
            delete normalizedPayload.name;
        }

        const { data, error } = await supabase
            .from('contacts')
            .update(normalizedPayload)
            .eq('id', contactId)
            .select();

        if (error) {
            console.error("Error patching directory contact payload row:", error.message);
            return null;
        }
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Unexpected system exception inside updateContact context:", err);
        return null;
    }
}

export async function deleteContact(contactId) {
    try {
        if (!contactId) return false;
        const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', contactId);

        if (error) {
            console.error("Error performing delete contact operation reference:", error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Unexpected system exception inside deleteContact context:", err);
        return false;
    }
}
