/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_1_data.js
SUPABASE TBL : facilities
VIEW NAME    : Edit Facility Profile
POP-UP TITLE : Edit Facility Profile Details
LAST UPDATED : 2026-06-06 @ 05:12 AM
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
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below, determine the 
   correct names/tables/views from the context, and fill them in 
   accurately before delivering the code block.

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
================================================================/*

// Paste your specific file's import statements and source code here...
import { supabase } from '../../js/supabaseClient.js';

/**
 * Fetches data for a single specific facility to load real-time profile image changes
 */
export async function fetchSingleFacility(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return null;

    const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', safeId)
        .single();

    if (error) {
        console.error("Error loading fresh facility record rows:", error);
        return null;
    }
    return data;
}

/**
 * Updates a facility's textual information details inside the primary database table
 */
export async function updateFacilityDetails(facilityId, name, address, phone) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return false;

    const { error } = await supabase
        .from('facilities')
        .update({ name, address, phone })
        .eq('id', safeId);

    if (error) {
        console.error("Error writing updated facility attributes:", error);
        return false;
    }
    return true;
}

/**
 * Completely removes a facility record row from the database cluster
 */
export async function deleteFacilityRecord(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return false;

    const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', safeId);

    if (error) {
        console.error("Error cascading delete on facility table row target:", error);
        return false;
    }
    return true;
}

/**
 * Removes the image_url reference from a facility profile row without deleting the text records
 */
export async function deleteFacilityImage(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return false;

    const { error } = await supabase
        .from('facilities')
        .update({ image_url: null })
        .eq('id', safeId);

    if (error) {
        console.error("Error wiping facility photo field link:", error);
        return false;
    }
    return true;
}

/**
 * Fetches standard issues for a specific facility to generate the profile dashboard badge counters
 */
export async function fetchFacilityIssues(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return [];

    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Error fetching issues for badge:", error);
        return [];
    }
    return data || [];
}

/**
 * Uploads a local file to Supabase storage bucket and binds the URL to the facility
 */
export async function uploadFacilityImage(facilityId, file) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId) || !file) return null;

    try {
        const fileExtension = file.name.split('.').pop();
        const fileName = `facility_${safeId}_${Date.now()}.${fileExtension}`;
        const filePath = `profiles/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('facility-assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error("Supabase Storage Upload Error:", uploadError);
            return null;
        }

        const { data: urlData } = supabase.storage
            .from('facility-assets')
            .getPublicUrl(filePath);

        const publicUrl = urlData?.publicUrl;
        if (!publicUrl) throw new Error("Could not retrieve public link target path.");

        const { data: updatedFacility, error: updateError } = await supabase
            .from('facilities')
            .update({ image_url: publicUrl })
            .eq('id', safeId)
            .select();

        if (updateError) {
            console.error("Database Error linking photo URL to facility:", updateError);
            return null;
        }

        return updatedFacility && updatedFacility[0] ? updatedFacility[0] : null;

    } catch (err) {
        console.error("Catch error during image process execution:", err);
        return null;
    }
}
