/* =================================================
FILE: views/view_6_images/view_6_grid.js
UPDATED: 2026-06-03 04:15:00 AM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
const __FILENAME = 'view_6_grid.js';

import { setupGalleryEvents } from './view_6_modal.js';
import { supabase } from '../../js/supabaseClient.js';

export async function renderFacilityImages(data) {
    const app = document.getElementById('app');
    if (!app) return;

    // Unpack unified payload container or fallback safely
    const facility = data?.facility ? data.facility : data;

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center;">
            <h1 style="color:#00264d; margin-top:0; margin-bottom:8px; font-size:28px; font-weight:900;">
                FACILITY GALLERY
            </h1>

            <div style="font-size:18px; font-weight:bold; color:#64748b; margin-bottom:20px;">
                ${facility?.name || facility?.Name || ''}
            </div>

            <input type="file" id="hiddenFolderPicker" accept="image/*" style="display: none;" />

            <div id="galleryImageManager" style="background:white; border-radius:18px; padding:15px; box-shadow:0 4px 14px rgba(0,0,0,0.08); max-width:700px; margin:0 auto;"></div>

            <button id="backBtn" style="margin-top:25px; width:100%; max-width:320px; padding:14px; background:#6b7280; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">
                BACK TO CONTROLS
            </button>

            <div style="margin-top:40px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px;">
                File: views/view_6_images/view_6_grid.js | Updated: 2026-06-03 04:15:00 AM
            </div>
        </div>
    `;

    // Initialize default modal events
    setupGalleryEvents(facility);

    // Dynamic Intercept Hook: Wait for UI thread to build, then re-route click actions to your file folder
    setTimeout(() => {
        const addPhotoBtn = document.querySelector('#galleryImageManager button') || document.getElementById('addAssetPhotoBtn');
        const nativePicker = document.getElementById('hiddenFolderPicker');

        if (addPhotoBtn && nativePicker) {
            // Replace the old window.prompt click rule entirely 
            const newButton = addPhotoBtn.cloneNode(true);
            addPhotoBtn.parentNode.replaceChild(newButton, addPhotoBtn);

            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nativePicker.click(); // Triggers your local file system explorer
            });

            // Handle what happens when you pick a photo file from your directory
            nativePicker.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return;

                console.log("Selected local media item file:", file.name);
                
                // Create a completely unique filename to avoid collision overwrites
                const fileExt = file.name.split('.').pop();
                const fileName = `${crypto.randomUUID()}.${fileExt}`;
                const filePath = `gallery/${fileName}`;

                try {
                    // 1. Upload the binary file directly to your unified bucket 'facility-assets'
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('facility-assets')
                        .upload(filePath, file);

                    if (uploadError) {
                        throw uploadError;
                    }

                    // 2. Get the clean public link asset reference URL
                    const { data: urlData } = supabase.storage
                        .from('facility-assets')
                        .getPublicUrl(filePath);

                    const publicUrl = urlData.publicUrl;

                    // 3. Register the newly created URL string row inside your database registry table
                    const { error: dbError } = await supabase
                        .from('facility_images')
                        .insert([{
                            facility_id: facility.id,
                            image_url: publicUrl,
                            created_at: new Date().toISOString()
                        }]);

                    if (dbError) {
                        throw dbError;
                    }

                    // Success tracking cleanup! Re-render or trigger event re-load manually
                    alert("Image successfully uploaded and attached to facility assets!");
                    setupGalleryEvents(facility);
                } catch (err) {
                    console.error("Camera Upload Error:", err);
                    alert("Could not complete direct file storage attachment: " + err.message);
                }
            });
        }
    }, 150);
}
