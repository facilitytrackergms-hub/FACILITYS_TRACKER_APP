/* =================================================
FILE: views/view_3_contacts/view_3_data.js
UPDATED: 2026-06-02 10:10:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export async function fetchContacts(facilityId) {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('facility_id', facilityId);

    if (error) {
        console.error("Database Error:", error);
        return [];
    }

    // Remap 'contact_name' from the database back to 'name' for the frontend grid
    return (data || []).map(c => ({
        id: c.id,
        facility_id: c.facility_id,
        name: c.contact_name || 'N/A', // Maps database contact_name to frontend name
        role: c.role || 'Staff',
        phone: c.phone || '',
        email: c.email || '',
        notes: c.notes || ''
    }));
}

export async function insertContact(contactData) {
    const rawFacilityId = contactData.facility_id || contactData.facility?.id || contactData.id;

    // Map your frontend fields to match your actual Supabase table layout columns
    const cleanData = {
        contact_name: contactData.name, // Maps frontend 'name' to database 'contact_name'
        role: contactData.role,
        email: contactData.email,
        facility_id: rawFacilityId ? parseInt(rawFacilityId, 10) : null
    };

    // Safely add optional columns only if your schema uses them
    if ('phone' in contactData) cleanData.phone = contactData.phone;
    if ('notes' in contactData) cleanData.notes = contactData.notes;

    const { data, error } = await supabase
        .from('contacts')
        .insert([cleanData])
        .select();

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    
    if (data && data[0]) {
        // Return mapped version back to the UI grid
        return {
            id: data[0].id,
            facility_id: data[0].facility_id,
            name: data[0].contact_name,
            role: data[0].role,
            phone: data[0].phone || '',
            email: data[0].email || '',
            notes: data[0].notes || ''
        };
    }
    return null;
}
