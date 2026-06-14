/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_data.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Data Service
POP-UP TITLE : Manage Facility Issues
LAST UPDATED : 2026-06-13 @ 08:32 PM
================================================================*/

import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityIssues(facilityId) {
    const safeId = facilityId;

    if (!safeId) return [];

    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Database Error fetching issues:", error);
        return [];
    }

    return (data || []).sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
}

export async function fetchFacilityContacts(facilityId) {
    const safeId = facilityId;

    if (!safeId) return [];

    const { data, error } = await supabase
        .from('facility_contacts')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Database Error fetching contacts:", error);
        return [];
    }

    return data || [];
}

export async function saveFacilityIssue(payload, id = null, linkedContactId = null) {

    const safeFacilityId = payload.facility_id;

    const mappedPayload = {
        facility_id: safeFacilityId,
        title: payload.title || 'Maintenance Request',
        description: payload.description || '',
        severity: payload.priority || 'Medium',
        status: payload.status || 'Open',
        reported_by: payload.reported_by || payload.initiated_by || 'Staff'
    };

    let result;

    if (!id) {
        result = await supabase
            .from('facility_issues')
            .insert([mappedPayload])
            .select();

        if (!result.error && result.data?.[0] && linkedContactId) {
            await supabase
                .from('contact_issues')
                .insert([{
                    contact_id: linkedContactId,
                    issue_id: result.data[0].id
                }]);
        }
    } else {
        result = await supabase
            .from('facility_issues')
            .update(mappedPayload)
            .eq('id', id)
            .select();
    }

    if (result.error) {
        return { error: result.error, data: null };
    }

    return { error: null, data: result.data?.[0] || null };
}

export async function deleteFacilityIssue(issueId) {
    const safeId = issueId;
    if (!safeId) return { success: false };

    await supabase
        .from('contact_issues')
        .delete()
        .eq('issue_id', safeId);

    const { error } = await supabase
        .from('facility_issues')
        .delete()
        .eq('id', safeId);

    if (error) {
        return { success: false, error };
    }

    return { success: true };
}

export { saveFacilityIssue as insertFacilityIssue };
