/* =================================================
FILE: view_4_data.js
UPDATED: 2026-06-01
================================================= */

import { supabase } from '../../js/supabaseClient.js';

// Fetch all projects for a given facility
export async function fetchProjects(facilityId) {
    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });
    if (error) console.error(error);
    return data || [];
}

// Insert a new project
export async function insertProject({ project_name, budget, notes, facility_id }) {
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([{ project_name, budget, notes, facility_id }])
        .select();
    if (error) console.error(error);
    return data?.[0] || null;
}
