/* =================================================
FILE: views/view_3_contacts/view_3_data.js
UPDATED: 2026-06-03 06:10:00 AM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

/**
 * Fetches all directory entries associated with a specific facility
 */
export async function fetchContacts(facilityId) {
    if (!facilityId) return [];
    try {
        const { data, error } = await supabase
            .from('facility_contacts')
            .select('*')
            .eq('facility_id', Number(facilityId))
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("Error fetching facility directory entries:", err);
        return [];
    }
}

/**
 * Inserts a new profile row into the database directory table
 * ADD THE 'export' KEYWORD HERE:
 */
export async function insertContact(payload) {
    try {
        const { data, error } = await supabase
            .from('facility_contacts')
            .insert([payload])
            .select();

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Error inserting directory entry record:", err);
        return null;
    }
}

/**
 * Updates an existing contact card row entry matching a specific row ID
 * ADD THE 'export' KEYWORD HERE:
 */
export async function updateContact(contactId, payload) {
    if (!contactId) return null;
    try {
        const { data, error } = await supabase
            .from('facility_contacts')
            .update(payload)
            .eq('id', Number(contactId))
            .select();

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error(`Error updating contact record ID ${contactId}:`, err);
        return null;
    }
}

/**
 * Removes a directory entry row from the database
 */
export async function deleteContact(contactId) {
    if (!contactId) return false;
    try {
        const { error } = await supabase
            .from('facility_contacts')
            .delete()
            .eq('id', Number(contactId));

        if (error) throw error;
        return true;
    } catch (err) {
        console.error(`Error deleting contact record ID ${contactId}:`, err);
        return false;
    }
}
