/* =================================================
FILE: view_1_data.js
UPDATED: 2026-06-01 01:20 PM
STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

// Fetch all facilities with lowercase table/column names
export async function fetchFacilities() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('name', { ascending: true });
    if (error) { console.error('Error fetching facilities:', error); return []; }
    return data || [];
}

// Insert new facility with lowercase columns
export async function insertFacility({ name, address, phone }) {
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ name, address, phone }])
        .select();
    if (error) { console.error('Error inserting facility:', error); return null; }
    return data && data[0] ? data[0] : null;
}
