/* =================================================
FILE: views/view_3_contacts/view_3_data.js
UPDATED: 2026-06-03 12:15:00 PM

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

        if (linksError) throw linksError;

        // Step 3: Align rows into unified layout view models
        return contacts.map(c => {
            const matchedRelations = (issuesLinks || []).filter(link => Number(link.contact_id) === Number(c.id));
            
            return {
                ...c,
                contact_issues: matchedRelations.map(m => {
                    // Defensive check: Handle cases where facility_issues is returned as an array or a direct single object record
                    const issueDetails = Array.isArray(m.facility_issues) ? m.facility_issues[0] : m.facility_issues;
                    return {
                        issue_id: m.issue_id,
                        title: issueDetails?.title || `Issue #${m.issue_id}`,
                        status: issueDetails?.status || 'Open'
                    };
                })
            };
        });

    } catch (err) {
        console.error("Critical error while populating contact data models:", err);
        return [];
    }
}

/**
 * Creates a brand new directory card entry inside the facility contacts database table
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
            .delete()\n            .eq('id', Number(contactId));

        if (error) throw error;
        return true;
    } catch (err) {
        console.error(`Error deleting contact record ID ${contactId}:`, err);
        return false;
    }
}

/* =================================================
VERSION TRACKING BLOCK
====================================================
MODULE: view_3_contacts
FILE_TYPE: data_layer
TARGET_RELATION: view_5_issues_grid
==================================================== */
