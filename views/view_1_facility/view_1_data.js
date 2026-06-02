import { supabase } from '../js/supabaseClient.js';

// Fetch all facilities
export async function fetchFacilities() {
    const { data, error } = await supabase
        .from('facilities')
        .select('*');
    if (error) { console.error(error); return []; }
    return data || [];
}

// Insert a new facility
export async function insertFacility(facilityObj) {
    const { data, error } = await supabase
        .from('facilities')
        .insert([{
            name: facilityObj.name,
            address: facilityObj.address,
            phone: facilityObj.phone
        }])
        .select();
    if (error) { console.error(error); return null; }
    return data && data[0] ? data[0] : null;
}

// Update a facility
export async function updateFacility(facilityObj) {
    const { data, error } = await supabase
        .from('facilities')
        .update({
            name: facilityObj.name,
            address: facilityObj.address,
            phone: facilityObj.phone,
            updated_at: new Date()
        })
        .eq('id', facilityObj.id)
        .select();
    if (error) { console.error(error); return null; }
    return data && data[0] ? data[0] : null;
}
