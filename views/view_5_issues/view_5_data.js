/* =================================================
FILE: views/view_5_issues/view_5_data.js
UPDATED: 2026-06-02 08:35:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityIssues(facilityId) {
    // Ensure the ID is formatted as a string for UUID compatibility
    const safeId = String(facilityId);
    
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Database Error fetching issues:", error);
        return [];
    }

    // Safe frontend client-side fallback sorting
    if (data && data.length > 0) {
        return data.sort((a, b) => {
            const dateA = a.created_at || a.updated_at || 0;
            const dateB = b.created_at || b.updated_at || 0;
            return new Date(dateB) - new Date(dateA);
        });
    }

    return data || [];
}

export async function fetchFacilityContacts(facilityId) {
    const safeId = String(facilityId);

    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Database Error fetching contacts:", error);
        return [];
    }
    return data || [];
}

export async function insertFacilityContact(contactPayload) {
    // Correct column mapping: change 'name' to the database column 'contact_name'
    const mappedPayload = {
        facility_id: String(contactPayload.facility_id),
        contact_name: contactPayload.name || contactPayload.contact_name || '',
        role: contactPayload.role || ''
    };

    const { data, error } = await supabase
        .from('contacts')
        .insert([mappedPayload])
        .select();

    if (error) {
        console.error("Database Error inserting contact:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}

export async function saveFacilityIssue(payload, id = null) {
    // Correct column mapping: change UI 'initiated_by' to match database 'reported_by'
    const mappedPayload = {
        facility_id: String(payload.facility_id),
        description: payload.description || '',
        reported_by: payload.initiated_by || payload.reported_by || '',
        status: payload.status || 'Open',
        priority: payload.priority || 'Medium',
        updated_at: new Date().toISOString()
    };

    // If it's a new row, attach the creation timestamp safely
    if (!id) {
        mappedPayload.created_at = new Date().toISOString();
    }

    let result;
    if (!id) {
        result = await supabase
            .from('facility_issues')
            .insert([mappedPayload])
            .select();
    } else {
        result = await supabase
            .from('facility_issues')
            .update(mappedPayload)
            .eq('id', String(id))
            .select();
    }

    if (result.error) {
        console.error("Database Error saving issue:", result.error);
        return { error: result.error, data: null };
    }
    return { error: null, data: result.data && result.data[0] ? result.data[0] : null };
}
