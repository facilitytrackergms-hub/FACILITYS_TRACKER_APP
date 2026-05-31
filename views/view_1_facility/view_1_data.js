fasilities

/* =================================================
FILE: views/view_1_data.js
UPDATED: 2026-05-30 10:25:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilitiesData() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*');
    if (error) console.error("Error fetching facilities:", error);
    return data || [];
}

export async function insertFacilityData(facilityObj) {
    const { data, error } = await supabase
        .from('facilities')
        .insert([{ 
            name: facilityObj.name, 
            address: facilityObj.address, 
            phone: facilityObj.phone 
        }])
        .select();

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    return data ? data[0] : null;
}
