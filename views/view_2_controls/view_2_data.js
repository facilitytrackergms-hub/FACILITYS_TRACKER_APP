/* =================================================
FILE: views/view_2_controls/view_2_data.js
UPDATED: 2026-06-04 06:05:00 PM

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
 * Updates a facility's textual information details inside the primary database table
 */
export async function updateFacilityDetails(facilityId, name, address, phone) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return false;

    const { error } = await supabase
        .from('facilities')
        .update({ name, address, phone })
        .eq('id', safeId);

    if (error) {
        console.error("Error writing updated facility attributes:", error);
        return false;
    }
    return true;
}

/**
 * Completely removes a facility record row from the database cluster
 */
export async function deleteFacilityRecord(facilityId) {
    const safeId = parseInt(facilityId, 10);
    if (isNaN(safeId)) return false;

    const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', safeId);

    if (error) {
        console.error("Error cascading delete on facility table row target:", error);
        return false;
    }
    return true;
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

        const { data: urlData } = supabase.storage
            .from('facility-assets')
            .getPublicUrl(filePath);

        const publicUrl = urlData?.publicUrl;
        if (!publicUrl) throw new Error("Could not retrieve public link target path.");

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
