/* =================================================
FILE: views/view_1_facility/view_1_modal.js
UPDATED: 2026-06-02 05:30:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { insertFacility } from './view_1_data.js';
import { renderImageManagerSection } from '../../js/imageManager.js';

export function setupFacilitiesEvents(renderFacilitiesFn) {
    const modal = document.getElementById('modal');
    const warningModal = document.getElementById('warningModal');
    const imageMount = document.getElementById('image-manager-mount');
    const imageSection = document.getElementById('post-save-images');
    const saveBtn = document.getElementById('saveBtn');
    const facilityFields = document.getElementById('facility-fields');
    let createdFacility = null;

    document.getElementById('openModal').onclick = () => {
        createdFacility = null;
        modal.style.display = 'block';
        imageSection.style.display = 'none';
        facilityFields.style.display = 'block';
        saveBtn.style.display = 'block';
        imageMount.innerHTML = '';
        document.getElementById('modalTitle').innerText = "Add New Facility";
        document.getElementById('name').value = '';
        document.getElementById('address').value = '';
        document.getElementById('phone').value = '';
    };

    document.getElementById('closeModal').onclick = () => {
        modal.style.display = 'none';
        renderFacilitiesFn();
    };

    document.getElementById('closeWarning').onclick = () => warningModal.style.display = 'none';

    async function saveFacilityAndOpenImages() {
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name || !address || !phone) {
            warningModal.style.display = 'block';
            return;
        }

        const newFacility = await insertFacility(name, address, phone);

        if (newFacility) {
            createdFacility = newFacility;
            facilityFields.style.display = 'none';
            saveBtn.style.display = 'none';
            document.getElementById('modalTitle').innerText = "Facility Image: " + name;
            imageSection.style.display = 'block';
            imageMount.innerHTML = '';
            renderImageManagerSection(imageMount, 'facility', createdFacility.id, { title: 'Facility Image' });
        }
    }

    document.getElementById('prepareImageBtn').onclick = saveFacilityAndOpenImages;
    saveBtn.onclick = saveFacilityAndOpenImages;
}
