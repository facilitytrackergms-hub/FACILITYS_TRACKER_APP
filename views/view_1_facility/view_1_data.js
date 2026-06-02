/* =================================================
FILE: view_1_data.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchFacilities() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching facilities:", error);
        return [];
    }
    return data;
}

export async function insertFacility(facilityObj) {
    const { data, error } = await supabase
        .from('facilities')
        .insert([{
            name: facilityObj.name,
            address: facilityObj.address,
            phone: facilityObj.phone
        }])
        .select();

    if (error) {
        console.error("Error inserting facility:", error);
        return null;
    }
    return data[0];
}

export async function updateFacility(id, facilityObj) {
    const { data, error } = await supabase
        .from('facilities')
        .update({
            name: facilityObj.name,
            address: facilityObj.address,
            phone: facilityObj.phone
        })
        .eq('id', id)
        .select();

    if (error) {
        console.error("Error updating facility:", error);
        return null;
    }
    return data[0];
}
