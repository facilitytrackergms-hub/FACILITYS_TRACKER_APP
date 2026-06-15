/*================================================================
FILE NAME    : data.js
PURPOSE      : Database Connection & Fetching
================================================================*/
import { supabase } from '../../js/supabaseClient.js';

export async function fetchProjects(facilityId) {
    if (!facilityId) return [];

    try {
        const { data, error } = await supabase
            .from('facility_projects')
            .select('*')
            .eq('facility_id', facilityId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Error:", error.message);
            return [];
        }
        
        console.log("DEBUG: Data fetched from Supabase:", data);
        return data || [];
    } catch (err) {
        console.error("Unexpected error:", err);
        return [];
    }
}
