/* =================================================
FILE: view_4_data.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchProjects() {
    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
    return data;
}

export async function insertProject(projectObj) {
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([{
            project_name_text: projectObj.project_name,
            project_title_text: projectObj.project_title,
            created_by_text: projectObj.created_by,
            facility_id: projectObj.facility_id,
            active_status: projectObj.active_status ?? true,
            notes: projectObj.notes
        }])
        .select();

    if (error) {
        console.error("Error inserting project:", error);
        return null;
    }
    return data[0];
}

export async function updateProject(id, projectObj) {
    const { data, error } = await supabase
        .from('facility_projects')
        .update({
            project_name_text: projectObj.project_name,
            project_title_text: projectObj.project_title,
            created_by_text: projectObj.created_by,
            facility_id: projectObj.facility_id,
            active_status: projectObj.active_status ?? true,
            notes: projectObj.notes
        })
        .eq('id', id)
        .select();

    if (error) {
        console.error("Error updating project:", error);
        return null;
    }
    return data[0];
}
