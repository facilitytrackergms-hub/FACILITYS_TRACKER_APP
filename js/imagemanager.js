/* =================================================
FILE: imagemanager.js
UPDATED: 2026-06-01
================================================= */
import { supabase } from './supabaseClient.js';

export async function renderImageManagerSection(container, relatedType, relatedId, options={}) {
    container.innerHTML = '<p>Loading images...</p>';

    const { data, error } = await supabase
        .from('facility_images')
        .select('*')
        .eq('related_type', relatedType)
        .eq('related_id', relatedId)
        .order('created_at', { ascending: true });

    if (error) {
        container.innerHTML = `<p style="color:red">Error loading images.</p>`;
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<p>No images found.</p>';
        return;
    }

    container.innerHTML = '';
    data.forEach(img => {
        const imgEl = document.createElement('img');
        imgEl.src = img.image_url;
        imgEl.alt = img.caption || '';
        imgEl.style.cssText = 'max-width:100%; margin:6px; border-radius:8px;';
        container.appendChild(imgEl);
    });
}
