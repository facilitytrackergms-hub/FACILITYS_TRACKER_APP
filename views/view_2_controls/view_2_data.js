/* =================================================
FILE: controls_v2_data.js
UPDATED: 2026-05-30 12:35:00 PM
STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../js/supabaseClient.js';

// Fetch contacts
export async function getContacts(facility_id) {
    return supabase
        .from('contacts')
        .select('id, name, role, phone, email, notes, facility_id, created_at, updated_at')
        .eq('facility_id', facility_id);
}

// Insert a new contact
export async function insertContact(name, role, phone, email, notes = '', facility_id = null) {
    const insertObject = { name, role, phone, email, notes, facility_id };
    const { data, error } = await supabase
        .from('contacts')
        .insert([insertObject])
        .select('id, name, role, phone, email, notes, facility_id, created_at, updated_at');
    if (error) { console.error("contacts insert error:", error); return null; }
    return data && data[0] ? data[0] : null;
}

// Fetch projects
export async function getProjects(facility_id) {
    return supabase
        .from('facility_projects')
        .select('id, facility_id, project_name, project_title, budget, notes, active_status, created_by, created_at, updated_at')
        .eq('facility_id', facility_id)
        .eq('active_status', true);
}

// Insert a new project
export async function insertProject(facility_id, project_name, project_title, budget, notes = '', active_status = true, created_by = null) {
    const insertObject = { facility_id, project_name, project_title, budget, notes, active_status, created_by };
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([insertObject])
        .select('id, facility_id, project_name, project_title, budget, notes, active_status, created_by, created_at, updated_at');
    if (error) { console.error("facility_projects insert error:", error); return null; }
    return data && data[0] ? data[0] : null;
}

// Fetch individual issues
export async function getFacilityIssues(facility_id) {
    return supabase
        .from('facility_issues')
        .select('id, created_at, open_issue, issue, tool_required, initiated_by, related_facility, related_project, reported_by, notes, updated_at')
        .eq('related_facility', facility_id)
        .eq('open_issue', true);
}

// Insert a new issue
export async function insertFacilityIssue(issueObj) {
    const { data, error } = await supabase
        .from('facility_issues')
        .insert([issueObj])
        .select('id, created_at, open_issue, issue, tool_required, initiated_by, related_facility, related_project, reported_by, notes, updated_at');
    if (error) { console.error("facility_issues insert error:", error); return null; }
    return data && data[0] ? data[0] : null;
}

// Fetch facility header image
export async function getFacilityHeaderImage(facility_id) {
    const { data, error } = await supabase
        .from('facility_images')
        .select('id, related_table, related_id, image_url, caption, uploaded_by, created_at, updated_at')
        .eq('related_table', 'facilities')
        .eq('related_id', facility_id)
        .order('created_at', { ascending: true })
        .limit(1);
    return { data, error };
}

// Subscribe to issue changes
export function subscribeFacilityIssues(facility_id, callback) {
    const channelName = `facility_controls_realtime_${facility_id}`;
    supabase.removeChannel(supabase.channel(channelName));
    return supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'facility_issues', filter: `related_facility=eq.${facility_id}` },
            callback
        )
        .subscribe();
}
