/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_data.js
File Path    : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_core/view_4_data.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups, reports, report_notes, report_attachments
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-13 @ 02:05 PM
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

import { supabase } from '../../../js/supabaseClient.js';

export async function fetchFacilityProjects(facilityId) {
    if (!facilityId) return [];
    const id = await resolveFacilityId(facilityId);
    if (!id) return [];

    const { data, error } = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', id)
        .eq('active_status', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching facility projects:', error);
        return [];
    }
    return data || [];
}

export async function fetchProjectActions(projectId) {
    if (!projectId) return [];
    const { data, error } = await supabase
        .from('project_actions')
        .select('*')
        .eq('project_id', projectId)
        .eq('active_status', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching project actions:', error);
        return [];
    }
    return data || [];
}

export async function insertFacilityProject(rowData) {
    const cleanData = removeEmptyKeys(rowData);
    const { data, error } = await supabase
        .from('facility_projects')
        .insert([cleanData])
        .select();
    return { data, error };
}

export async function insertProjectAction(rowData) {
    const cleanData = removeEmptyKeys(rowData);
    const { data, error } = await supabase
        .from('project_actions')
        .insert([cleanData])
        .select();
    return { data, error };
}

export async function fetchVendors() {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('status', 'active')
        .order('company_name', { ascending: true });
    if (error) {
        console.error('[view_4_data.js] Error fetching vendors:', error);
        return [];
    }
    return data || [];
}

export async function insertVendor(rowData) {
    const cleanData = removeEmptyKeys(rowData);
    const { data, error } = await supabase
        .from('vendors')
        .insert([cleanData])
        .select();
    return { data, error };
}

export async function fetchVendorFiles(projectId) {
    if (!projectId) return [];
    const { data, error } = await supabase
        .from('vendor_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('active_status', true)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('[view_4_data.js] Error fetching vendor files:', error);
        return [];
    }
    return data || [];
}

export async function insertVendorFile(rowData) {
    const cleanData = removeEmptyKeys(rowData);
    const { data, error } = await supabase
        .from('vendor_files')
        .insert([cleanData])
        .select();
    return { data, error };
}

export async function uploadCabinetFile(bucket, filePath, fileObj) {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileObj, { upsert: true });
        if (error) return { error };
        
        const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
            
        return { publicUrl: publicData?.publicUrl || null };
    } catch (err) {
        return { error: err };
    }
}

export async function fetchProjectVendorJobs(projectId) {
    if (!projectId) return [];
    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .select('*')
        .eq('project_id', projectId)
        .eq('active_status', true)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('[view_4_data.js] Error fetching vendor jobs:', error);
        return [];
    }
    return data || [];
}

export async function insertProjectVendorJob(rowData) {
    const cleanData = removeEmptyKeys(rowData);
    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .insert([cleanData])
        .select();
    return { data, error };
}

export async function fetchVendorJobFiles(jobId) {
    if (!jobId) return [];
    const { data, error } = await supabase
        .from('project_vendor_job_files')
        .select('*')
        .eq('job_id', jobId)
        .eq('active_status', true)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('[view_4_data.js] Error fetching vendor job files:', error);
        return [];
    }
    return data || [];
}

export async function insertVendorJobFile(rowData) {
    const cleanData = removeEmptyKeys(rowData);
    const { data, error } = await supabase
        .from('project_vendor_job_files')
        .insert([cleanData])
        .select();
    return { data, error };
}

export async function insertVendorJobFollowup(rowData) {
    const cleanData = removeEmptyKeys(rowData);
    const { data, error } = await supabase
        .from('project_vendor_job_followups')
        .insert([cleanData])
        .select();
    return { data, error };
}

export async function fetchVendorJobFollowups(jobId) {
    if (!jobId) return [];
    const { data, error } = await supabase
        .from('project_vendor_job_followups')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('[view_4_data.js] Error fetching vendor job followups:', error);
        return [];
    }
    return data || [];
}

/**
 * Fetches vendor jobs specifically filtered by vendorId and cross-referenced with a facilityId.
 */
export async function fetchVendorJobsForVendorInFacility(vendorId, facilityId) {
    if (!vendorId || !facilityId) return [];
    const fId = await resolveFacilityId(facilityId);
    if (!fId) return [];

    // 1. Get all active projects for the specified facility
    const projects = await fetchFacilityProjects(fId);
    if (!projects || projects.length === 0) return [];

    const projectIds = projects.map(p => p.id);

    // 2. Query vendor jobs belonging to those projects and matching the vendorId
    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('active_status', true)
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching vendor jobs for vendor in facility:', error);
        return [];
    }
    return data || [];
}

export async function fetchReportsByProject(projectId) {
    if (!projectId) return [];

    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('project_id', projectId)
        .eq('active_status', true)
        .order('last_edited_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Error fetching reports by project:', error);
        return [];
    }
    return data || [];
}

