/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid_logic.js
SUPABASE TBL : contacts
VIEW NAME    : Directory Entries
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-07 @ 05:28 AM
================================================================*/

import { fetchContacts, insertContact } from '/FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_data.js';
import { insertFacilityIssue } from '/FACILITYS_TRACKER_APP/views/view_5_issues/view_5_data.js';

let localContactsList = [];
let activeSelectedContact = null;
let viewContext = {};

export async function initializeGridLogic(context) {
    viewContext = context;
    console.log("Initializing Contacts View Logic Layer with payload context:", viewContext);

    const activeFacilityId = viewContext.facility?.id || viewContext.facilityId;
    if (activeFacilityId) {
        localContactsList = await fetchContacts(activeFacilityId);
        renderGrid(localContactsList);
    }

    setupFormActionListeners();
    setupMediaCaptureHooks();

    if (viewContext.openFormInstantly && viewContext.prefilledContactName) {
        const contactModal = document.getElementById('contactFormModal');
        const manualContactName = document.getElementById('manualContactName');
        if (contactModal && manualContactName) {
            manualContactName.value = viewContext.prefilledContactName;
            contactModal.style.display = 'flex';
        }
    }
}

function renderGrid(contacts) {
    const gridBody = document.getElementById('contactsGridBody');
    if (!gridBody) return;

    gridBody.innerHTML = '';
    if (!contacts || contacts.length === 0) {
        gridBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#9ca3af;">No workspace contact records active inside this facility directory.</td></tr>`;
        return;
    }

    contacts.forEach(contact => {
        const tr = document.createElement('tr');
        tr.className = 'contacts-grid-row';
        tr.onclick = () => showContactProfile(contact);
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <img class="contact-avatar-badge" src="${contact.avatar_url || 'https://via.placeholder.com/40'}" alt="Avatar">
                    <div class="contact-cell-primary">${contact.contact_name || 'N/A'}</div>
                </div>
            </td>
            <td><span class="contact-role-pill">${contact.role || 'General'}</span></td>
            <td class="contact-cell-secondary">${contact.phone || 'N/A'}</td>
            <td class="contact-cell-secondary">${contact.email || 'N/A'}</td>
        `;
        gridBody.appendChild(tr);
    });
}

function showContactProfile(contact) {
    activeSelectedContact = contact;
    const panel = document.getElementById('contactDetailPanel');
    const placeholder = document.getElementById('contactPanelPlaceholder');
    if (!panel || !placeholder) return;

    document.getElementById('detailAvatar').src = contact.avatar_url || 'https://via.placeholder.com/90';
    document.getElementById('detailName').textContent = contact.contact_name || 'Contact Profile';
    document.getElementById('detailRole').textContent = contact.role || 'General Staff';
    document.getElementById('detailPhone').textContent = contact.phone || 'None Registered';
    document.getElementById('detailEmail').textContent = contact.email || 'None Registered';
    document.getElementById('detailNotes').textContent = contact.notes || 'No extended internal operational summaries submitted.';

    placeholder.style.display = 'none';
    panel.style.display = 'block';
}

function hideContactProfile() {
    activeSelectedContact = null;
    const panel = document.getElementById('contactDetailPanel');
    const placeholder = document.getElementById('contactPanelPlaceholder');
    if (panel) panel.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
}

function setupFormActionListeners() {
    const addContactTriggerBtn = document.getElementById('addNewContactBtn') || document.getElementById('addContactTriggerBtn');
    const backToControlsBtn = document.getElementById('backToControlsBtn');
    const cancelContactModalBtn = document.getElementById('cancelContactModalBtn');
    const saveContactBtn = document.getElementById('saveContactBtn');
    const contactModal = document.getElementById('contactFormModal');

    const manualContactName = document.getElementById('manualContactName');
    const manualContactRole = document.getElementById('manualContactRole');
    const manualContactPhone = document.getElementById('manualContactPhone');
    const manualContactEmail = document.getElementById('manualContactEmail');
    const manualContactNotes = document.getElementById('manualContactNotes');
    const hiddenImageInput = document.getElementById('manualContactImageBase64');
    const cameraStatusText = document.getElementById('cameraStatusText');

    if (backToControlsBtn) {
        backToControlsBtn.onclick = () => {
            if (window.navigateTo) {
                const targetId = viewContext.facility?.id || viewContext.facilityId;
                window.navigateTo('view_2_controls', { facility: { id: targetId } });
            }
        };
    }

    if (addContactTriggerBtn) {
        addContactTriggerBtn.onclick = () => {
            if (contactModal) {
                if (manualContactName) manualContactName.value = '';
                if (manualContactRole) manualContactRole.value = '';
                if (manualContactPhone) manualContactPhone.value = '';
                if (manualContactEmail) manualContactEmail.value = '';
                if (manualContactNotes) manualContactNotes.value = '';
                if (hiddenImageInput) hiddenImageInput.value = '';
                if (cameraStatusText) {
                    cameraStatusText.textContent = "No capture stream active";
                    cameraStatusText.style.color = "#9ca3af";
                }
                contactModal.style.display = 'flex';
            }
        };
    }

    if (cancelContactModalBtn) {
        cancelContactModalBtn.onclick = () => {
            contactModal.style.display = 'none';
        };
    }

    if (saveContactBtn) {
        saveContactBtn.onclick = async () => {
            const nameValue = manualContactName.value.trim();
            const roleValue = manualContactRole?.value.trim() || '';
            const phoneValue = manualContactPhone?.value.trim() || '';
            const emailValue = manualContactEmail?.value.trim() || '';
            const notesValue = manualContactNotes?.value.trim() || '';
            const imgBase64 = hiddenImageInput?.value || null;

            if (!nameValue) {
                alert("Profile contact name tracking context is required.");
                return;
            }

            const targetFacilityId = viewContext.facility?.id || viewContext.facilityId;
            const payload = {
                facility_id: targetFacilityId,
                contact_name: nameValue,
                role: roleValue,
                phone: phoneValue,
                email: emailValue,
                notes: notesValue,
                avatar_url: imgBase64
            };

            const savedContact = await insertContact(payload);
            if (savedContact) {
                contactModal.style.display = 'none';
                if (viewContext.pendingIssueData) {
                    try {
                        viewContext.pendingIssueData.contact_id = savedContact.id;
                        await insertFacilityIssue(viewContext.pendingIssueData);
                    } catch (issueErr) {
                        console.error("Failed executing automated backwards issue registration:", issueErr);
                    }
                    if (window.navigateTo) {
                        window.navigateTo('view_5_issues', { facility: { id: targetFacilityId } });
                        return;
                    }
                }
                localContactsList = await fetchContacts(targetFacilityId);
                renderGrid(localContactsList);
                hideContactProfile();
            } else {
                alert("Failed to submit directory profile record entry.");
            }
        };
    }
}

function setupMediaCaptureHooks() {
    const cameraTriggerBtn = document.getElementById('cameraTriggerBtn');
    const cameraFileInput = document.getElementById('cameraFileInput');
    const cameraStatusText = document.getElementById('cameraStatusText');
    const hiddenImageInput = document.getElementById('manualContactImageBase64');

    if (cameraTriggerBtn && cameraFileInput) {
        cameraTriggerBtn.addEventListener('click', () => {
            cameraFileInput.click();
        });
        cameraFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    if (hiddenImageInput) hiddenImageInput.value = evt.target.result;
                    if (cameraStatusText) {
                        cameraStatusText.textContent = "Photo captured successfully";
                        cameraStatusText.style.color = "#10b981";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const currentFacId = viewContext.facility?.id || viewContext.facilityId;
    setupContactsEvents({
        facilityId: currentFacId,
        onRefresh: async () => {
            localContactsList = await fetchContacts(currentFacId);
            renderGrid(localContactsList);
            hideContactProfile();
        },
        getActiveSelected: () => activeSelectedContact
    });
}

export function setupContactsEvents(config) {
    console.log("Contacts module telemetry events loaded.", config);
}
