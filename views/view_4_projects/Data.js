/*================================================================
FILE METADATA
================================================================
FILE NAME    : Data.js
File path    : FACILITYS_TRACKER_APP/views/view_4_projects/Data.js
SUPABASE TBL : facility_projects, project_actions
VIEW NAME    : View 4 Project Data Layer
LAST UPDATED : 2026-06-15 @ 07:00 PM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.
2. PRESERVATION: Do NOT refactor or optimize unless requested.
3. CODE COMPLETENESS: Provide the full updated file.
4. METADATA AUTO-UPDATE: On every code delivery, update the 
   Last Updated date and time.
================================================================*/

const supabase = window.supabaseClient || window.supabase;

// ==============================================================================
//                            PROJECT DATA OPERATIONS
// ==============================================================================

export async function fetchProjects(facilityId) {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facilityId);
    
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data;
}

export async function saveProject(projectData) {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([projectData])
        .select();
        
    if (error) {
        console.error('Error saving project:', error);
        return null;
    }
    return data[0];
}

// ==============================================================================
//                            ACTION DATA OPERATIONS
// ==============================================================================

export async function fetchProjectActions(projectId) {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('project_actions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error('Error fetching actions:', error);
        return [];
    }
    return data;
}

export async function saveProjectAction(actionData) {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('project_actions')
        .insert([actionData])
        .select();
        
    if (error) {
        console.error('Error saving action:', error);
        return null;
    }
    return data[0];
}

/*================================================================
END FILE: Data.js
================================================================*/
