/* =================================================
FILE: view_6_data.js
UPDATED: 2026-06-01
================================================= */

import { supabase } from '../../js/supabaseClient.js';

// Fetch all images for a given facility
export async function fetchFacilityImages(facilityId) {
    const { data, error } = await supabase
        .from('facility_images')
        .select('*')
        .eq('related_id', facilityId)
        .eq('related_table', 'facility')
        .order('id', { ascending: true });
    if (error) console.error(error);
    return data || [];
}

// Insert new image
export async function insertFacilityImage({ url, facilityId }) {
    const { data, error } = await supabase
        .from('facility_images')
        .insert([{ image_url: url, related_table: 'facility', related_id: facilityId }])
        .select();
    if (error) console.error(error);
    return data?.[0] || null;
}
