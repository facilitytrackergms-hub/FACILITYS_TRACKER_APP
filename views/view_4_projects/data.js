/*================================================================
FILE NAME    : data.js
FILE PATH    : views/view_4_projects/data.js
================================================================*/

// Robust helper to get the initialized Supabase instance
const getSupabaseInstance = () => {
    // Check both potential locations where your app might store the client
    const client = window.supabaseClient || window.supabase;
    
    if (!client) {
        console.error("Supabase error: Client not found on window object.");
        return null;
    }
    
    // Check if it's actually an initialized instance (must have a 'from' function)
    if (typeof client.from !== 'function') {
        console.error("Supabase error: Client is not initialized (missing .from). Did you run createClient()?");
        return null;
    }
    
    return client;
};

export async function fetchProjects(facilityId) {
    const supabase = getSupabaseInstance();
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
        console.error('Supabase execution error:', err);
        return [];
    }
}
/*================================================================
END FILE: data.js
================================================================*/
