/* =================================================
FILE: contacts_data.js
UPDATED: 2026-05-30 12:05:00 PM
STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../js/supabaseClient.js';

/**
 * Fetch all contacts
 */
export async function fetchContacts() {
    const { data, error } = await supabase
        .from('contacts')
        .select('id, name, role, phone, email, notes, facility_id, created_at, updated_at');

    if (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
    return data;
}

/**
 * Insert a new contact
 */
export async function insertContact(name, role, phone, email, notes = '', facility_id = null) {
    const insertObject = {
        name: name,
        role: role,
        phone: phone,
        email: email,
        notes: notes,
        facility_id: facility_id
    };

    const { data, error } = await supabase
        .from('contacts')
        .insert([insertObject])
        .select('id, name, role, phone, email, notes, facility_id, created_at, updated_at');

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}
