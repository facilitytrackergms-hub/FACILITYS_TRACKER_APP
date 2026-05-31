import { supabase } from './supabaseClient.js';

export const DataService = {
    // 1. FETCH: Gets all data to show in your Grid and Modal
    async fetchFacilities() {
        const { data, error } = await supabase
            .from('facilities')
            .select(`
                id, 
                name, 
                address, 
                phone, 
                notes, 
                status
            `);
        
        if (error) {
            console.error("Fetch Error:", error);
            throw error;
        }
        return data;
    },

    // 2. SAVE: Takes the name from your input box and saves it
    async saveFacility(newName) {
        if (!newName || !newName.trim()) {
            alert("Please enter a facility name.");
            return;
        }

        const { data, error } = await supabase
            .from('facilities')
            .insert([{ 
                name: newName, 
                status: 'Active' // Matches the 'status' column in your CSV
            }])
            .select();

        if (error) {
            console.error("Save Error:", error);
            throw error;
        }
        return data;
    }
};
