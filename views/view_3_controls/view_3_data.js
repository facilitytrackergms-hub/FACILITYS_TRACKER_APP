/* =================================================
FILE: view_3_data.js
UPDATED: 2026-06-01
================================================= */

import { supabase } from '../../js/supabaseClient.js';

// Fetch all contacts for a given facility
export async function fetchContacts(facilityId) {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('facility_id', facilityId)
        .order('name', { ascending: true });
    if (error) console.error(error);
    return data || [];
}

// Insert a new contact
export async function insertContact({ name, role, phone, email, notes, facility_id }) {
    const { data, error } = await supabase
        .from('contacts')
        .insert([{ name, role, phone, email, notes, facility_id }])
        .select();
    if (error) console.error(error);
    return data?.[0] || null;
}
