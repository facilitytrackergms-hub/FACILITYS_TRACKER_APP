/*================================================================
FILE NAME    : data.js
FILE PATH    : views/view_4_projects/data.js
LAST UPDATED : 2026-06-15 @ 08:00 PM
================================================================*/

// Import the client directly from your config file
import { supabase } from '../../supabaseClient.js'; 

export async function fetchProjects(facilityId) {
    if (!supabase || typeof supabase.from !== 'function') {
        console.error("Supabase client is not imported correctly.");
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('facility_projects')
            .select('*')
            .eq('facility_id', facilityId);
            
        if (error) {
            console.error('Supabase fetch error:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('Fetch execution error:', err);
        return [];
    }
}

export async function saveProject(projectData) {
    if (!supabase || typeof supabase.from !== 'function') return null;
    
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([projectData])
        .select();
        
    return error ? null : data[0];
}

/*================================================================
END FILE: data.js
================================================================*/
