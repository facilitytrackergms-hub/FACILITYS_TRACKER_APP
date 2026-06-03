/* =================================================
FILE: views/view_3_contacts/view_3_data.js
UPDATED: 2026-06-02 10:30:00 PM

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

    return (data || []).map(c => ({
        id: c.id,
        facility_id: c.facility_id,
        name: c.contact_name || 'N/A', 
        role: c.role || 'Staff',
        email: c.email || '',
        phone: c.phone || 'N/A', 
        notes: c.notes || 'No notes added.',
        image_url: c.image_url || '' 
    }));
}

export async function insertContact(contactData) {
    const rawFacilityId = contactData.facility_id || contactData.facility?.id || contactData.id;

    const cleanData = {
        contact_name: contactData.name, 
        role: contactData.role,
        email: contactData.email,
        facility_id: rawFacilityId ? parseInt(rawFacilityId, 10) : null,
        phone: contactData.phone || '',
        notes: contactData.notes || '',
        image_url: contactData.image_url || ''
    };

    const { data, error } = await supabase
        .from('contacts')
        .insert([cleanData])
        .select();

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}

export async function updateContact(contactId, contactData) {
    const cleanData = {
        contact_name: contactData.name,
        role: contactData.role,
        email: contactData.email,
        phone: contactData.phone,
        notes: contactData.notes,
        image_url: contactData.image_url
    };

    const { data, error } = await supabase
        .from('contacts')
        .update(cleanData)
        .eq('id', contactId)
        .select();

    if (error) {
        console.error("Database Error:", error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}

export async function deleteContact(contactId) {
    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

    if (error) {
        console.error("Database Error:", error);
        return false;
    }
    return true;
}
