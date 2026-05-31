/* =================================================
FILE: controls_v4_data.js
UPDATED: 2026-05-30 05:50 AM
================================================= */
import { supabase } from '../js/supabaseClient.js';

export async function getProjects(facility_id) {
    return supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facility_id)
        .order('created_at', { ascending: false });
}

export async function insertProject(projectData) {
    return supabase
        .from('facility_projects')
        .insert([projectData]);
}
