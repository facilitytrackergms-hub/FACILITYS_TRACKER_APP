/* =================================================
FILE: view_5_data.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchIssues() {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching issues:", error);
        return [];
    }
    return data;
}

export async function insertIssue(issueObj) {
    const { data, error } = await supabase
        .from('facility_issues')
        .insert([{
            issue_title: issueObj.issue_title,
            tool_required_text: issueObj.tool_required_text,
            initiated_by_text: issueObj.initiated_by_text,
            notes: issueObj.notes,
            related_facility: issueObj.related_facility,
            related_project: issueObj.related_project || null,
            reported_by: issueObj.reported_by || null,
            open_issue: true
        }])
        .select();

    if (error) {
        console.error("Error inserting issue:", error);
        return null;
    }
    return data[0];
}

export async function updateIssue(id, issueObj) {
    const { data, error } = await supabase
        .from('facility_issues')
        .update({
            issue_title: issueObj.issue_title,
            tool_required_text: issueObj.tool_required_text,
            initiated_by_text: issueObj.initiated_by_text,
            notes: issueObj.notes,
            related_facility: issueObj.related_facility,
            related_project: issueObj.related_project || null,
            reported_by: issueObj.reported_by || null,
            open_issue: issueObj.open_issue
        })
        .eq('id', id)
        .select();

    if (error) {
        console.error("Error updating issue:", error);
        return null;
    }
    return data[0];
}
