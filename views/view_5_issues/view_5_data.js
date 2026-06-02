/* =================================================
FILE: views/view_5_issues/view_5_data.js
UPDATED: 2026-06-02 05:55:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityIssues(facilityId) {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Database Error fetching issues:", error);
        return [];
    }
    return data || [];
}

export async function fetchFacilityContacts(facilityId) {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('facility_id', facilityId);

    if (error) {
        console.error("Database Error fetching contacts:", error);
        return [];
    }
    return data || [];
}

export async function insertFacilityContact(contactPayload) {
    const { data, error } = await supabase
        .from('contacts')
        .insert([contactPayload])
        .select();

    if (error) {
        console.error("Database Error inserting contact:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}

export async function saveFacilityIssue(payload, id = null) {
    let result;
    if (!id) {
        result = await supabase
            .from('facility_issues')
            .insert([payload])
            .select();
    } else {
        result = await supabase
            .from('facility_issues')
            .update(payload)
            .eq('id', id)
            .select();
    }

    if (result.error) {
        console.error("Database Error saving issue:", result.error);
        return { error: result.error, data: null };
    }
    return { error: null, data: result.data && result.data[0] ? result.data[0] : null };
}
