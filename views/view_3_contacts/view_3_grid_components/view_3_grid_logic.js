/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid_logic.js
SUPABASE TBL : contacts
VIEW NAME    : Facility Directory Logic
LAST UPDATED : 2026-06-14 @ 07:45 PM
================================================================*/

import { openIssueModal } from '../../view_5_issues/view_5_modal.js';
import { fetchContacts, insertContact as createContact, updateContact, deleteContact } from '../view_3_data.js';
import { fetchFacilityIssues, insertFacilityIssue } from '../../view_5_issues/view_5_data.js';

export async function initializeGridLogic(viewContext) {
    let localContactsList = [];
    let activeSelectedContact = null;

    // Wait for DOM to paint elements before binding events
    setTimeout(async () => {
        const gridContainer = document.getElementById('contactsGridElement');
        const profilePane = document.getElementById('contactDetailPane');
        const directorySelectionLayout = document.getElementById('directorySelectionLayout');
        const backBtn = document.getElementById('backBtn');
        const modalShell = document.getElementById('manualContactModal');
        const openModalBtn = document.getElementById('manualContactTriggerBtn');
        const closeModalBtn = document.getElementById('cancelContactModalBtn');
        const saveContactBtn = document.getElementById('saveContactBtn');

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
                card.onclick = () => showContactProfile(item);
                gridContainer.appendChild(card);
            });
        }

        async function showContactProfile(contact) {
            activeSelectedContact = contact;
            if (!profilePane || !directorySelectionLayout) return;

            const fallbackAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
            const detailAvatar = document.getElementById('detailAvatar');
            if (detailAvatar) detailAvatar.src = contact.image_url || contact.profile_photo_url || fallbackAvatar;
            
            document.getElementById('detailName').textContent = contact.contact_name || 'Unnamed Contact';
            document.getElementById('detailRole').textContent = contact.role || contact.role_title || 'N/A';
            
            const phoneValue = contact.phone || contact.phone_number || '';
            const phoneLink = document.getElementById('detailPhoneLink');
            if (phoneLink) {
                phoneLink.textContent = phoneValue || 'N/A';
                phoneLink.href = phoneValue ? `tel:${phoneValue}` : '#';
            }

            const emailValue = contact.email || contact.email_address || '';
            const emailLink = document.getElementById('detailEmailLink');
            if (emailLink) {
                emailLink.textContent = emailValue || 'N/A';
                emailLink.href = emailValue ? `mailto:${emailValue}` : '#';
            }

            document.getElementById('detailNotes').textContent = contact.notes || contact.operational_notes || 'No operational notes provided.';

            directorySelectionLayout.style.display = 'none';
            document.querySelector('.contacts-card-wrapper').style.pointerEvents = 'auto';
document.getElementById('contactDetailPane').style.pointerEvents = 'auto';
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
                            issueActionBtn.style.cssText = 'background:white; border:1px solid #d1d5db; border-radius:6px; padding:10px; margin-bottom:6px; display:flex; flex-direction:column; align-items:flex-start; width:100%; text-align:left; cursor:pointer;';
                            issueActionBtn.innerHTML = `
                                <div style="font-weight:bold; color:#00264d; font-size:13px;">🛠️ ${issue.title || 'Untitled Request'}</div>
                                <div style="font-size:11px; color:#6b7280; margin-top:2px;">Status: <b style="color:#10b981;">${issue.status || 'Open'}</b></div>
                            `;

                            issueActionBtn.onclick = () => {
                                openIssueModal(viewContext.facility, issue);
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

        const closeDetailBtn = document.getElementById('closeDetailPaneBtn');
        if (closeDetailBtn) closeDetailBtn.onclick = hideContactProfile;

        if (backBtn) {
            backBtn.onclick = () => {
                if (window.navigateTo) window.navigateTo('view_2_controls', { facility: viewContext.facility });
            };
        }

        const profileAddIssueBtn = document.getElementById('profileAddIssueBtn');
        if (profileAddIssueBtn) {
            profileAddIssueBtn.onclick = () => {
                const contactName = document.getElementById('detailName').textContent || '';
                if (window.navigateTo) {
                    window.navigateTo('view_5_issues', { 
                        facility: viewContext.facility,
                        openFormInstantly: true,
                        prefilledReporterName: contactName !== 'Contact Profile' ? contactName : ''
                    });
                }
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
            modalShell.style.display = 'flex';
        }

        if (openModalBtn && modalShell) {
            openModalBtn.onclick = () => openCreateDirectoryEntry("");
        }

        if (closeModalBtn && modalShell) {
            closeModalBtn.onclick = () => modalShell.style.display = 'none';
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

                if (!payload.contact_name) return alert("Missing contact name.");
                
                if (contactId) await updateContact(contactId, payload);
                else await createContact(payload);
                
                localContactsList = await fetchContacts(viewContext.facility?.id);
                renderGrid(localContactsList);
                modalShell.style.display = 'none';
                hideContactProfile();
            };
        }

        if (document.getElementById('profileEditBtn')) {
            document.getElementById('profileEditBtn').onclick = () => {
                if (!activeSelectedContact || !modalShell) return;
                document.getElementById('modalTemplateTitle').textContent = "Edit Contact";
                document.getElementById('editingContactId').value = activeSelectedContact.id;
                document.getElementById('manualContactImage').value = activeSelectedContact.image_url || activeSelectedContact.profile_photo_url || "";
                document.getElementById('manualContactName').value = activeSelectedContact.contact_name || "";
                document.getElementById('manualContactRole').value = activeSelectedContact.role || activeSelectedContact.role_title || "";
                document.getElementById('manualContactPhone').value = activeSelectedContact.phone || activeSelectedContact.phone_number || "";
                document.getElementById('manualContactEmail').value = activeSelectedContact.email || activeSelectedContact.email_address || "";
                document.getElementById('manualContactNotes').value = activeSelectedContact.notes || activeSelectedContact.operational_notes || "";
                modalShell.style.display = 'flex';
            };
        }

        if (document.getElementById('profileDeleteBtn')) {
            document.getElementById('profileDeleteBtn').onclick = async () => {
                if (!activeSelectedContact) return;
                if (confirm(`Remove ${activeSelectedContact.contact_name}?`)) {
                    await deleteContact(activeSelectedContact.id);
                    localContactsList = await fetchContacts(viewContext.facility?.id);
                    renderGrid(localContactsList);
                    hideContactProfile();
                }
            };
        }

        const cameraTriggerBtn = document.getElementById('cameraTriggerBtn');
        const cameraFileInput = document.getElementById('manualContactImageFile');
        const hiddenImageInput = document.getElementById('manualContactImage');
        const cameraStatusText = document.getElementById('cameraStatusText');

        if (cameraTriggerBtn && cameraFileInput) {
            cameraTriggerBtn.onclick = () => cameraFileInput.click();
            cameraFileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        if (hiddenImageInput) hiddenImageInput.value = evt.target.result;
                        if (cameraStatusText) {
                            cameraStatusText.textContent = "Photo captured successfully";
                            cameraStatusText.style.color = "#10b981";
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
        }
    }, 100);
}
