/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_data.js
SUPABASE TBL : facility_projects, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Vendor Project Filing Cabinet
POP-UP TITLE : Vendor Project Entry
LAST UPDATED : 2026-06-08 @ 10:45 PM
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
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_4_data.js';

import { supabase } from '../../js/supabaseClient.js';

const STORAGE_BUCKET = 'facility-images';

export async function fetchFacilityProjects(facilityId) {
    if (!facilityId) return [];

    const attempts = [
        { col: 'facility_id', val: facilityId },
        { col: 'facilityid', val: facilityId },
        { col: 'related_facility', val: facilityId }
    ];

    for (const attempt of attempts) {
        const { data, error } = await supabase
            .from('facility_projects')
            .select('*')
            .eq(attempt.col, attempt.val)
            .order('created_at', { ascending: false });

        if (!error) return data || [];
    }

    console.error('[view_4_data.js] Could not fetch facility projects with known facility columns.');
    return [];
}

export async function insertFacilityProject(payload) {
    const attempts = [
        {
            facility_id: payload.facility_id,
            title: payload.title,
            description: payload.description,
            status: payload.status || 'open',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            facility_id: payload.facility_id,
            project_title: payload.title,
            project_name: payload.title,
            notes: payload.description,
            status: payload.status || 'open',
            active_status: true,
            created_at: new Date().toISOString()
        },
        {
            facilityid: payload.facility_id,
            project_title: payload.title,
            project_name: payload.title,
            notes: payload.description,
            active_status: true,
            created_at: new Date().toISOString()
        }
    ];

    return await tryInsert('facility_projects', attempts, '[view_4_data.js] insertFacilityProject');
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
        address: payload.address,
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

export async function fetchVendorJobsByProjectIds(projectIds) {
    if (!projectIds || projectIds.length === 0) return [];

    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .select('*, vendors(*)')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching vendor jobs:', error);
        return [];
    }

    return data || [];
}

export async function fetchVendorJobsForFacility(facilityId) {
    const projects = await fetchFacilityProjects(facilityId);
    const projectIds = projects.map(p => p.id).filter(Boolean);
    const jobs = await fetchVendorJobsByProjectIds(projectIds);
    return attachProjectToJobs(jobs, projects);
}

export async function fetchVendorJobsForVendorInFacility(vendorId, facilityId) {
    const projects = await fetchFacilityProjects(facilityId);
    const projectIds = projects.map(p => p.id).filter(Boolean);
    if (projectIds.length === 0) return [];

    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .select('*, vendors(*)')
        .eq('vendor_id', vendorId)
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching vendor jobs for vendor:', error);
        return [];
    }

    return attachProjectToJobs(data || [], projects);
}

export async function fetchVendorJobById(jobId) {
    if (!jobId) return null;

    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .select('*, vendors(*)')
        .eq('id', jobId)
        .single();

    if (error) {
        console.error('[view_4_data.js] Error fetching vendor job:', error);
        return null;
    }

    return data;
}

