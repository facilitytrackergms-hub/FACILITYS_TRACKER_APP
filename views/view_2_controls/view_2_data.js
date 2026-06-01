/* =================================================
FILE: view_2_data.js
UPDATED: 2026-06-01
================================================= */

import { supabase } from '../../js/supabaseClient.js';

// Fetch contacts for the selected facility
export async function fetchFacilityContacts(facilityId) {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('facility_id', facilityId)
        .order('name', { ascending: true });
    if (error) console.error(error);
    return data || [];
}

// Fetch projects for the selected facility
export async function fetchFacilityProjects(facilityId) {
    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });
    if (error) console.error(error);
    return data || [];
}
