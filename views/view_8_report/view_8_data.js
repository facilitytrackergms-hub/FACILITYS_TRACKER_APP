/* =================================================
FILE: views/view_8_reports/view_8_data.js
UPDATED: 2026-06-02 06:10:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
const __FILENAME = 'view_8_data.js';

import { supabase } from '../../js/supabaseClient.js';

export async function fetchReportIssues(facilityId) {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Database Error fetching report issues:", error);
        return [];
    }
    return data || [];
}

export async function fetchIssueFollowups(issueId) {
    const { data, error } = await supabase
        .from('issue_followups')
        .select('*')
        .eq('issue_id', issueId)
        .order('timestamp', { ascending: true });

    if (error) {
        console.error("Database Error fetching issue followups:", error);
        return [];
    }
    return data || [];
}

export async function fetchFacilityImages(issueId) {
    const { data, error } = await supabase
        .from('facility_images')
        .select('*')
        .eq('issue_id', issueId);

    if (error) {
        console.error("Database Error fetching facility images:", error);
        return [];
    }
    return data || [];
}
