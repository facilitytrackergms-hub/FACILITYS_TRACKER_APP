/* =================================================
FILE: views/view_4_projects/view_4_data.js
UPDATED: 2026-06-02 05:50:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilityProjects(facilityId) {
    // Converting table name and query constraints to strict lowercase
    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facilityId);

    if (error) {
        console.error("Database Error:", error);
        return [];
    }
    return data || [];
}

export async function insertFacilityProject(payload) {
    // Enforcing strict lowercase mapping for all data columns
    const cleanPayload = {
        project_title: payload.project_title,
        project_name: payload.project_name,
        budget: payload.budget,
        notes: payload.notes,
        facility_id: payload.facility_id,
        facilityid: payload.facilityid,
        active_status: payload.active_status,
        created_at: payload.created_at
    };

    const { data, error } = await supabase
        .from('facility_projects')
        .insert([cleanPayload])
        .select();

    if (error) {
        console.error("Database Error:", error);
        throw error;
    }
    return data;
}
