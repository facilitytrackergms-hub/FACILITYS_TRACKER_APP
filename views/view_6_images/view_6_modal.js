/* =================================================
FILE: controls_v6_modal.js
UPDATED: 2026-05-30 06:10 AM
================================================= */
export function setupImageModals(facility) {
    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('facilityControls', { facility });
        }
    };
}