export async function fetchReportById(reportId) {
    if (!reportId) return null;

    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();

    if (error) {
        console.error('[view_4_data.js] Error fetching report by id:', error);
        return null;
    }
    return data;
}

export async function createReport(rowData) {
    const cleanData = removeEmptyKeys({
        ...rowData,
        report_status: rowData?.report_status || 'Draft',
        report_version: rowData?.report_version || 1,
        active_status: rowData?.active_status !== undefined ? rowData.active_status : true,
        last_edited_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('reports')
        .insert([cleanData])
        .select()
        .maybeSingle();

    return { data, error };
}

export async function updateReport(reportId, rowData) {
    if (!reportId) return { data: null, error: 'Missing reportId' };

    const cleanData = removeEmptyKeys({
        ...rowData,
        last_edited_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('reports')
        .update(cleanData)
        .eq('id', reportId)
        .select()
        .maybeSingle();

    return { data, error };
}

export async function fetchReportNotes(reportId) {
    if (!reportId) return [];

    const { data, error } = await supabase
        .from('report_notes')
        .select('*')
        .eq('report_id', reportId)
        .eq('active_status', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('[view_4_data.js] Error fetching report notes:', error);
        return [];
    }
    return data || [];
}

export async function insertReportNote(rowData) {
    const cleanData = removeEmptyKeys({
        ...rowData,
        active_status: rowData?.active_status !== undefined ? rowData.active_status : true
    });

    const { data, error } = await supabase
        .from('report_notes')
        .insert([cleanData])
        .select()
        .maybeSingle();

    return { data, error };
}

export async function updateReportNote(noteId, rowData) {
    if (!noteId) return { data: null, error: 'Missing noteId' };

    const cleanData = removeEmptyKeys({
        ...rowData,
        updated_at: new Date().toISOString()
    });

    const { data, error } = await supabase
        .from('report_notes')
        .update(cleanData)
        .eq('id', noteId)
        .select()
        .maybeSingle();

    return { data, error };
}

export async function fetchReportAttachments(reportId) {
    if (!reportId) return [];

    const { data, error } = await supabase
        .from('report_attachments')
        .select('*')
        .eq('report_id', reportId)
        .eq('active_status', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('[view_4_data.js] Error fetching report attachments:', error);
        return [];
    }
    return data || [];
}

export async function insertReportAttachment(rowData) {
    const cleanData = removeEmptyKeys({
        ...rowData,
        active_status: rowData?.active_status !== undefined ? rowData.active_status : true
    });

    const { data, error } = await supabase
        .from('report_attachments')
        .insert([cleanData])
        .select()
        .maybeSingle();

    return { data, error };
}

export async function updateReportAttachment(attachmentId, rowData) {
    if (!attachmentId) return { data: null, error: 'Missing attachmentId' };

    const cleanData = removeEmptyKeys(rowData);

    const { data, error } = await supabase
        .from('report_attachments')
        .update(cleanData)
        .eq('id', attachmentId)
        .select()
        .maybeSingle();

    return { data, error };
}

export async function deleteReportAttachment(attachmentId) {
    if (!attachmentId) return { data: null, error: 'Missing attachmentId' };

    const { data, error } = await supabase
        .from('report_attachments')
        .delete()
        .eq('id', attachmentId)
        .select();

    return { data, error };
}

export async function removeReportAttachment(attachmentId) {
    if (!attachmentId) return { data: null, error: 'Missing attachmentId' };

    const { data, error } = await supabase
        .from('report_attachments')
        .update({ active_status: false })
        .eq('id', attachmentId)
        .select()
        .maybeSingle();

    return { data, error };
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

/**
 * Fetches a single vendor job record by its explicit database ID.
 * Cross-references linked relationship records for rendering dependencies.
 */
export async function fetchVendorJobById(vendorJobId) {
    if (!vendorJobId) return null;
    const { data, error } = await supabase
        .from('project_vendor_jobs')
        .select('*, vendors(*), facility_project:project_id(*)')
        .eq('id', vendorJobId)
        .maybeSingle();

    if (error) {
        console.error('[view_4_data.js] Error fetching vendor job by id:', error);
        return null;
    }
    return data;
}

/* Syntactic aliases mapped to support view_4_modal.js consumer requirements */
export const saveNewProject = insertFacilityProject;
export const saveProjectAction = insertProjectAction;
export const saveVendorJob = insertProjectVendorJob;
export const fetchVendorJobs = fetchProjectVendorJobs;
export const saveJobFollowup = insertVendorJobFollowup;
export const fetchJobFollowups = fetchVendorJobFollowups;

export const saveReport = createReport;
export const saveReportNote = insertReportNote;
export const saveReportAttachment = insertReportAttachment;

/*================================================================
END FILE: view_4_data.js
================================================================*/