export async function insertProjectVendorJob(payload) {
    const clean = removeEmptyKeys({
        project_id: payload.project_id,
        vendor_id: payload.vendor_id,
        job_title: payload.job_title,
        estimated_amount: normalizeMoney(payload.estimated_amount),
        estimate_date: payload.estimate_date,
        job_status: payload.job_status || 'open',
        job_scope: payload.job_scope,
        recommendation: payload.recommendation,
        approval_status: payload.approval_status || 'pending',
        main_image_url: payload.main_image_url,
        main_image_path: payload.main_image_path,
        notes: payload.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .insert([clean])
        .select();

    if (error) {
        console.error('[view_4_data.js] Error inserting project vendor job:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function updateProjectVendorJob(jobId, payload) {
    const clean = removeEmptyKeys({
        job_title: payload.job_title,
        estimated_amount: normalizeMoney(payload.estimated_amount),
        estimate_date: payload.estimate_date,
        job_status: payload.job_status,
        job_scope: payload.job_scope,
        recommendation: payload.recommendation,
        approval_status: payload.approval_status,
        approved_by: payload.approved_by,
        approved_at: payload.approved_at,
        main_image_url: payload.main_image_url,
        main_image_path: payload.main_image_path,
        notes: payload.notes,
        closed_at: payload.closed_at,
        closed_by: payload.closed_by,
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .update(clean)
        .eq('id', jobId)
        .select();

    if (error) {
        console.error('[view_4_data.js] Error updating vendor job:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function fetchVendorJobFiles(vendorJobId) {
    if (!vendorJobId) return [];

    const { data, error } = await supabase
        .from('project_vendor_job_files')
        .select('*')
        .eq('vendor_job_id', vendorJobId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching vendor job files:', error);
        return [];
    }

    return data || [];
}

export async function insertVendorJobFile(payload) {
    const clean = removeEmptyKeys({
        vendor_job_id: payload.vendor_job_id,
        followup_id: payload.followup_id,
        file_type: payload.file_type || 'file',
        file_name: payload.file_name,
        file_url: payload.file_url,
        storage_path: payload.storage_path,
        notes: payload.notes,
        uploaded_by: payload.uploaded_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('project_vendor_job_files')
        .insert([clean])
        .select();

    if (error) {
        console.error('[view_4_data.js] Error inserting vendor job file:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function fetchVendorJobFollowups(vendorJobId) {
    if (!vendorJobId) return [];

    const { data, error } = await supabase
        .from('project_vendor_job_followups')
        .select('*')
        .eq('vendor_job_id', vendorJobId)
        .order('followup_date', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching vendor job followups:', error);
        return [];
    }

    return data || [];
}

export async function insertVendorJobFollowup(payload) {
    const clean = removeEmptyKeys({
        vendor_job_id: payload.vendor_job_id,
        followup_type: payload.followup_type || 'note',
        followup_note: payload.followup_note,
        followup_by: payload.followup_by,
        followup_date: payload.followup_date || new Date().toISOString(),
        next_followup_date: payload.next_followup_date,
        completed: payload.completed || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('project_vendor_job_followups')
        .insert([clean])
        .select();

    if (error) {
        console.error('[view_4_data.js] Error inserting followup:', error);
        return { data: null, error };
    }

    return { data, error: null };
}

export async function uploadCabinetFile(file, folderName = 'vendor-job-files') {
    if (!file) {
        return { url: '', path: '', error: null };
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const storagePath = `${folderName}/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        console.error('[view_4_data.js] Storage upload error:', uploadError);
        return { url: '', path: '', error: uploadError };
    }

    const { data } = supabase
        .storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storagePath);

    return {
        url: data?.publicUrl || '',
        path: storagePath,
        error: null
    };
}

export function getProjectTitle(project) {
    return project?.title || project?.project_title || project?.project_name || 'Untitled Project';
}

export function getVendorName(vendor) {
    return vendor?.company_name || vendor?.name || 'Unnamed Vendor';
}

function attachProjectToJobs(jobs, projects) {
    const projectMap = new Map(projects.map(project => [String(project.id), project]));
    return (jobs || []).map(job => ({
        ...job,
        facility_project: projectMap.get(String(job.project_id)) || null
    }));
}

async function tryInsert(tableName, payloads, logTag) {
    let lastError = null;

    for (const payload of payloads) {
        const cleanPayload = removeEmptyKeys(payload);

        const { data, error } = await supabase
            .from(tableName)
            .insert([cleanPayload])
            .select();

        if (!error) return { data, error: null };

        lastError = error;
        console.warn(`${logTag}: insert attempt failed. Trying next shape.`, error);
    }

    return { data: null, error: lastError };
}

function normalizeMoney(value) {
    if (value === undefined || value === null || value === '') return undefined;
    const numberValue = Number(String(value).replace(/[$,]/g, ''));
    return Number.isFinite(numberValue) ? numberValue : undefined;
}

function removeEmptyKeys(obj) {
    const clean = {};

    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
            clean[key] = obj[key];
        }
    });

    return clean;
}

/*================================================================
END FILE: view_4_data.js
UPDATED: 2026-06-08 @ 10:45 PM
================================================================*/
