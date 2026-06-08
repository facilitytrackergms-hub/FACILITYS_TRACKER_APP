/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_data.js
SUPABASE TBL : facility_projects
VIEW NAME    : Projects
POP-UP TITLE : Create Project
LAST UPDATED : 2026-06-08 @ 08:55 PM
================================================================*/

import { supabase } from '../../js/supabaseClient.js';

export async function fetchProjects(facilityId) {
    if (!facilityId) return [];

    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return data || [];
}

export async function insertProject(projectData) {
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([projectData])
        .select();

    return { data, error };
}

export async function updateProject(projectId, projectData) {
    const { data, error } = await supabase
        .from('facility_projects')
        .update(projectData)
        .eq('id', projectId)
        .select();

    return { data, error };
}

export async function deleteProject(projectId) {
    const { error } = await supabase
        .from('facility_projects')
        .delete()
        .eq('id', projectId);

    return { error };
}

/*================================================================
END FILE: view_4_data.js
UPDATED: 2026-06-08 @ 08:55 PM
================================================================*/
