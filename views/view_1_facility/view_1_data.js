/* =================================================
FILE: views/view_1_facility/view_1_data.js
UPDATED: 2026-06-02 05:30:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilities() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*');
    if (error) {
        console.error("Database Error:", error);
        return [];
    }
    return data || [];
}

export async function insertFacility(name, address, phone) {
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ name: name, address: address, phone: phone }])
        .select();

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}
