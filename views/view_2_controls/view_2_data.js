/* =================================================
FILE: view_2_data.js
UPDATED: 2026-06-01 10:30:00 AM
================================================= */
import { supabase } from '../../js/supabaseClient.js';

// Fetch all projects for a facility
export async function fetchFacilityProjects(facility_id) {
    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facility_id)
        .order('created_at', { ascending: true });
    if (error) console.error('Fetch projects error:', error);
    return data;
}

// Fetch issues for a facility
export async function fetchFacilityIssues(facility_id) {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('related_facility', facility_id)
        .order('created_at', { ascending: true });
    if (error) console.error('Fetch issues error:', error);
    return data;
}

// Fetch followups for an issue
export async function fetchIssueFollowups(issue_id) {
    const { data, error } = await supabase
        .from('facility_issues_followup')
        .select('*')
        .eq('issue_id', issue_id)
        .order('created_at', { ascending: true });
    if (error) console.error('Fetch followups error:', error);
    return data;
}

// Insert a new project
export async function insertProject(facility_id, project_name, project_title, budget, notes, created_by) {
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([{ facility_id, project_name, project_title, budget, notes, created_by }]);
    if (error) console.error('Insert project error:', error);
    return data;
}

// Insert a new issue
export async function insertIssue(issue_obj) {
    const { data, error } = await supabase
        .from('facility_issues')
        .insert([issue_obj]);
    if (error) console.error('Insert issue error:', error);
    return data;
}

// Insert a followup
export async function insertFollowup(issue_id, note, followup_type, created_by) {
    const { data, error } = await supabase
        .from('facility_issues_followup')
        .insert([{ issue_id, note, followup_type, created_by }]);
    if (error) console.error('Insert followup error:', error);
    return data;
}
