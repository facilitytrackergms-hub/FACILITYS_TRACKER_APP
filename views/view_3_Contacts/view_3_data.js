/* =================================================
FILE: views/view_3_controls/view_3_data.js
UPDATED: 2026-06-02 05:45:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchContacts(facilityId) {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('facility_id', facilityId);

    if (error) {
        console.error("Database Error:", error);
        return [];
    }
    return data || [];
}

export async function insertContact(contactData) {
    // Ensuring lowercase keys for all database writes
    const cleanData = {
        name: contactData.name,
        role: contactData.role,
        phone: contactData.phone,
        email: contactData.email,
        notes: contactData.notes,
        facility_id: contactData.facility_id
    };

    const { data, error } = await supabase
        .from('contacts')
        .insert([cleanData])
        .select();

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}
