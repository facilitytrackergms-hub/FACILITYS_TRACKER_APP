/* =================================================
FILE: views/view_5_issues/view_5_data.js
UPDATED: 2026-06-03 06:46:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityIssues(facilityId) {
    // Parse to an integer number to match the bigint database format
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return [];
    
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Database Error fetching issues:", error);
        return [];
    }

    if (data && data.length > 0) {
        return data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return data || [];
}

export async function fetchFacilityContacts(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return [];

    // Correct target to load explicitly from facility_contacts table structure
    const { data, error } = await supabase
        .from('facility_contacts')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Database Error fetching facility contacts:", error);
        return [];
    }
    return data || [];
}

export async function insertFacilityContact(contactPayload) {
    const safeFacilityId = parseInt(contactPayload.facility_id, 10);
    
    const mappedPayload = {
        facility_id: safeFacilityId,
        name: contactPayload.name || '',
        role: contactPayload.role || ''
    };

    const { data, error } = await supabase
        .from('facility_contacts')
        .insert([mappedPayload])
        .select();

    if (error) {
        console.error("Database Error inserting contact:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}

export async function saveFacilityIssue(payload, id = null, linkedContactId = null) {
    const safeFacilityId = parseInt(payload.facility_id, 10);
    
    // FIXED: Swapped 'initiated_by' out and mapped the incoming value to your true DB column: 'reported_by'
    const mappedPayload = {
        facility_id: safeFacilityId,
        title: payload.title || 'Maintenance Request',
        description: payload.description || '',
        severity: payload.priority || 'Medium',
        status: payload.status || 'Open',
        reported_by: payload.initiated_by || 'Staff'
    };

    let result;
    if (!id) {
        result = await supabase
            .from('facility_issues')
            .insert([mappedPayload])
            .select();
            
        // Junction linkage block: stitch relationship mapping inside memory rows if newly inserted
        if (!result.error && result.data && result.data[0] && linkedContactId) {
            const savedIssueId = result.data[0].id;
            const { error: junctionError } = await supabase
                .from('contact_issues')
                .insert([{
                    contact_id: parseInt(linkedContactId, 10),
                    issue_id: parseInt(savedIssueId, 10)
                }]);
                
            if (junctionError) {
                console.warn("Junction linkage mapping insertion error logged:", junctionError);
            }
        }
    } else {
        result = await supabase
            .from('facility_issues')
            .update(mappedPayload)
            .eq('id', parseInt(id, 10))
            .select();
    }

    if (result.error) {
        console.error("Database Error saving issue:", result.error);
        return { error: result.error, data: null };
    }
    return { error: null, data: result.data && result.data[0] ? result.data[0] : null };
}

/**
 * Permanently deletes an issue record from table storage.
 * Handles cleaning up related contact junction linkages seamlessly.
 */
export async function deleteFacilityIssue(issueId) {
    const safeIssueId = parseInt(issueId, 10);
    if (isNaN(safeIssueId)) return { success: false };

    // 1. Clean up junction linkages first to bypass relational dependency failures
    await supabase
        .from('contact_issues')
        .delete()
        .eq('issue_id', safeIssueId);

    // 2. Erase core issue entry completely
    const { error } = await supabase
        .from('facility_issues')
        .delete()
        .eq('id', safeIssueId);

    if (error) {
        console.error("Database Error deleting facility issue record:", error);
        return { success: false, error };
    }

    return { success: true };
}
