/* =================================================
FILE: view_7_data.js
UPDATED: 2026-06-01
================================================= */

import { supabase } from '../../js/supabaseClient.js';

// Fetch follow-ups for a given issue
export async function fetchIssueFollowups(issueId) {
    const { data, error } = await supabase
        .from('facility_issues_followup')
        .select('*')
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });
    if (error) console.error(error);
    return data || [];
}

// Insert a new follow-up
export async function insertFollowup({ issue_id, note, followup_type, created_by }) {
    const { data, error } = await supabase
        .from('facility_issues_followup')
        .insert([{ issue_id, note, followup_type, created_by }])
        .select();
    if (error) console.error(error);
    return data?.[0] || null;
}
