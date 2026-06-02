/* =================================================
FILE: views/v1_facilitiesDashboard_data.js
UPDATED: 2026-06-02 05:20:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../js/supabaseClient.js';

export async function fetchFacilities() {
    // Ensuring lowercase table name: 'facilities'
    const { data, error } = await supabase
        .from('facilities')
        .select('id, name, address, phone, status'); 
    
    if (error) {
        console.error("Database Error fetching facilities:", error);
        return [];
    }
    return data || [];
}

export async function insertFacility(name, address, phone) {
    // Ensuring lowercase table name and lowercase columns: name, address, phone
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ name: name.trim(), address: address.trim(), phone: phone.trim() }])
        .select();

    if (error) {
        console.error("Database Error inserting facility:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}
