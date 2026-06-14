/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_data.js
SUPABASE TBL : facility_issues
VIEW NAME    : Facility Issues Data Service
POP-UP TITLE : Manage Facility Issues
LAST UPDATED : 2026-06-14 @ 07:00 AM
================================================================*/

import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityIssues(facilityId) {
    const safeId = facilityId;
    if (!safeId) return [];

    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', safeId);

    if (error) return [];
    return (data || []).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function saveFacilityIssue(payload, id = null, linkedContactId = null) {
    const mappedPayload = {
        facility_id: payload.facility_id,
        title: payload.title || 'Maintenance Request',
        description: payload.description || '',
        severity: payload.priority || 'Medium',
        status: payload.status || 'Open',
        reported_by: payload.reported_by || 'Staff'
    };

    let result;

    if (!id) {
        result = await supabase.from('facility_issues').insert([mappedPayload]).select();
    } else {
        // FORCE PRIMITIVE ID
        const primitiveId = parseInt(id, 10);
        
        result = await supabase
            .from('facility_issues')
            .update(mappedPayload)
            .eq('id', primitiveId)
            .select();
    }

    if (result.error) return { error: result.error, data: null };
    return { error: null, data: result.data?.[0] || null };
}

export async function deleteFacilityIssue(issueId) {
    const safeId = parseInt(issueId, 10);
    if (isNaN(safeId)) return { success: false };

    await supabase.from('contact_issues').delete().eq('issue_id', safeId);
    const { error } = await supabase.from('facility_issues').delete().eq('id', safeId);
    
    return { success: !error, error };
}

export { saveFacilityIssue as insertFacilityIssue };
