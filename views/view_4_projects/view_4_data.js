/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_data.js
File Path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_data.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-12 @ 12:06 PM
================================================================*/
const __FILENAME = 'view_4_data.js';

import { supabase } from '../../js/supabaseClient.js';

const STORAGE_BUCKET = 'facility-assets';

export async function fetchFacilityProjects(facilityRef) {
    if (!facilityRef) return [];

    const facilityId = await resolveFacilityId(facilityRef);

    if (!facilityId) {
        console.warn('[view_4_data.js] fetchFacilityProjects blocked: missing valid numeric facility_id.', facilityRef);
        return [];
    }

    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Could not fetch facility_projects.', error);
        return [];
    }

    return data || [];
}

export async function insertFacilityProject(payload) {
    const facilityId = await resolveFacilityId(payload.facility || payload.facility_id);

    if (!facilityId) {
        const error = {
            message: '[view_4_data.js] Missing valid numeric facility_id. Project was not saved because it would not attach to a facility.'
        };
        console.error(error.message, payload);
        return { data: null, error };
    }

    const clean = removeEmptyKeys({
        facility_id: facilityId,
        project_name_text: payload.project_name_text || payload.project_name || payload.title,
        project_title_text: payload.project_title_text || payload.project_title || payload.title,
        created_by_text: payload.created_by_text || payload.created_by,
        notes: payload.notes || payload.description,
        active_status: payload.active_status === undefined ? true : payload.active_status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('facility_projects')
        .insert([clean])
        .select();

    if (error) {
        console.error('[view_4_data.js] Error inserting facility project:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function fetchProjectActions(projectId) {
    if (!projectId) return [];

    const { data, error } = await supabase
        .from('project_actions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching project actions:', error);
        return [];
    }

    return data || [];
}

export async function insertProjectAction(payload) {
    if (!payload?.project_id) {
        const error = {
            message: '[view_4_data.js] Missing project_id. Project action was not saved.'
        };
        console.error(error.message, payload);
        return { data: null, error };
    }

    const clean = removeEmptyKeys({
        project_id: payload.project_id,
        action_type: payload.action_type || 'note',
        action_title_text: payload.action_title_text || payload.title || payload.action_title,
        notes: payload.notes || payload.description,
        created_by_text: payload.created_by_text || payload.created_by,
        active_status: payload.active_status === undefined ? true : payload.active_status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('project_actions')
        .insert([clean])
        .select();

    if (error) {
        console.error('[view_4_data.js] Error inserting project action:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function fetchVendors() {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('company_name', { ascending: true });

    if (error) {
        console.error('[view_4_data.js] Error fetching vendors:', error);
        return [];
    }

    return data || [];
}

export async function insertVendor(payload) {
    const clean = removeEmptyKeys({
        company_name: payload.company_name,
        contact_name: payload.contact_name,
        phone: payload.phone,
        email: payload.email,
        website_url: payload.website_url,
        address: payload.address,
        main_image_url: payload.main_image_url,
        main_image_path: payload.main_image_path,
        notes: payload.notes,
        status: payload.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('vendors')
        .insert([clean])
        .select();

    if (error) {
        console.error('[view_4_data.js] Error inserting vendor:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export function getProjectTitle(project) {
    if (!project) return 'Untitled Project';
    return project.project_title_text || project.project_name_text || project.title || project.project_name || 'Untitled Project';
}

export function getVendorName(vendor) {
    if (!vendor) return 'Unknown Vendor';
    return vendor.company_name || vendor.vendor_name || vendor.name || 'Unknown Vendor';
}

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
        if (obj[k] !== undefined) {
            out[k] = obj[k];
        }
    }
    return out;
}

/*================================================================
END FILE: view_4_data.js
UPDATED: 2026-06-12 @ 12:06 PM
================================================================*/
