/* =================================================
FILE: view_1_data.js
UPDATED: 2026-06-01
================================================= */

import { supabase } from '../../js/supabaseClient.js';
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@9.0.0/dist/esm-browser/index.js';

export async function fetchFacilities() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });
    if (error) console.error(error);
    return data || [];
}

export async function insertFacility({ name, address, phone }) {
    const id = uuidv4(); // generate a new UUID
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ id, name, address, phone, status: 'active' }])
        .select();
    if (error) {
        console.error(error);
        return null;
    }
    return data?.[0] || null;
}
