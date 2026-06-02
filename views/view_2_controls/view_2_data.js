/* =================================================
FILE: view_2_data.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchControls() {
    const { data, error } = await supabase
        .from('controls')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching controls:", error);
        return [];
    }
    return data;
}

export async function insertControl(controlObj) {
    const { data, error } = await supabase
        .from('controls')
        .insert([{
            control_name_text: controlObj.name,
            description_text: controlObj.description,
            assigned_to_text: controlObj.assigned_to
        }])
        .select();

    if (error) {
        console.error("Error inserting control:", error);
        return null;
    }
    return data[0];
}

export async function updateControl(id, controlObj) {
    const { data, error } = await supabase
        .from('controls')
        .update({
            control_name_text: controlObj.name,
            description_text: controlObj.description,
            assigned_to_text: controlObj.assigned_to
        })
        .eq('id', id)
        .select();

    if (error) {
        console.error("Error updating control:", error);
        return null;
    }
    return data[0];
}
