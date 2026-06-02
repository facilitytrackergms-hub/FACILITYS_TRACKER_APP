/* =================================================
FILE: view_6_modal.js
UPDATED: 2026-06-01
================================================= */
import { insertImage, deleteImage } from './view_6_data.js';

export function openImageModal(image, relatedType, relatedId) {
    if (!relatedType || !relatedId) return console.error("relatedType and relatedId are required");

    let existing = document.getElementById('imageModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; justify-content:center; align-items:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:24px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>${image ? 'Edit Image' : 'Add Image'}</h2>
            <input id="imageURL" placeholder="Image URL" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${image?.image_url || ''}">
            <input id="imageCaption" placeholder="Caption" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${image?.caption || ''}">
            <div style="margin-top:12px;">
                <button id="saveImageBtn" style="padding:12px 20px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">
                    ${image ? 'Update' : 'Save'}
                </button>
                ${image ? `<button id="deleteImageBtn" style="padding:12px 20px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">Delete</button>` : ''}
                <button id="closeImageBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeImageBtn').onclick = () => modal.remove();

    document.getElementById('saveImageBtn').onclick = async () => {
        const url = document.getElementById('imageURL').value.trim();
        const caption = document.getElementById('imageCaption').value.trim();

        if (!url) return alert('Image URL is required.');

        await insertImage({ related_type: relatedType, related_id: relatedId, image_url: url, caption });
        modal.remove();

        const { renderImages } = await import('./view_6_grid.js');
        renderImages(relatedType, relatedId);
    };

    if (image) {
        document.getElementById('deleteImageBtn').onclick = async () => {
            if (confirm('Are you sure you want to delete this image?')) {
                await deleteImage(image.id);
                modal.remove();
                const { renderImages } = await import('./view_6_grid.js');
                renderImages(relatedType, relatedId);
            }
        };
    }
}
