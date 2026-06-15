/*================================================================
FILE NAME    : data.js
PURPOSE      : Database "Kitchen" - Handles all data retrieval/saving
================================================================*/

import { supabase } from '../../js/supabaseClient.js';

// ===============================================================
// SECTION: FETCHING PROJECTS (The Handover)
// ===============================================================
export async function fetchProjects(facilityId) {
    try {
        if (!facilityId) {
            console.warn("No Facility ID provided to fetchProjects.");
            return []; // HANDOVER: Empty list if no ID
        }

        const { data, error } = await supabase
            .from('facility_projects')
            .select('*')
            .eq('facility_id', facilityId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Error (Kitchen Problem):", error.message);
            return []; // HANDOVER: Error occurred, returning empty
        }

        // --- DEBUGGER LABEL ---
        // This log lets you see the "plate" before we hand it over.
        console.log("DEBUGGER: Handing back this list of projects:", data);

        // --- THE HANDOVER ---
        // This 'return' statement is the literal act of giving 
        // the 'data' to the calling function in main.js
        return data || []; 

    } catch (err) {
        console.error("Unexpected system crash in fetchProjects:", err);
        return []; // HANDOVER: System failure, returning empty
    }
}

// ===============================================================
// SECTION: SAVING PROJECTS
// ===============================================================
export async function saveProject(projectData) {
    try {
        const { data, error } = await supabase
            .from('facility_projects')
            .insert([projectData])
            .select();

        if (error) {
            console.error("Error saving new project:", error.message);
            return null; // HANDOVER: Save failed
        }
        
        // --- THE HANDOVER ---
        // We return the newly created project object so the UI can update
        return data ? data[0] : null; 
        
    } catch (err) {
        console.error("Unexpected system crash in saveProject:", err);
        return null; // HANDOVER: Save failed
    }
}

/*================================================================
END FILE: data.js
================================================================*/
