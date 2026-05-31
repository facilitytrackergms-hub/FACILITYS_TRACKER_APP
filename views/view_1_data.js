import { supabase } from './supabaseClient (2).js';

export const DataService = {
    async fetchAllFacilities() {
        const { data, error } = await supabase
            .from('facilities')
            .select('*, facility_issues(*), facility_projects(*)');
        if (error) throw error;
        return data;
    },

    async saveNewFacility(name) {
        if (!name) return alert("Please enter a name");
        const { data, error } = await supabase
            .from('facilities')
            .insert([{ name: name }])
            .select();
        if (error) throw error;
        return data;
    }
};
