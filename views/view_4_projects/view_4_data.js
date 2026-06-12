/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_data.js
File Path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_data.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-12 @ 2:20 PM
================================================================*/
const __FILENAME = 'view_4_data.js';

import { supabase } from '../../js/supabaseClient.js';

const STORAGE_BUCKET = 'facility-assets';

/* ==========================================
   FACILITY PROJECTS
   ========================================== */
export async function fetchFacilityProjects(facilityRef) {
    console.log('[view_4_data.js] fetchFacilityProjects called with', facilityRef);
    if (!facilityRef) return [];

    const facilityId = await resolveFacilityId(facilityRef);
    console.log('[view_4_data.js] Resolved facilityId:', facilityId);

    if (!facilityId) {
        console.warn('[view_4_data.js] fetchFacilityProjects blocked: missing valid numeric facility_id.', facilityRef);
        return [];
    }

    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Could not fetch facility_projects.', error);
        return [];
    }

    console.log('[view_4_data.js] fetchFacilityProjects returned', data?.length || 0, 'records');
    return data || [];
}

export async function insertFacilityProject(projectData) {
    console.log('[view_4_data.js] insertFacilityProject called', projectData);
    const cleanData = removeEmptyKeys(projectData);
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([cleanData])
        .select();
    if (error) { console.error('[view_4_data.js] Error inserting project:', error); throw error; }
    return data?.[0] || null;
}

export async function getProjectTitle(projectId) {
    console.log('[view_4_data.js] getProjectTitle called for project:', projectId);
    if (!projectId) return '';
    
    const { data, error } = await supabase
        .from('facility_projects')
        .select('title')
        .eq('id', projectId)
        .single();
        
    if (error) {
        console.error('[view_4_data.js] Error fetching project title:', error);
        return '';
    }
    
    return data?.title || '';
}

/* ==========================================
   PROJECT ACTIONS
   ========================================== */
export async function fetchProjectActions(projectId) {
    console.log('[view_4_data.js] fetchProjectActions called for project:', projectId);
    const { data, error } = await supabase
        .from('project_actions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
    if (error) { console.error('[view_4_data.js] Error fetching project actions:', error); return []; }
    return data || [];
}

export async function insertProjectAction(actionData) {
    console.log('[view_4_data.js] insertProjectAction called', actionData);
    const cleanData = removeEmptyKeys(actionData);
    const { data, error } = await supabase
        .from('project_actions')
        .insert([cleanData])
        .select();
    if (error) { console.error('[view_4_data.js] Error inserting action:', error); throw error; }
    return data?.[0] || null;
}

/* ==========================================
   VENDORS & VENDOR FILES
   ========================================== */
export async function fetchVendors() {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name', { ascending: true });
    if (error) { console.error('[view_4_data.js] Error fetching vendors:', error); return []; }
    return data || [];
}

export async function insertVendor(vendorData) {
    const cleanData = removeEmptyKeys(vendorData);
    const { data, error } = await supabase
        .from('vendors')
        .insert([cleanData])
        .select();
    if (error) { throw error; }
    return data?.[0] || null;
}

/* ==========================================
   PROJECT VENDOR JOBS
   ========================================== */
export async function fetchProjectVendorJobs(projectId) {
    console.log('[view_4_data.js] fetchProjectVendorJobs called for project:', projectId);
    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .select('*')
        .eq('project_id', projectId);
    if (error) { console.error('[view_4_data.js] Error fetching vendor jobs:', error); return []; }
    return data || [];
}

export async function insertProjectVendorJob(jobData) {
    console.log('[view_4_data.js] insertProjectVendorJob called', jobData);
    const cleanData = removeEmptyKeys(jobData);
    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .insert([cleanData])
        .select();
    if (error) { 
        console.error('[view_4_data.js] Error inserting vendor job:', error); 
        throw error; 
    }
    return data?.[0] || null;
}

/* ==========================================
   JOB FILES & FOLLOWUPS
   ========================================== */
export async function insertProjectVendorJobFile(fileData) {
    const cleanData = removeEmptyKeys(fileData);
    const { data, error } = await supabase
        .from('project_vendor_job_files')
        .insert([cleanData])
        .select();
    if (error) throw error;
    return data?.[0] || null;
}

export async function insertProjectVendorJobFollowup(followupData) {
    const cleanData = removeEmptyKeys(followupData);
    const { data, error } = await supabase
        .from('project_vendor_job_followups')
        .insert([cleanData])
        .select();
    if (error) throw error;
    return data?.[0] || null;
}

/* ==========================================
   HELPERS
   ========================================== */
async function resolveFacilityId(facilityRef) {
    if (!facilityRef) return null;
    if (typeof facilityRef === 'number') return facilityRef;
    if (typeof facilityRef === 'string' && !isNaN(facilityRef)) return Number(facilityRef);
    if (typeof facilityRef === 'object' && facilityRef.id) return Number(facilityRef.id);
    return null;
}

function removeEmptyKeys(obj) {
    const out = {};
    for (const k in obj) {
        if (obj[k] !== undefined && obj[k] !== null) {
            out[k] = obj[k];
        }
    }
    return out;
}
/*================================================================
END FILE: view_4_data.js
UPDATED: 2026-06-12 @ 2:20 PM
================================================================*/
