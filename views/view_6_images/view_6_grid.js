/* =================================================
FILE: view_6_grid.js
UPDATED: 2026-06-01
================================================= */

import { fetchFacilityImages, insertFacilityImage } from './view_6_data.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export async function renderFacilityImages({ facility }) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; text-align:center;">
            <h1>${facility.name} Image Gallery</h1>
            <div id="imageGrid" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:20px;"></div>
            <button id="addImageBtn" style="padding:12px 20px; margin-top:20px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;">
                Add Image
            </button>
            <button id="backBtn" style="padding:12px 20px; margin-top:20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                Back to Controls
            </button>
        </div>
    `;

    const grid = document.getElementById('imageGrid');
    const images = await fetchFacilityImages(facility.id);

    images.forEach(img => {
        const imgEl = document.createElement('img');
        imgEl.src = img.image_url;
        imgEl.alt = 'Facility Image';
        imgEl.style.width = '120px';
        imgEl.style.height = '120px';
        imgEl.style.objectFit = 'cover';
        imgEl.style.borderRadius = '8px';
        imgEl.style.border = '1px solid #ccc';
        imgEl.style.cursor = 'pointer';
        imgEl.onclick = () => {
            if (confirm('Remove this image?')) {
                imgEl.remove();
            }
        };
        grid.appendChild(imgEl);
    });

    document.getElementById('addImageBtn').onclick = async () => {
        const url = prompt('Enter Image URL:');
        if (!url) return;
        const newImage = await insertFacilityImage({ url, facilityId: facility.id });
        if (!newImage) return alert('Failed to add image.');
        renderFacilityImages({ facility }); // refresh
    };

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view2_controls', { facility });
    };
}
