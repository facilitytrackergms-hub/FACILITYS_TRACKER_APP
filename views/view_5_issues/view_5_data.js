/* =================================================
FILE: controls_v5_data.js
UPDATED: 2026-05-30 06:00 AM
================================================= */
import { supabase } from '../js/supabaseClient.js';

export async function getFacilityContacts(facility_id) {
    return supabase
        .from('contacts')
        .select('*')
        .eq('facility_id', facility_id);
}

export async function getFacilityIssues(facility_id) {
    return supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', facility_id)
        .order('created_at', { ascending: false });
}

export async function insertFacilityIssue(issueData) {
    return supabase
        .from('facility_issues')
        .insert([issueData])
        .select();
}

export async function updateFacilityIssue(issueId, issueData) {
    return supabase
        .from('facility_issues')
        .update(issueData)
        .eq('id', issueId)
        .select();
}

export async function insertContact(contactData) {
    return supabase
        .from('contacts')
        .insert([contactData])
        .select();
}
