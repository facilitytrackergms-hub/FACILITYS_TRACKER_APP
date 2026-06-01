/* =================================================
FILE: view_5_data.js
UPDATED: 2026-06-01
================================================= */

import { supabase } from '../../js/supabaseClient.js';

// Fetch all issues for a given facility
export async function fetchIssues(facilityId) {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('related_facility', facilityId)
        .order('created_at', { ascending: false });
    if (error) console.error(error);
    return data || [];
}

// Insert a new issue
export async function insertIssue({ issue, tool_required, initiated_by, related_facility, notes }) {
    const { data, error } = await supabase
        .from('facility_issues')
        .insert([{ issue, tool_required, initiated_by, related_facility, notes, open_issue: true }])
        .select();
    if (error) console.error(error);
    return data?.[0] || null;
}
