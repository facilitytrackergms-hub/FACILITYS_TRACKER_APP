/* =================================================
FILE: views/view_3_contacts/view_3_data.js
UPDATED: 2026-06-03 07:00:00 AM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

/**
 * Fetches all directory entries associated with a specific facility, 
 * alongside cross-referenced tracking relations from contact_issues.
 */
export async function fetchContacts(facilityId) {
    if (!facilityId) return [];
    try {
        // Step 1: Fetch valid columns from facility_contacts table
        const { data: contacts, error: contactsError } = await supabase
            .from('facility_contacts')
            .select('id, facility_id, name, role, email, phone, image_url, created_at')
            .eq('facility_id', Number(facilityId))
            .order('name', { ascending: true });

        if (contactsError) throw contactsError;
        if (!contacts || contacts.length === 0) return [];

        // Step 2: Fetch junction linkages alongside linked title and status parameters
        const contactIds = contacts.map(c => Number(c.id));
        const { data: issuesLinks, error: linksError } = await supabase
            .from('contact_issues')
            .select(`
                contact_id, 
                issue_id,
                facility_issues (
                    title,
                    status
                )
            `)
            .in('contact_id', contactIds);

        if (linksError) {
            console.warn("Could not load associated issues mapping:", linksError);
        }

        // Step 3: Stitch relational records and lookup metrics together cleanly in memory
        const mappings = issuesLinks || [];
        return contacts.map(contact => {
            const matchedRelations = mappings.filter(m => Number(m.contact_id) === Number(contact.id));
            return {
                ...contact,
                contact_issues: matchedRelations.map(m => ({
                    issue_id: m.issue_id,
                    title: m.facility_issues?.title || `Issue #${m.issue_id}`,
                    status: m.facility_issues?.status || 'Open'
                }))
            };
        });
    } catch (err) {
        console.error("Error fetching facility directory entries:", err);
        return [];
    }
}

/**
 * Inserts a new profile row into the database directory table
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
