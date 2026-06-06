================================================================
FILE NAME: view_1_data.js
================================================================
SUPABASE TABLE: facilities
================================================================
VIEW NAME: Facilities Dashboard (Data Layer)
================================================================
POP-UP TITLE: N/A (Data Layer Module)
================================================================
FILE INFO:
- Date: June 6, 2026
- Time: 3:59 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.
2. NO UNSANCTIONED CHANGES: Never change, remove, or modify any of the rules in this header unless explicitly asked by the user.
3. SCOPE OF WORK: Only modify the specific functions, lines, or features requested in the prompt.
4. PRESERVATION: Do NOT refactor, rename, or optimize any other part of the code unless explicitly asked. Leave all working logic exactly as it is.
5. LOGGING CHANGES: If you must change a variable name or structure to make the requested fix work, explicitly state *why* in your text response before showing the code.
6. CODE COMPLETENESS: Provide the full updated function or file so nothing gets accidentally lost in translation.
7. VIEW IDENTIFIERS: Check if the view or pop-up has a visible UI tag/label identifying its specific source file (e.g., view_1_data.js, grid, or modal file), last update date, and time. If it does not exist, add it to the UI layout so it is visible when opened. Update this tag automatically on every modification.
8. NO BLIND CODE/FILES: Never create a new file or assume the contents of an existing file unless the current code has been fully pasted into the prompt. If it has not been pasted, stop and ask for it.
9. UNIQUE MESSAGE BOX IDENTIFIERS: Never use plain, generic default message boxes for custom notifications or alerts. Always add a distinct, visible ID or tag element to the message box UI that explicitly references the specific component or file it belongs to so it can be uniquely identified.
10. AUTOMATIC HEADER METADATA COLLECTION: Whenever making an update to a file, ensure that all fields in this header (File Name, Supabase Table, View Name, Pop-Up Title, Date, and Time) are correctly collected, filled out, and preserved at the top of the code delivery.
================================================================
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilities() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*');
    if (error) {
        console.error("Database Error:", error);
        return [];
    }
    return data || [];
}

export async function insertFacility(name, address, phone) {
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ name: name, address: address, phone: phone }])
        .select();

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}
