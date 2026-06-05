/* =================================================
FILE: views/view_7_followups/view_7_data.js
UPDATED: 2026-06-04 09:12:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchIssueFollowups(issueId) {
    // Defensive check to match against column data types gracefully
    const safeIssueId = isNaN(issueId) ? issueId : parseInt(issueId, 10);

    const { data, error } = await supabase
        .from('facility_issues_followup')
        .select('*')
        .eq('related_issue', safeIssueId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Database Error fetching follow-ups:", error);
        return [];
    }
    return data || [];
}

export async function saveIssueFollowup(payload, id = null) {
    let result;
    if (id) {
        result = await supabase
            .from('facility_issues_followup')
            .update(payload)
            .eq('id', id)
            .select();
    } else {
        result = await supabase
            .from('facility_issues_followup')
            .insert([payload])
            .select();
    }

    if (result.error) {
        console.error("Database Error saving follow-up:", result.error);
        return { error: result.error, data: null };
    }
    return { error: null, data: result.data && result.data[0] ? result.data[0] : null };
}

export async function deleteIssueFollowup(id) {
    if (!id) return false;

    const result = await supabase
        .from('facility_issues_followup')
        .delete()
        .eq('id', id)
        .select();

    if (result.error) {
        console.error("Database Error removing follow-up entry:", result.error);
        return false;
    }
    return true;
}
