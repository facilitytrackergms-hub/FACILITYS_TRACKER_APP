/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_data.js
SUPABASE TBL : facility_projects
VIEW NAME    : Project Assessment Report
POP-UP TITLE : Project Assessment Entry
LAST UPDATED : 2026-06-08 @ 09:20 PM
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

export async function fetchFacilityProjects(facilityId) {
    if (!facilityId) {
        console.error('[view_4_data.js] Missing facilityId.');
        return [];
    }

    let result = await supabase
        .from('facility_projects')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });

    if (result.error) {
        console.warn('[view_4_data.js] facility_id fetch failed. Trying facilityid fallback.', result.error);

        result = await supabase
            .from('facility_projects')
            .select('*')
            .eq('facilityid', facilityId)
            .order('created_at', { ascending: false });
    }

    if (result.error) {
        console.error('[view_4_data.js] Error fetching projects:', result.error);
        return [];
    }

    return result.data || [];
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

    let lastError = null;

    for (const attempt of attempts) {
        const cleanPayload = removeEmptyKeys(attempt);

        const { data, error } = await supabase
            .from('facility_projects')
            .insert([cleanPayload])
            .select();

        if (!error) {
            return { data, error: null };
        }

        lastError = error;
        console.warn('[view_4_data.js] Insert attempt failed. Trying next shape.', error);
    }

    return { data: null, error: lastError };
}

export function getLocalReportKey(facilityId) {
    return `view_4_project_report_${facilityId}`;
}

export function loadLocalProjectReport(facilityId) {
    const key = getLocalReportKey(facilityId);
    const raw = localStorage.getItem(key);

    if (!raw) {
        return {
            projectName: '',
            sections: []
        };
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            projectName: parsed.projectName || '',
            sections: Array.isArray(parsed.sections) ? parsed.sections : []
        };
    } catch (error) {
        console.error('[view_4_data.js] Could not parse local project report.', error);
        return {
            projectName: '',
            sections: []
        };
    }
}

export function saveLocalProjectReport(facilityId, reportData) {
    const key = getLocalReportKey(facilityId);
    localStorage.setItem(key, JSON.stringify({
        projectName: reportData.projectName || '',
        sections: Array.isArray(reportData.sections) ? reportData.sections : []
    }));
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
UPDATED: 2026-06-08 @ 09:20 PM
================================================================*/
