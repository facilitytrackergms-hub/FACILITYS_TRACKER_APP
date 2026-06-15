/*================================================================
FILE NAME : data.js
================================================================*/
const supabase = window.supabaseClient || window.supabase;

export async function fetchProjects(facilityId) {
    if (!supabase) return [];
    const { data, error } = await supabase.from('facility_projects').select('*').eq('facility_id', facilityId);
    return error ? [] : data;
}

export async function saveProject(projectData) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('facility_projects').insert([projectData]).select();
    return error ? null : data[0];
}
/*================================================================
END FILE: data.js
================================================================*/
