/* =================================================
FILE: view_6_modal.js
UPDATED: 2026-06-01
================================================= */

// Optional modal for image details (can extend in the future)
export function openImageModal({ title, imageURL }) {
    const existing = document.getElementById('imageModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;
    modal.innerHTML = `
        <div style="background:white; padding:20px; border-radius:12px; width:90%; max-width:500px; text-align:center;">
            <h2>${title}</h2>
            <img src="${imageURL}" style="width:100%; max-height:400px; object-fit:contain; border-radius:8px;">
            <button id="closeImageModal" style="margin-top:12px; padding:10px 16px; border:none; border-radius:8px; background:#6b7280; color:white; cursor:pointer;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeImageModal').onclick = () => modal.remove();
}
