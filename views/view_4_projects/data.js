/*================================================================
FILE NAME    : data.js
FILE PATH    : views/view_4_projects/data.js
LAST UPDATED : 2026-06-15 @ 07:45 PM
================================================================*/

// This helper ensures we get the actual client, not just the library
const getSupabase = () => {
    const client = window.supabaseClient || window.supabase;
    
    // Debugging: If this logs "undefined" or an object with no "from" method, 
    // your main app initialization (where you call createClient) is failing.
    if (!client || typeof client.from !== 'function') {
        console.error("Supabase client is NOT initialized correctly. Current value:", client);
        return null;
    }
    return client;
};

export async function fetchProjects(facilityId) {
    const supabase = getSupabase();
    if (!supabase) return [];
    
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
    const supabase = getSupabase();
    if (!supabase) return null;
    
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([projectData])
        .select();
        
    return error ? null : data[0];
}

/*================================================================
END FILE: data.js
================================================================*/
