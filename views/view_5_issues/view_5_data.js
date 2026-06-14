/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_data.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Data Service
POP-UP TITLE : Manage Facility Issues
LAST UPDATED : 2026-06-14 @ FINAL STABLE FIX
================================================================*/

import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityIssues(facilityId) {
    if (!facilityId) return [];

    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', facilityId);

    if (error) {
        console.error("fetchFacilityIssues error:", error);
        return [];
    }

    return (data || []).sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
}

export async function saveFacilityIssue(payload, id = null, linkedContactId = null) {

    // -------------------------------
    // HARD GUARD: facility_id MUST exist
    // -------------------------------
    if (!payload?.facility_id) {
        console.error("BLOCKED: facility_id is missing", payload);
        return { error: { message: "facility_id is required" }, data: null };
    }

    // -------------------------------
    // SAFE PAYLOAD MAPPING
    // -------------------------------
    const mappedPayload = {
        facility_id: payload.facility_id,
        title: payload.title || 'Maintenance Request',
        description: payload.description || '',
        severity: payload.priority || 'Medium',
        status: payload.status || 'Open',
        reported_by: payload.reported_by || 'Staff'
    };

    let result;

    // -------------------------------
    // ID NORMALIZATION (NO NaN EVER)
    // -------------------------------
    let cleanId = null;

    if (typeof id === 'object' && id !== null) {
        cleanId = id.id ?? null;
    } else {
        cleanId = id;
    }

    const numericId = Number(cleanId);

    const isValidUpdate =
        cleanId !== null &&
        cleanId !== undefined &&
        cleanId !== '' &&
        Number.isFinite(numericId);

    // -------------------------------
    // INSERT MODE
    // -------------------------------
    if (!isValidUpdate) {
        result = await supabase
            .from('facility_issues')
            .insert([mappedPayload])
            .select();

        if (result.error) {
            console.error("Insert error:", result.error);
            return { error: result.error, data: null };
        }

        return { error: null, data: result.data?.[0] || null };
    }

    // -------------------------------
    // UPDATE MODE
    // -------------------------------
    result = await supabase
        .from('facility_issues')
        .update(mappedPayload)
        .eq('id', numericId)
        .select();

    if (result.error) {
        console.error("Update error:", result.error);
        return { error: result.error, data: null };
    }

    return { error: null, data: result.data?.[0] || null };
}

export async function deleteFacilityIssue(issueId) {
    let cleanId = null;

    if (typeof issueId === 'object' && issueId !== null) {
        cleanId = issueId.id ?? null;
    } else {
        cleanId = issueId;
    }

    const numericId = Number(cleanId);

    if (!Number.isFinite(numericId)) {
        return { success: false };
    }

    await supabase
        .from('contact_issues')
        .delete()
        .eq('issue_id', numericId);

    const { error } = await supabase
        .from('facility_issues')
        .delete()
        .eq('id', numericId);

    return { success: !error, error };
}

export { saveFacilityIssue as insertFacilityIssue };
