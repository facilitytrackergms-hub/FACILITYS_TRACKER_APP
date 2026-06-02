/* =================================================
FILE: views/view_3_controls/view_3_modal.js
UPDATED: 2026-06-02 05:45:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { insertContact } from './view_3_data.js';

export function setupContactsEvents(facility, renderFacilityContactsFn) {
    const modal = document.getElementById('manualContactModal');

    document.getElementById('manualContactTriggerBtn').onclick = () => {
        document.getElementById('manualContactName').value = '';
        document.getElementById('manualContactRole').value = '';
        document.getElementById('manualContactPhone').value = '';
        document.getElementById('manualContactEmail').value = '';
        document.getElementById('manualContactNotes').value = '';
        modal.style.display = 'flex';
    };

    document.getElementById('manualContactCloseBtn').onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('manualContactSaveBtn').onclick = async () => {
        const name = document.getElementById('manualContactName').value.trim();
        if (!name) {
            alert('Name is required');
            return;
        }
        
        const contactData = { 
            name: name, 
            role: document.getElementById('manualContactRole').value.trim(), 
            phone: document.getElementById('manualContactPhone').value.trim(), 
            email: document.getElementById('manualContactEmail').value.trim(), 
            notes: document.getElementById('manualContactNotes').value.trim(), 
            facility_id: facility.id 
        };

        const result = await insertContact(contactData);
        if (result) {
            modal.style.display = 'none';
            await renderFacilityContactsFn(facility);
        } else {
            alert("Could not append directory metadata entry row.");
        }
    };

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', facility);
        }
    };
}
