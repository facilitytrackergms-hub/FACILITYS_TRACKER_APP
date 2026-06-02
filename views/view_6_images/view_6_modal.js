/* =================================================
FILE: views/view_6_images/view_6_modal.js
UPDATED: 2026-06-02 06:00:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupGalleryEvents(facility) {
    const wrapper = document.getElementById('galleryImageManager');
    if (!wrapper) return;

    if (!facility || !facility.id) {
        wrapper.innerHTML = '<div style="padding:20px; color:red; font-weight:bold;">Error: Invalid facility configuration payload context.</div>';
    } else {
        // Mount image manager attachment directly under targeted metadata conditions
        renderImageManagerSection(wrapper, 'facility', facility.id, { 
            title: 'Facility Asset Documents', 
            allowUpload: true, 
            allowDelete: true 
        });
    }

    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', facility);
            }
        };
    }
}
