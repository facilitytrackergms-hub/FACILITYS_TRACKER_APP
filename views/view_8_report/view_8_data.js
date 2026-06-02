/* =================================================
FILE: view_8_data.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from '../../js/supabaseClient.js';

// Fetch operational report for a given date
export async function fetchOperationalReport(date) {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .lte('created_at', date)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching operational report:", error);
        return [];
    }
    return data;
}

// Fetch daily report (summary)
export async function fetchDailyReport(date) {
    const { data, error } = await supabase
        .from('facility_issues')
        .select('id, issue_title, related_facility, open_issue')
        .lte('created_at', date)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching daily report:", error);
        return [];
    }
    return data;
}
