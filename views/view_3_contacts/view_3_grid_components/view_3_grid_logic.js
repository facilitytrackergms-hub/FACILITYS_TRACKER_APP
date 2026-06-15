/*================================================================
FILE NAME    : view_3_grid_logic.js
PURPOSE      : Contact Directory Logic & Grid Management
LOCATION     : /views/view_3_contacts/view_3_grid_components/
================================================================*/

import { openIssueModal } from '../../view_5_issues/view_5_modal.js';
import { fetchContacts, insertContact as createContact, updateContact, deleteContact } from '../view_3_data.js';
import { fetchFacilityIssues, insertFacilityIssue } from '../../view_5_issues/view_5_data.js';

export async function initializeGridLogic(viewContext) {
    let localContactsList = [];
    let activeSelectedContact = null;

    const gridContainer = document.getElementById('contactsGridElement');
    const profilePane = document.getElementById('contactDetailPane');
    const directorySelectionLayout = document.getElementById('directorySelectionLayout');
    const backBtn = document.getElementById('backBtn');

    const modalShell = document.getElementById('manualContactModal');
    const openModalBtn = document.getElementById('manualContactTriggerBtn');
    const closeModalBtn = document.getElementById('cancelContactModalBtn');
    const saveContactBtn = document.getElementById('saveContactBtn');

    // Load directory details
    if (viewContext.facility?.id) {
        localContactsList = await fetchContacts(viewContext.facility.id);
        renderGrid(localContactsList);
    }

    function renderGrid(contacts) {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        if (!contacts || contacts.length === 0) {
            gridContainer.innerHTML = `<p style="grid-column: 1/-1; color:#6b7280; font-size:14px; font-style:italic; margin:10px 0;">No contacts added yet.</p>`;
            return;
        }

        contacts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'contact-thumbnail';
            
            const fallbackAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
            const displayPhoto = item.image_url || item.profile_photo_url || fallbackAvatar;

            card.innerHTML = `
                <img src="${displayPhoto}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; background:#e5e7eb;" />
                <div class="thumbnail-name">${item.contact_name || 'Unnamed Contact'}</div>
                <div class="thumbnail-role">${item.role || item.role_title || 'No Title'}</div>
            `;
            
            // --- UPDATED: Direct navigation to Issue View ---
            card.onclick = () => {
                if (window.navigateTo) {
                    window.navigateTo('view_5_issues', { 
                        facility: viewContext.facility,
                        openFormInstantly: true,
                        prefilledReporterName: item.contact_name
                    });
                }
            };

            gridContainer.appendChild(card);
        });
    }

    async function showContactProfile(contact) {
        activeSelectedContact = contact;
        if (!profilePane || !directorySelectionLayout) return;

        const fallbackAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
        
        document.getElementById('detailAvatar').src = contact.image_url || contact.profile_photo_url || fallbackAvatar;
        document.getElementById('detailName').textContent = contact.contact_name || 'Unnamed Contact';
        document.getElementById('detailRole').textContent = contact.role || contact.role_title || 'N/A';
        
        const phoneValue = contact.phone || contact.phone_number || '';
        const phoneLink = document.getElementById('detailPhoneLink');
        phoneLink.textContent = phoneValue || 'N/A';
        phoneLink.href = phoneValue ? `tel:${phoneValue}` : '#';

        const emailValue = contact.email || contact.email_address || '';
        const emailLink = document.getElementById('detailEmailLink');
        emailLink.textContent = emailValue || 'N/A';
        emailLink.href = emailValue ? `mailto:${emailValue}` : '#';

        document.getElementById('detailNotes').textContent = contact.notes || contact.operational_notes || 'No operational notes provided.';

        directorySelectionLayout.style.display = 'none';
        profilePane.style.display = 'block';

        if (backBtn) backBtn.style.display = 'none';

        const targetHistoryContainer = document.getElementById('contactIssuesHistoryList');
        if (targetHistoryContainer && viewContext.facility?.id) {
            targetHistoryContainer.innerHTML = '<div style="font-size:12px; color:#6b7280; font-style:italic;">Querying reported issues...</div>';
            
            try {
                const allFacilityIssues = await fetchFacilityIssues(viewContext.facility.id);
                const matchedIssues = (allFacilityIssues || []).filter(issue => {
                    return String(issue.reported_by || '').trim().toLowerCase() === String(contact.contact_name || '').trim().toLowerCase();
                });

                targetHistoryContainer.innerHTML = '';
                if (matchedIssues.length === 0) {
                    targetHistoryContainer.innerHTML = '<div style="font-size:12px; color:#9ca3af; padding:5px 0;">No reported maintenance logs under this name.</div>';
                } else {
                    matchedIssues.forEach(issue => {
                        const issueActionBtn = document.createElement('button');
                        issueActionBtn.className = 'contacts-view-btn';
                        issueActionBtn.style.cssText = 'background:white; border:1px solid #d1d5db; border-radius:6px; padding:10px; margin-bottom:6px; display:flex; flex-direction:column; align-items:flex-start; width:100%; text-align:left; text-transform:none; font-weight:normal; font-family:Arial, sans-serif; cursor:pointer; box-sizing:border-box; box-shadow:0 1px 2px rgba(0,0,0,0.05);';
                        
                        issueActionBtn.innerHTML = `
                            <div style="font-weight:bold; color:#00264d; font-size:13px;">🛠️ ${issue.title || 'Untitled Request'}</div>
                            <div style="font-size:11px; color:#6b7280; margin-top:2px;">Status: <b style="color:#10b981;">${issue.status || 'Open'}</b></div>
                        `;

                        issueActionBtn.onclick = () => {
                            if (typeof openIssueModal === 'function') {
                                openIssueModal(viewContext.facility, issue, contact);
                            }
                        };
                        targetHistoryContainer.appendChild(issueActionBtn);
                    });
                }
            } catch (err) {
                console.error("Contextual database parsing error:", err);
                targetHistoryContainer.innerHTML = '<div style="font-size:12px; color:#dc2626;">Failed to load history parameters.</div>';
            }
        }
    }

    function hideContactProfile() {
        activeSelectedContact = null;
        if (!profilePane || !directorySelectionLayout) return;

        profilePane.style.display = 'none';
        directorySelectionLayout.style.display = 'block';
        if (backBtn) backBtn.style.display = 'block';
    }

    if (document.getElementById('closeDetailPaneBtn')) {
        document.getElementById('closeDetailPaneBtn').onclick = hideContactProfile;
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) window.navigateTo('view_2_controls', { facility: viewContext.facility });
        };
    }

    function openCreateDirectoryEntry(prefilledName = "") {
        if (!modalShell) return;

        document.getElementById('modalTemplateTitle').textContent = "Create Directory Entry";
        document.getElementById('editingContactId').value = "";
        document.getElementById('manualContactImage').value = "";
        document.getElementById('manualContactName').value = prefilledName || "";
        document.getElementById('manualContactRole').value = "";
        document.getElementById('manualContactPhone').value = "";
        document.getElementById('manualContactEmail').value = "";
        document.getElementById('manualContactNotes').value = "";
        document.getElementById('cameraStatusText').textContent = "No photo captured";
        document.getElementById('cameraStatusText').style.color = "#6b7280";

        if (typeof window.attachModalStampTracker === 'function') {
            window.attachModalStampTracker();
        }

        modalShell.style.display = 'flex';
    }

    if (openModalBtn && modalShell) {
        openModalBtn.onclick = () => {
            openCreateDirectoryEntry("");
        };
    }

    if (viewContext?.openFormInstantly) {
        openCreateDirectoryEntry(viewContext.prefilledContactName || "");
    }

    if (closeModalBtn && modalShell) {
        closeModalBtn.onclick = () => {
            modalShell.style.display = 'none';
        };
    }

    if (saveContactBtn && modalShell) {
        saveContactBtn.onclick = async () => {
            const contactId = document.getElementById('editingContactId').value;
            const payload = {
                facility_id: viewContext.facility?.id,
                contact_name: document.getElementById('manualContactName').value.trim(),
                role: document.getElementById('manualContactRole').value.trim(),
                phone: document.getElementById('manualContactPhone').value.trim(),
                email: document.getElementById('manualContactEmail').value.trim(),
                notes: document.getElementById('manualContactNotes').value.trim(),
                image_url: document.getElementById('manualContactImage').value
            };

            if (!payload.contact_name) {
                alert("Please assign a contact name field baseline before saving.");
                return;
            }

            let savedContact;
            if (contactId) {
                await updateContact(contactId, payload);
                savedContact = { id: contactId };
            } else {
                savedContact = await createContact(payload);
            }

            if (viewContext.pendingIssueData && savedContact?.id) {
                await insertFacilityIssue({
                    ...viewContext.pendingIssueData,
                    contact_id: savedContact.id
                });

                if (window.navigateTo) {
                    window.navigateTo('view_5_issues', { facility: viewContext.facility });
                    return;
                }
            }

            localContactsList = await fetchContacts(viewContext.facility?.id);
            renderGrid(localContactsList);
            modalShell.style.display = 'none';
            hideContactProfile();
        };
    }

    if (document.getElementById('profileEditBtn')) {
        document.getElementById('profileEditBtn').onclick = () => {
            if (!activeSelectedContact || !modalShell) return;

            document.getElementById('manualContactImage').value = activeSelectedContact.image_url || activeSelectedContact.profile_photo_url || "";
            document.getElementById('manualContactName').value = activeSelectedContact.contact_name || "";
            document.getElementById('manualContactRole').value = activeSelectedContact.role || activeSelectedContact.role_title || "";
            document.getElementById('manualContactPhone').value = activeSelectedContact.phone || activeSelectedContact.phone_number || "";
            document.getElementById('manualContactEmail').value = activeSelectedContact.email || activeSelectedContact.email_address || "";
            document.getElementById('manualContactNotes').value = activeSelectedContact.notes || activeSelectedContact.operational_notes || "";
            
            if (activeSelectedContact.image_url || activeSelectedContact.profile_photo_url) {
                document.getElementById('cameraStatusText').textContent = "Existing photo active";
                document.getElementById('cameraStatusText').style.color = "#10b981";
            }

            if (typeof window.attachModalStampTracker === 'function') {
                window.attachModalStampTracker();
            }
            modalShell.style.display = 'flex';
        };
    }

    if (document.getElementById('profileDeleteBtn')) {
        document.getElementById('profileDeleteBtn').onclick = async () => {
            if (!activeSelectedContact) return;
            if (confirm(`Are you certain you want to remove ${activeSelectedContact.contact_name || 'this contact'}?`)) {
                await deleteContact(activeSelectedContact.id);
                localContactsList = await fetchContacts(viewContext.facility?.id);
                renderGrid(localContactsList);
                hideContactProfile();
            }
        };
    }

    const cameraTriggerBtn = document.getElementById('cameraTriggerBtn');
    const cameraFileInput = document.getElementById('manualContactImageFile');
    const cameraStatusText = document.getElementById('cameraStatusText');
    const hiddenImageInput = document.getElementById('manualContactImage');

    if (cameraTriggerBtn && cameraFileInput) {
        cameraTriggerBtn.addEventListener('click', () => {
            cameraFileInput.click();
        });

        cameraFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    if (hiddenImageInput) {
                        hiddenImageInput.value = evt.target.result;
                    }
                    if (cameraStatusText) {
                        cameraStatusText.textContent = "Photo captured successfully";
                        cameraStatusText.style.color = "#10b981";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    setupContactsEvents({
        facilityId: viewContext.facility?.id,
        onRefresh: async () => {
            localContactsList = await fetchContacts(viewContext.facility?.id);
            renderGrid(localContactsList);
            hideContactProfile();
        },
        getActiveSelected: () => activeSelectedContact
    });
}

export function setupContactsEvents(config) {
    console.log("Contacts module telemetry events loaded.", config);
}
