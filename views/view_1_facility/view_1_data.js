/* =================================================
FILE: view_1_data.js
================================================= */

import { supabase } from '../../js/supabaseClient.js';

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
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ name, address, phone, status: 'active' }])
        .select();
    if (error) {
        console.error(error);
        return null;
    }
    return data?.[0] || null;
}
