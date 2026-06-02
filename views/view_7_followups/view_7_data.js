/* =================================================
FILE: view_7_data.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFollowups(issueId) {
    const { data, error } = await supabase
        .from('facility_issues_followup')
        .select('*')
        .eq('related_issue', issueId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching follow-ups:", error);
        return [];
    }
    return data;
}

export async function insertFollowup(followupObj) {
    const { data, error } = await supabase
        .from('facility_issues_followup')
        .insert([{
            followup_title: followupObj.followup_title,
            followup_notes_text: followupObj.followup_notes_text,
            initiated_by_text: followupObj.initiated_by_text,
            related_issue: followupObj.related_issue,
            created_by: followupObj.created_by || null
        }])
        .select();

    if (error) {
        console.error("Error inserting follow-up:", error);
        return null;
    }
    return data[0];
}

export async function updateFollowup(id, followupObj) {
    const { data, error } = await supabase
        .from('facility_issues_followup')
        .update({
            followup_title: followupObj.followup_title,
            followup_notes_text: followupObj.followup_notes_text,
            initiated_by_text: followupObj.initiated_by_text,
            created_by: followupObj.created_by || null
        })
        .eq('id', id)
        .select();

    if (error) {
        console.error("Error updating follow-up:", error);
        return null;
    }
    return data[0];
}
