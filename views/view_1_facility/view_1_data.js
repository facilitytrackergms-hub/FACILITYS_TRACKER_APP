// views/view_1_facility/view_1_data.js
import { supabase } from '../../js/supabaseClient.js';

export const DataService = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('facilities')
            .select('id, name, address, phone, notes, status');
        if (error) throw error;
        return data;
    },

    async save(name) {
        const { error } = await supabase
            .from('facilities')
            .insert([{ name, status: 'Active' }]);
        if (error) throw error;
    }
};
