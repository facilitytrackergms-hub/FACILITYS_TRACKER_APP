/* =================================================
FILE: view_1_data.js
VIEW: Facilities Dashboard
UPDATED: 2026-06-01 12:55:00 PM
================================================= */
import { supabase } from '../../js/supabaseClient.js';

// Fetch all facilities from lowercase table
export async function fetchFacilities() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('name', { ascending: true });
    if (error) { console.error('Error fetching facilities:', error); return []; }
    return data || [];
}

// Insert new facility
export async function insertFacility({ name, address, phone, notes = '' }) {
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ name, address, phone, notes }])
        .select();
    if (error) { console.error('Error inserting facility:', error); return null; }
    return data && data[0] ? data[0] : null;
}

/* Version Tag */
console.log('File: view_1_data.js | View: Facilities Dashboard | Updated: 2026-06-01 12:55 PM');
