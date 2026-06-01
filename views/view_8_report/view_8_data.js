/* =================================================
FILE: view_8_data.js
UPDATED: 2026-06-01
================================================= */

import { supabase } from '../../js/supabaseClient.js';

// Fetch issues for report
export async function fetchReportIssues(facilityId) {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('related_facility', facilityId)
        .order('created_at', { ascending: false });
    if (error) console.error(error);
    return data || [];
}

// Fetch projects for report
export async function fetchReportProjects(facilityId) {
    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });
    if (error) console.error(error);
    return data || [];
}

// Fetch follow-ups for report
export async function fetchReportFollowups(issueId) {
    const { data, error } = await supabase
        .from('facility_issues_followup')
        .select('*')
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });
    if (error) console.error(error);
    return data || [];
}
