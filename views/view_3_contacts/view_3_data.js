/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_data.js
SUPABASE TBL : contacts
VIEW NAME    : Add New Facility
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-07 @ 05:28 AM
================================================================*/

import { supabase } from '/FACILITYS_TRACKER_APP/database/supabase_client.js';

export async function fetchContacts(facilityId) {
    try {
        if (!facilityId) return [];
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('facility_id', facilityId)
            .order('contact_name', { ascending: true });

        if (error) {
            console.error("Error retrieving directory dataset context:", error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error("Unexpected exception inside fetchContacts matrix handler:", err);
        return [];
    }
}

export async function insertContact(contactPayload) {
    try {
        if (!contactPayload) return null;
        const normalizedPayload = { ...contactPayload };
        if ('name' in normalizedPayload && !normalizedPayload.contact_name) {
            normalizedPayload.contact_name = normalizedPayload.name;
            delete normalizedPayload.name;
        }

        const { data, error } = await supabase
            .from('contacts')
            .insert([normalizedPayload])
            .select();

        if (error) {
            console.error("Error executing directory insert workflow operation:", error.message);
            return null;
        }
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Unexpected system exception inside insertContact service context:", err);
        return null;
    }
}

export async function updateContact(contactId, contactPayload) {
    try {
        if (!contactId || !contactPayload) return null;
        const normalizedPayload = { ...contactPayload };
        if ('name' in normalizedPayload) {
            normalizedPayload.contact_name = normalizedPayload.name;
            delete normalizedPayload.name;
        }

        const { data, error } = await supabase
            .from('contacts')
            .update(normalizedPayload)
            .eq('id', contactId)
            .select();

        if (error) {
            console.error("Error patching directory contact payload row:", error.message);
            return null;
        }
        return data && data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Unexpected system exception inside updateContact context:", err);
        return null;
    }
}

export async function deleteContact(contactId) {
    try {
        if (!contactId) return false;
        const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', contactId);

        if (error) {
            console.error("Error performing delete contact operation reference:", error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Unexpected system exception inside deleteContact context:", err);
        return false;
    }
}
