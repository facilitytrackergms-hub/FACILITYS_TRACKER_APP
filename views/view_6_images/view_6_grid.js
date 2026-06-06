/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_6_grid.js
SUPABASE TBL : facility_images
VIEW NAME    : FACILITY GALLERY
POP-UP TITLE : Facility Assets Manager
LAST UPDATED : 2026-06-06 @ 08:51 AM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
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

            <div id="alert-view-6-grid" style="display:none; max-width:700px; margin: 10px auto; padding: 12px; border-radius: 8px; font-weight: bold; font-size: 14px;"></div>

            <input type="file" id="hiddenFolderPicker" accept="image/*" style="display: none;" />

            <div id="galleryImageManager" style="background:white; border-radius:18px; padding:15px; box-shadow:0 4px 14px rgba(0,0,0,0.08); max-width:700px; margin:0 auto;"></div>

            <button id="backBtn" style="margin-top:25px; width:100%; max-width:320px; padding:14px; background:#6b7280; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">
                BACK TO CONTROLS
            </button>

            <div style="margin-top:40px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px;">
                File: views/view_6_images/view_6_grid.js | Updated: 2026-06-06 08:51:00 AM
            </div>
        </div>
    `;

    // Helper function to show distinct non-generic notification banners
    const showComponentAlert = (message, isError = false) => {
        const alertBox = document.getElementById('alert-view-6-grid');
        if (alertBox) {
            alertBox.textContent = message;
            alertBox.style.color = isError ? '#721c24' : '#155724';
            alertBox.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
            alertBox.style.border = `1px solid ${isError ? '#f5c6cb' : '#c3e6cb'}`;
            alertBox.style.display = 'block';
            setTimeout(() => { alertBox.style.display = 'none'; }, 5000);
        }
    };

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
                    showComponentAlert("Image successfully uploaded and attached to facility assets!");
                    setupGalleryEvents(facility);
                } catch (err) {
                    console.error("Camera Upload Error:", err);
                    showComponentAlert("Could not complete direct file storage attachment: " + err.message, true);
                }
            });
        }
    }, 150);
}
