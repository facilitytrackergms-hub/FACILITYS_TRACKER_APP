/* =================================================
FILE: js/imagemanager.js
UPDATED: 2026-05-30 11:30:00 PM
================================================= */

export function renderImageManagerSection(container, type, id, options = {}) {
    // Clear existing content
    container.innerHTML = '';
/* =================================================
FILE: js/imagemanager.js
UPDATED: 2026-05-30 11:45:00 PM
================================================= */

import { supabase } from './supabaseClient.js';

export async function renderImageManagerSection(container, type, id, options = {}) {
    container.innerHTML = '';

    const title = options.title || 'Images';
    const section = document.createElement('div');
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.gap = '10px';

    const heading = document.createElement('h4');
    heading.textContent = title;
    heading.style.marginBottom = '10px';
    section.appendChild(heading);

    // Image list container
    const list = document.createElement('div');
    list.id = `${type}-image-list-${id}`;
    list.style.display = 'flex';
    list.style.flexWrap = 'wrap';
    list.style.gap = '10px';
    section.appendChild(list);

    // Load existing images from Supabase storage
    const { data: files, error } = await supabase.storage
        .from(`${type}-images`)
        .list(`${id}/`);

    if (error) console.error("Supabase Storage Error:", error);
    else if (files) {
        files.forEach(file => {
            const img = document.createElement('img');
            img.src = `https://YOUR_SUPABASE_PROJECT_URL/storage/v1/object/public/${type}-images/${id}/${file.name}`;
            img.alt = 'Facility Image';
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.objectFit = 'cover';
            img.style.border = '1px solid #ccc';
            img.style.borderRadius = '5px';
            img.style.cursor = 'pointer';
            img.onclick = async () => {
                if (confirm('Remove this image?')) {
                    const { error } = await supabase.storage
                        .from(`${type}-images`)
                        .remove([`${id}/${file.name}`]);
                    if (error) console.error("Delete Error:", error);
                    else img.remove();
                }
            };
            list.appendChild(img);
        });
    }

    // Add Image button
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Image';
    addBtn.style.padding = '8px 12px';
    addBtn.style.cursor = 'pointer';
    addBtn.style.background = '#28a745';
    addBtn.style.color = '#fff';
    addBtn.style.border = 'none';
    addBtn.style.borderRadius = '5px';

    addBtn.onclick = async () => {
        const url = prompt('Enter Image URL:');
        if (!url) return;

        // Fetch image as blob
        const res = await fetch(url);
        const blob = await res.blob();
        const fileName = url.split('/').pop();

        const { error } = await supabase.storage
            .from(`${type}-images`)
            .upload(`${id}/${fileName}`, blob, { cacheControl: '3600', upsert: true });

        if (error) {
            console.error("Upload Error:", error);
            alert('Failed to upload image');
            return;
        }

        const img = document.createElement('img');
        img.src = `https://YOUR_SUPABASE_PROJECT_URL/storage/v1/object/public/${type}-images/${id}/${fileName}`;
        img.alt = 'Facility Image';
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        img.style.border = '1px solid #ccc';
        img.style.borderRadius = '5px';
        img.style.cursor = 'pointer';
        img.onclick = async () => {
            if (confirm('Remove this image?')) {
                const { error } = await supabase.storage
                    .from(`${type}-images`)
                    .remove([`${id}/${fileName}`]);
                if (error) console.error("Delete Error:", error);
                else img.remove();
            }
        };
        list.appendChild(img);
    };

    section.appendChild(addBtn);
    container.appendChild(section);
}
    const title = options.title || 'Images';
    const section = document.createElement('div');
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.gap = '10px';

    // Title
    const heading = document.createElement('h4');
    heading.textContent = title;
    heading.style.marginBottom = '10px';
    section.appendChild(heading);

    // Image list container
    const list = document.createElement('div');
    list.id = `${type}-image-list-${id}`;
    list.style.display = 'flex';
    list.style.flexWrap = 'wrap';
    list.style.gap = '10px';
    section.appendChild(list);

    // Add Image button
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Image';
    addBtn.style.padding = '8px 12px';
    addBtn.style.cursor = 'pointer';
    addBtn.style.background = '#28a745';
    addBtn.style.color = '#fff';
    addBtn.style.border = 'none';
    addBtn.style.borderRadius = '5px';

    addBtn.onclick = () => {
        const url = prompt('Enter Image URL:');
        if (!url) return;

        // Create image thumbnail
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Facility Image';
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        img.style.border = '1px solid #ccc';
        img.style.borderRadius = '5px';
        img.style.cursor = 'pointer';

        // Remove image on click
        img.onclick = () => {
            if (confirm('Remove this image?')) {
                img.remove();
            }
        };

        list.appendChild(img);
    };

    section.appendChild(addBtn);
    container.appendChild(section);
}
