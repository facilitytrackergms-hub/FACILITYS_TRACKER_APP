/* =================================================
FILE: views/view_7_followups/view_7_data.js
UPDATED: 2026-06-02 06:05:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchIssueFollowups(issueId) {
    const { data, error } = await supabase
        .from('issue_followups')
        .select('*')
        .eq('issue_id', issueId)
        .order('timestamp', { ascending: true });

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
            .from('issue_followups')
            .update(payload)
            .eq('id', id)
            .select();
    } else {
        result = await supabase
            .from('issue_followups')
            .insert([payload])
            .select();
    }

    if (result.error) {
        console.error("Database Error saving follow-up:", result.error);
        return { error: result.error, data: null };
    }
    return { error: null, data: result.data && result.data[0] ? result.data[0] : null };
}
