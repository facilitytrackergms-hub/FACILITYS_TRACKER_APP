/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_data.js
File Pach : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_data.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-10 @ 03:55 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response before 
   showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents 
   of an existing file unless the current code is fully pasted 
   into the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for 
     custom notifications. Always add a distinct, visible ID or tag 
     to the message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
     including this header and all rules, wrapped completely inside 
     a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
     (File Name, Table, View, Title, Date, Time) are fully updated 
     and preserved at the top of the file.
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

export async function fetchVendorFiles(vendorId) {
    if (!vendorId) return [];

    const { data, error } = await supabase
        .from('vendor_files')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching vendor files:', error);
        return [];
    }

    return data || [];
}

export async function insertVendorFile(payload) {
    const clean = removeEmptyKeys({
        vendor_id: payload.vendor_id,
        file_type: payload.file_type || 'image',
        file_label: payload.file_label,
        file_name: payload.file_name,
        file_url: payload.file_url,
        storage_path: payload.storage_path,
        notes: payload.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('vendor_files')
        .insert([clean])
        .select();

    if (error) {
        console.error('[view_4_data.js] Error inserting vendor file:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

// Helper parsing fallbacks added to fix Module exports errors
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
UPDATED: 2026-06-10 @ 03:55 AM
================================================================*/
