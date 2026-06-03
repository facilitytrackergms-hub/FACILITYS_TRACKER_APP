/* =================================================
FILE: views/view_3_contacts/view_3_data.js
UPDATED: 2026-06-02 10:20:00 PM

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

    // Safely map your existing database columns to the UI grid
    return (data || []).map(c => ({
        id: c.id,
        facility_id: c.facility_id,
        name: c.contact_name || 'N/A', 
        role: c.role || 'Staff',
        email: c.email || '',
        phone: '', // Placeholder since column doesn't exist in DB
        notes: ''  // Placeholder since column doesn't exist in DB
    }));
}

export async function insertContact(contactData) {
    const rawFacilityId = contactData.facility_id || contactData.facility?.id || contactData.id;

    // ONLY include the columns that physically exist in your Supabase table schema
    const cleanData = {
        contact_name: contactData.name, 
        role: contactData.role,
        email: contactData.email,
        facility_id: rawFacilityId ? parseInt(rawFacilityId, 10) : null
    };

    const { data, error } = await supabase
        .from('contacts')
        .insert([cleanData])
        .select();

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    
    if (data && data[0]) {
        return {
            id: data[0].id,
            facility_id: data[0].facility_id,
            name: data[0].contact_name,
            role: data[0].role,
            email: data[0].email || '',
            phone: '',
            notes: ''
        };
    }
    return null;
}
