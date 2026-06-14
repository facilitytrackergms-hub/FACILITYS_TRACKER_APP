/*================================================================
FACILITY_TRACKER_APP - CODEBASE EXECUTION PARAMETERS
================================================================
DESCRIPTION: Full file delivery with DOM-ready button binding fix.
================================================================*/
/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_modal.js
SUPABASE TBL : contacts
VIEW NAME    : Modify Contact Details
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-14 @ 04:55 PM
================================================================*/

import { insertContact } from '/FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_data.js';

export function renderStandaloneContactModal(containerId, config = {}) {
    const targetContainer = document.getElementById(containerId);
    if (!targetContainer) return;

    targetContainer.innerHTML = `
        <div id="manualContactModal" class="contacts-modal-overlay">
            <div class="contacts-modal-window">
                <h3 class="contacts-modal-title">Create Directory Entry</h3>
                
                <label class="form-field-label">Full Profile Tracker Name</label>
                <input type="text" id="modalContactName" class="form-field-input" placeholder="e.g. Jane Smith">

                <label class="form-field-label">Assigned Operational Role Title</label>
                <input type="text" id="modalContactRole" class="form-field-input" placeholder="e.g. Operations Director">

                <label class="form-field-label">Phone Number</label>
                <input type="text" id="modalContactPhone" class="form-field-input">

                <label class="form-field-label">Email Address</label>
                <input type="email" id="modalContactEmail" class="form-field-input">

                <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                    <button id="modalSaveContactBtn" class="contacts-view-btn btn-navy">Save Entry Parameters</button>
                    <button id="modalCloseBtn" class="contacts-view-btn btn-gray">Cancel</button>
                </div>
            </div>
        </div>
    `;

    // Ensure DOM is parsed before binding events
    setTimeout(() => {
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                document.getElementById('manualContactModal').style.display = 'none';
            };
        }

        const saveBtn = document.getElementById('modalSaveContactBtn');
        if (saveBtn) {
            saveBtn.onclick = async () => {
                const name = document.getElementById('modalContactName').value.trim();
                const role = document.getElementById('modalContactRole').value.trim();
                const phone = document.getElementById('modalContactPhone').value.trim();
                const email = document.getElementById('modalContactEmail').value.trim();

                if (!name) {
                    showUniqueAlert('view_3_modal_alert', "Name parameter validation context missing.");
                    return;
                }

                const success = await insertContact({
                    facility_id: config.facilityId,
                    contact_name: name,
                    role: role,
                    phone: phone,
                    email: email
                });

                if (success) {
                    document.getElementById('manualContactModal').style.display = 'none';
                    if (typeof config.onSuccess === 'function') config.onSuccess(success);
                } else {
                    showUniqueAlert('view_3_modal_alert', "Failed to execute standalone insert operations.");
                }
            };
        }
    }, 100);

    appendSourceTag();
}

function appendSourceTag() {
    let tag = document.getElementById('view_3_modal_source_tag');
    if (!tag) {
        tag = document.createElement('div');
        tag.id = 'view_3_modal_source_tag';
        tag.style.fontSize = '10px';
        tag.style.color = '#888';
        tag.style.padding = '5px 10px';
        tag.style.textAlign = 'right';
        const modalContent = document.querySelector('#manualContactModal .modal-content') || document.getElementById('manualContactModal');
        if (modalContent) modalContent.appendChild(tag);
    }
    tag.innerText = `Source: view_3_modal.js | Updated: 2026-06-14 04:55 PM`;
}

function showUniqueAlert(alertId, message) {
    let alertBox = document.getElementById(alertId);
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = alertId;
        alertBox.className = 'custom-unique-alert';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.backgroundColor = '#ffdddd';
        alertBox.style.color = '#d8000c';
        alertBox.style.border = '1px solid #d8000c';
        alertBox.style.padding = '10px 20px';
        alertBox.style.borderRadius = '4px';
        alertBox.style.zIndex = '9999';
        document.body.appendChild(alertBox);
    }
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
}
