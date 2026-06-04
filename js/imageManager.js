/* =================================================
FILE: js/imageManager.js
UPDATED: 2026-06-04 09:55:00 AM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from './supabaseClient.js';

export function renderImageManagerSection(container, type, id, options = {}) {
    container.innerHTML = '';

    const title = options.title || 'Images';
    const section = document.createElement('div');
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.gap = '10px';

    // Title
    const heading = document.createElement('h4');
    heading.textContent = title;
    heading.style.margin = '0 0 10px 0';
    heading.style.color = '#00264d';
    heading.style.fontSize = '14px';
    section.appendChild(heading);

    // Image list container
    const list = document.createElement('div');
    list.id = `${type}-image-list-${id}`;
    list.style.display = 'flex';
    list.style.flexWrap = 'wrap';
    list.style.gap = '10px';
    list.innerHTML = '<span style="color:#6b7280; font-size:12px; font-style:italic;">Loading photos...</span>';
    section.appendChild(list);

    // Hidden Native Phone Camera Input Field
    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.setAttribute('capture', 'environment'); // Forces smartphones to open the rear camera
    cameraInput.style.display = 'none';
    section.appendChild(cameraInput);

    // Add Image button configured for camera trigger
    const addBtn = document.createElement('button');
    addBtn.textContent = '📸 Take or Upload Photo';
    addBtn.style.padding = '10px';
    addBtn.style.cursor = 'pointer';
    addBtn.style.background = '#28a745';
    addBtn.style.color = '#fff';
    addBtn.style.border = 'none';
    addBtn.style.borderRadius = '6px';
    addBtn.style.fontWeight = 'bold';
    addBtn.style.fontSize = '12px';
    addBtn.style.textTransform = 'uppercase';

    // Fetch and display existing images from the database
    async function loadImages() {
        const { data, error } = await supabase
            .from('facility_images')
            .select('*')
            .eq(type === 'issue' ? 'issue_id' : type === 'followup' ? 'followup_id' : 'facility_id', id);

        list.innerHTML = '';
        if (error) {
            console.error("Error pulling media records:", error);
            list.innerHTML = '<span style="color:#dc2625; font-size:12px;">Error loading images</span>';
            return;
        }

        if (!data || data.length === 0) {
            list.innerHTML = '<span style="color:#9ca3af; font-size:12px; font-style:italic;">No image media attached.</span>';
            return;
        }

        data.forEach(imgRecord => {
            const imgUrl = imgRecord.image_url || imgRecord.url;
            if (!imgUrl) return;

            const imgWrapper = document.createElement('div');
            imgWrapper.style.position = 'relative';
            imgWrapper.style.width = '80px';
            imgWrapper.style.height = '80px';

            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = 'Asset file attachment';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.border = '1px solid #d1d5db';
            img.style.borderRadius = '6px';

            // Delete asset button configuration overlay
            const delBtn = document.createElement('button');
            delBtn.innerHTML = '×';
            delBtn.style.position = 'absolute';
            delBtn.style.top = '-4px';
            delBtn.style.right = '-4px';
            delBtn.style.background = '#dc2625';
            delBtn.style.color = 'white';
            delBtn.style.border = 'none';
            delBtn.style.borderRadius = '50%';
            delBtn.style.width = '18px';
            delBtn.style.height = '18px';
            delBtn.style.cursor = 'pointer';
            delBtn.style.fontSize = '12px';
            delBtn.style.lineHeight = '1';
            delBtn.style.fontWeight = 'bold';

            delBtn.onclick = async () => {
                if (confirm("Permanently drop this attached image context row?")) {
                    const { error: delErr } = await supabase
                        .from('facility_images')
                        .delete()
                        .eq('id', imgRecord.id);
                    
                    if (delErr) {
                        alert("Could not remove row attachment context.");
                    } else {
                        loadImages();
                    }
                }
            };

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(delBtn);
            list.appendChild(imgWrapper);
        });
    }

    // Trigger the native smartphone camera picker
    addBtn.onclick = () => {
        cameraInput.click();
    };

    // Listen for the photo capture completion event
    cameraInput.onchange = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const targetFile = files[0];
        addBtn.textContent = '⏳ Processing Photo...';
        addBtn.disabled = true;

        // Convert file object to data string automatically
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrlString = e.target.result;

            const payload = {
                image_url: dataUrlString,
                created_at: new Date().toISOString()
            };

            if (type === 'issue') payload.issue_id = id;
            else if (type === 'followup') payload.followup_id = id;
            else payload.facility_id = id;

            const { error } = await supabase
                .from('facility_images')
                .insert([payload]);

            // Reset button display metrics
            addBtn.textContent = '📸 Take or Upload Photo';
            addBtn.disabled = false;
            cameraInput.value = ''; // Reset file input buffer

            if (error) {
                console.error("Error appending image metadata payload row:", error);
                alert("Could not update image database registry: " + error.message);
            } else {
                loadImages();
            }
        };

        reader.onerror = () => {
            alert("Failed to parse phone camera file data stream.");
            addBtn.textContent = '📸 Take or Upload Photo';
            addBtn.disabled = false;
        };

        reader.readAsDataURL(targetFile);
    };

    section.appendChild(addBtn);
    container.appendChild(section);

    // Initial contextual load
    loadImages();
}
