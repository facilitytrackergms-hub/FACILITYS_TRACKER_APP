/* =================================================
FILE: view_3_data.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchContacts() {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
    return data;
}

export async function insertContact(contactObj) {
    const { data, error } = await supabase
        .from('contacts')
        .insert([{
            name_text: contactObj.name,
            role_text: contactObj.role,
            facility_id: contactObj.facility_id || null
        }])
        .select();

    if (error) {
        console.error("Error inserting contact:", error);
        return null;
    }
    return data[0];
}

export async function updateContact(id, contactObj) {
    const { data, error } = await supabase
        .from('contacts')
        .update({
            name_text: contactObj.name,
            role_text: contactObj.role,
            facility_id: contactObj.facility_id || null
        })
        .eq('id', id)
        .select();

    if (error) {
        console.error("Error updating contact:", error);
        return null;
    }
    return data[0];
}
