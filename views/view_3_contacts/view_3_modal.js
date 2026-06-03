/* =================================================
FILE: views/view_3_contacts/view_3_modal.js
UPDATED: 2026-06-02 11:30:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { insertContact, updateContact } from './view_3_data.js';
import { supabase } from '../../js/supabaseClient.js';

export function setupContactsEvents(facility, refreshCallback) {
    const modal = document.getElementById('manualContactModal');
    const triggerBtn = document.getElementById('manualContactTriggerBtn');
    const closeBtn = document.getElementById('manualContactCloseBtn');
    const saveBtn = document.getElementById('manualContactSaveBtn');
    const backBtn = document.getElementById('backBtn');

    // Camera Upload Elements
    const fileInput = document.getElementById('manualContactFile');
    const triggerCameraBtn = document.getElementById('triggerCameraBtn');
    const statusText = document.getElementById('uploadStatusText');
    const hiddenImageInput = document.getElementById('manualContactImage');

    if (triggerCameraBtn && fileInput) {
        triggerCameraBtn.onclick = (e) => {
            e.preventDefault();
            fileInput.click(); // Instantly pops open the live mobile camera viewfinder
        };

        fileInput.onchange = async () => {
            const file = fileInput.files[0];
            if (!file) return;

            if (statusText) statusText.innerText = "⏳ Saving Snap...";
            triggerCameraBtn.disabled = true;

            try {
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `contacts/${Date.now()}.${fileExt}`;
                
                // Stream your photo payload directly to your existing 'facility-images' bucket
                const { data, error } = await supabase.storage
                    .from('facility-images')
                    .upload(fileName, file);

                if (error) throw error;

                const { data: urlData } = supabase.storage
                    .from('facility-images')
                    .getPublicUrl(fileName);

                if (hiddenImageInput) hiddenImageInput.value = urlData.publicUrl;
                if (statusText) statusText.innerText = "✅ Picture Attached!";
            } catch (err) {
                console.error("Camera Upload Error:", err);
                if (statusText) statusText.innerText = "❌ Capture Failed";
                alert("Could not process and save camera image.");
            } finally {
                triggerCameraBtn.disabled = false;
            }
        };
    }

    if (triggerBtn) {
        triggerBtn.onclick = () => {
            document.getElementById('editingContactId').value = '';
            document.getElementById('modalTemplateTitle').innerText = 'Create Directory Entry';
            clearFormFields();
            modal.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; };
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', { facility: facility });
            }
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const payload = {
                name: document.getElementById('manualContactName').value.trim(),
                role: document.getElementById('manualContactRole').value.trim(),
                phone: document.getElementById('manualContactPhone').value.trim(),
                email: document.getElementById('manualContactEmail').value.trim(),
                notes: document.getElementById('manualContactNotes').value.trim(),
                image_url: document.getElementById('manualContactImage').value.trim(),
                facility_id: facility.id
            };

            if (!payload.name) {
                alert("Please provide a name entry.");
                return;
            }

            const editingId = document.getElementById('editingContactId').value;
            let result = null;

            if (editingId) {
                result = await updateContact(editingId, payload);
            } else {
                result = await insertContact(payload);
            }

            if (result) {
                modal.style.display = 'none';
                clearFormFields();
                refreshCallback(facility);
            } else {
                alert("Could not update directory metadata entry row.");
            }
        };
    }
}

export function openEditContactModal(contact) {
    document.getElementById('editingContactId').value = contact.id;
    document.getElementById('modalTemplateTitle').innerText = 'Modify Directory Entry';
    
    document.getElementById('manualContactName').value = contact.name || '';
    document.getElementById('manualContactRole').value = contact.role || '';
    document.getElementById('manualContactPhone').value = contact.phone === 'N/A' ? '' : contact.phone;
    document.getElementById('manualContactEmail').value = contact.email || '';
    document.getElementById('manualContactNotes').value = contact.notes === 'No notes added.' ? '' : contact.notes;
    document.getElementById('manualContactImage').value = contact.image_url || '';
    
    const statusText = document.getElementById('uploadStatusText');
    if (statusText) {
        statusText.innerText = contact.image_url ? "✅ Has Profile Image" : "No image captured";
    }
    
    document.getElementById('manualContactModal').style.display = 'flex';
}

function clearFormFields() {
    document.getElementById('manualContactName').value = '';
    document.getElementById('manualContactRole').value = '';
    document.getElementById('manualContactPhone').value = '';
    document.getElementById('manualContactEmail').value = '';
    document.getElementById('manualContactNotes').value = '';
    document.getElementById('manualContactImage').value = '';
    
    const statusText = document.getElementById('uploadStatusText');
    if (statusText) statusText.innerText = "No image captured";
    
    const fileInput = document.getElementById('manualContactFile');
    if (fileInput) fileInput.value = '';
}
