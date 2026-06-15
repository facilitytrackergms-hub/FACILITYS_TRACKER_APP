/*================================================================
FILE NAME    : data.js
SUPABASE TBL : facility_projects
VIEW NAME    : Projects Data Manager
LAST UPDATED : 2026-06-15 @ 08:15 PM
================================================================*/

// Matches the exact import path style of your working view 3
import { supabase } from '../../js/supabaseClient.js';

export async function fetchProjects(facilityId) {
    try {
        if (!facilityId) return [];
        const { data, error } = await supabase
            .from('facility_projects')
            .select('*')
            .eq('facility_id', facilityId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error retrieving project dataset context:", error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error("Unexpected exception inside fetchProjects matrix handler:", err);
        return [];
    }
}

export async function saveProject(projectData) {
    try {
        const { data, error } = await supabase
            .from('facility_projects')
            .insert([projectData])
            .select();

        if (error) {
            console.error("Error saving new project entry:", error.message);
            return null;
        }
        return data ? data[0] : null;
    } catch (err) {
        console.error("Unexpected exception inside saveProject handler:", err);
        return null;
    }
}

/*================================================================
END FILE: data.js
================================================================*/
