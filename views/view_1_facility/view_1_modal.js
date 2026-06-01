/* =================================================
FILE: view_1_modal.js
VIEW: Facilities Dashboard
UPDATED: 2026-06-01 09:35 AM
================================================= */

import { insertFacility } from './view_1_data.js';
import { renderImageManagerSection } from '../../js/imagemanager.js';

export function setupFacilityModal(modalId, listContainerId) {
    const modal = document.getElementById(modalId);
    const listContainer = document.getElementById(listContainerId);
    if (!modal || !listContainer) return;

    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    const saveBtn = document.getElementById('saveBtn');
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const notesInput = document.getElementById('notes');
    const warningModal = document.getElementById('warningModal');
    const imageMount = document.getElementById('image-manager-mount');
    const postImageSection = document.getElementById('post-save-images');

    let createdFacility = null;

    openModalBtn.onclick = () => {
        createdFacility = null;
        modal.style.display = 'block';
        postImageSection.style.display = 'none';
        imageMount.innerHTML = '';
        nameInput.value = '';
        addressInput.value = '';
        phoneInput.value = '';
        if (notesInput) notesInput.value = '';
    };

    closeModalBtn.onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('closeWarning').onclick = () => warningModal.style.display = 'none';

    async function saveFacilityAndShowImages() {
        const name = nameInput.value.trim();
        const address = addressInput.value.trim();
        const phone = phoneInput.value.trim();
        const notes = notesInput ? notesInput.value.trim() : '';

        if (!name || !address || !phone) {
            warningModal.style.display = 'block';
            return;
        }

        const facility = await insertFacility({ name, address, phone, notes });
        if (!facility) return;

        createdFacility = facility;
        postImageSection.style.display = 'block';
        renderImageManagerSection(imageMount, 'facility', facility.id, { title: 'Facility Images' });
    }

    saveBtn.onclick = saveFacilityAndShowImages;

    /* Version Tag */
    const versionDiv = document.createElement('div');
    versionDiv.style.fontSize = '0.8em';
    versionDiv.style.color = '#666';
    versionDiv.style.borderTop = '1px solid #ccc';
    versionDiv.style.paddingTop = '10px';
    versionDiv.innerText = 'File: view_1_modal.js | View: Facility Modal | Updated: 2026-06-01 09:35 AM';
    modal.appendChild(versionDiv);
}
