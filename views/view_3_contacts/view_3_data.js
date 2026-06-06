/* =================================================
FILE: views/view_3_contacts/view_3_data.js
UPDATED: 2026-06-05 09:30:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

/**
 * Fetches all active contact directory records associated with a specific facility.
 * @param {string|number} facilityId - The database primary key of the facility.
 * @returns {Promise<Array>} List of contact entry objects.
 */
export async function fetchContacts(facilityId) {
    try {
        if (!facilityId) return [];
        
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('facility_id', Number(facilityId))
            .order('name', { ascending: true });

        if (error) {
            console.error("Error fetching facility contacts:", error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error("Unexpected error in fetchContacts operational runtime:", err);
        return [];
    }
}

/**
 * Persists a new contact record inside the database directory schema.
 * @param {Object} contactPayload - The complete structured payload details of the contact.
 * @returns {Promise<Object|null>} The newly instantiated database row data or null if failed.
 */
export async function insertContact(contactPayload) {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .insert([contactPayload])
            .select();

        if (error) {
            console.error("Error inserting directory contact payload:", error.message);
            return null;
        }
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Unexpected system exception inside insertContact context:", err);
        return null;
    }
}

/**
 * Updates an existing directory profile entry record mapping against its unique reference key.
 * @param {string|number} contactId - The primary key ID of the target contact record.
 * @param {Object} updatePayload - Structured payload containing the revised values.
 * @returns {Promise<Object|null>} The updated row data returned from the database layer or null.
 */
export async function updateContact(contactId, updatePayload) {
    try {
        if (!contactId) return null;

        const { data, error } = await supabase
            .from('contacts')
            .update(updatePayload)
            .eq('id', contactId)
            .select();

        if (error) {
            console.error("Error patching directory contact payload row:", error.message);
            return null;
        }
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Unexpected system exception inside updateContact context:", err);
        return null;
    }
}

/**
 * Completely removes a directory profile row out of the target schema database tables.
 * @param {string|number} contactId - The primary key ID of the targeted contact record.
 * @returns {Promise<boolean>} True if the row row entry was dropped successfully, otherwise false.
 */
export async function deleteContact(contactId) {
    try {
        if (!contactId) return false;

        const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', contactId);

        if (error) {
            console.error("Error performing delete contact operation reference:", error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Unexpected system exception inside deleteContact context:", err);
        return false;
    }
}
