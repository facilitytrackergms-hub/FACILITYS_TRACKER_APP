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
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[view_4_data.js] Could not fetch facility_projects.', error);
        return [];
    }

    console.log('[view_4_data.js] fetchFacilityProjects returned', data?.length || 0, 'records');
    return data || [];
}

// All other functions remain unchanged (insertFacilityProject, fetchProjectActions, etc.)

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
