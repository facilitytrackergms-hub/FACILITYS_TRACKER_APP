/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_data.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Data Service
POP-UP TITLE : Manage Facility Issues
LAST UPDATED : 2026-06-14 @ FIXED SAFE VERSION
================================================================*/

import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityIssues(facilityId) {
    if (!facilityId) return [];

    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', facilityId);

    if (error) {
        console.error("Fetch error:", error);
        return [];
    }

    return (data || []).sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
}

export async function saveFacilityIssue(payload, id = null, linkedContactId = null) {

    // SAFE mapping (matches most Supabase setups)
    const mappedPayload = {
        facility_id: payload.facility_id,
        issue: payload.title || 'Maintenance Request',
        description: payload.description || '',
        priority: payload.priority || 'Medium',
        status: payload.status || 'Open',
        reported_by: payload.reported_by || 'Staff'
    };

    let result;

    // NORMALIZE ID SAFELY
    let safeId = null;

    if (id && typeof id === 'object') {
        safeId = id.id ?? null;
    } else {
        safeId = id;
    }

    const numericId = Number(safeId);

    const isValidUpdate =
        safeId !== null &&
        safeId !== undefined &&
        safeId !== '' &&
        Number.isFinite(numericId);

    // INSERT MODE
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

    // UPDATE MODE
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
    const safeId = Number(issueId);

    if (!Number.isFinite(safeId)) {
        return { success: false };
    }

    await supabase
        .from('contact_issues')
        .delete()
        .eq('issue_id', safeId);

    const { error } = await supabase
        .from('facility_issues')
        .delete()
        .eq('id', safeId);

    if (error) {
        console.error("Delete error:", error);
    }

    return { success: !error, error };
}

export { saveFacilityIssue as insertFacilityIssue };
