import { supabase } from './supabaseClient.js';

export const DataService import { supabase } from './supabaseClient.js';

export const DataService = {
    async fetchFacilities() {
        // We pull the specific columns from your 'facilities' table
        const { data, error } = await supabase
            .from('facilities')
            .select('id, name, address, phone, notes, status');
        
        if (error) throw error;
        return data;
    },

    async saveFacility(newName) {
        // This takes the text from your input box and puts it in the 'name' column
        const { data, error } = await supabase
            .from('facilities')
            .insert([{ 
                name: newName,
                status: 'Active' // Setting a default status
            }])
            .select();

        if (error) throw error;
        return data;
    }
};= {
    async fetchFacilities() {
        const { data, error } = await supabase
            .from('facilities')
            .select(`*, facility_issues(*), facility_projects(*)`);
        if (error) throw error;
        return data;
    },

    async saveFacility(name) {
        if (!name.trim()) throw new Error("Name is required");
        const { data, error } = await supabase
            .from('facilities')
            .insert([{ name: name }])
            .select();
        if (error) throw error;
        return data;
    }
};
