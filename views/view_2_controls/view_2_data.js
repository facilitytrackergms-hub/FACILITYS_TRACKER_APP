export async function insertProject(projectObj) {
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([{
            project_name_text: projectObj.project_name,
            project_title_text: projectObj.project_title,
            created_by_text: projectObj.created_by_text || '',

            facility_id: projectObj.facility_id,
            active_status: projectObj.active_status ?? true,
            created_by: projectObj.created_by || null,
            notes: projectObj.notes || ''
        }])
        .select();

    if (error) console.error("Project insert error:", error);
    return data && data[0] ? data[0] : null;
}
