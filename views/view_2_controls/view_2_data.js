/* =================================================
FILE: views/view_2_controls/view_2_data.js
UPDATED: 2026-06-04 05:40:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

/**
 * Fetches data for a single specific facility to load real-time profile image changes
 */
export async function fetchSingleFacility(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return null;

    const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('id', safeId)
        .single();

    if (error) {
        console.error("Error loading fresh facility record rows:", error);
        return null;
    }
    return data;
}

/**
 * Fetches standard issues for a specific facility to generate the profile dashboard badge counters
 */
export async function fetchFacilityIssues(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return [];

    const { data, error } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', safeId);

    if (error) {
        console.error("Error fetching issues for badge:", error);
        return [];
    }
    return data || [];
}

/**
 * Uploads a local file to Supabase storage bucket and binds the URL to the facility
 */
export async function uploadFacilityImage(facilityId, file) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId) || !file) return null;

    try {
        const fileExtension = file.name.split('.').pop();
        const fileName = `facility_${safeId}_${Date.now()}.${fileExtension}`;
        const filePath = `profiles/${fileName}`;

        // 1. Upload the raw image bytes to your public 'facility-assets' bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('facility-assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error("Supabase Storage Upload Error:", uploadError);
            return null;
        }

        // 2. Retrieve the public CDN link for the uploaded file
        const { data: urlData } = supabase.storage
            .from('facility-assets')
            .getPublicUrl(filePath);

        const publicUrl = urlData?.publicUrl;
        if (!publicUrl) throw new Error("Could not retrieve public link target path.");

        // 3. Persist the image link directly back to your primary facilities table row
        const { data: updatedFacility, error: updateError } = await supabase
            .from('facilities')
            .update({ image_url: publicUrl })
            .eq('id', safeId)
            .select();

        if (updateError) {
            console.error("Database Error linking photo URL to facility:", updateError);
            return null;
        }

        return updatedFacility && updatedFacility[0] ? updatedFacility[0] : null;

    } catch (err) {
        console.error("Catch error during image process execution:", err);
        return null;
    }
}
