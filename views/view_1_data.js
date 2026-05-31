import { supabase } from './supabaseClient (2).js';

export const DataService = {
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
