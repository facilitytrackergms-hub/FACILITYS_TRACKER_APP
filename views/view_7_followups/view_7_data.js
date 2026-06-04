/* =================================================
FILE: views/view_7_followups/view_7_data.js
UPDATED: 2026-06-04 02:15:00 AM

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

/**
 * 🚨 FIXED: Added missing deletion function requested by view_7_modal.js
 * Removes a specific historic follow-up log record entry by ID.
 */
export async function deleteIssueFollowup(id) {
    if (!id) return { error: 'Missing row entry ID targeting key constraint.', data: null };

    const result = await supabase
        .from('issue_followups')
        .delete()
        .eq('id', id)
        .select();

    if (result.error) {
        console.error("Database Error removing follow-up entry record:", result.error);
        return { error: result.error, data: null };
    }
    
    return { error: null, data: result.data };
}
