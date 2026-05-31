/* =================================================
FILE: controls_v6_data.js
UPDATED: 2026-05-30 06:10 AM
================================================= */
import { supabase } from '../js/supabaseClient.js';

export async function getFacilityImages(facilityId) {
    // Supabase logic could include filtering / fetching images if needed
    return supabase.from('facility_images')
        .select('*')
        .eq('related_table', 'facility')
        .eq('related_id', facilityId);
}
