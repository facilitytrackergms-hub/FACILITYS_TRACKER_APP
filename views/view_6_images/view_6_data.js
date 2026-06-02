/* =================================================
FILE: view_6_data.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchImages(relatedType, relatedId) {
    const { data, error } = await supabase
        .from('facility_images')
        .select('*')
        .eq('related_type', relatedType)
        .eq('related_id', relatedId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching images:", error);
        return [];
    }
    return data;
}

export async function insertImage(imageObj) {
    const { data, error } = await supabase
        .from('facility_images')
        .insert([{
            related_type: imageObj.related_type,
            related_id: imageObj.related_id,
            image_url: imageObj.image_url,
            caption: imageObj.caption || ''
        }])
        .select();

    if (error) {
        console.error("Error inserting image:", error);
        return null;
    }
    return data[0];
}

export async function deleteImage(id) {
    const { data, error } = await supabase
        .from('facility_images')
        .delete()
        .eq('id', id);

    if (error) console.error("Error deleting image:", error);
    return data;
}
