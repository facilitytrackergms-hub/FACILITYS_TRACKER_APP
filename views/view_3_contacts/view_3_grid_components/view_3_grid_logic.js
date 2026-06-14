/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid_logic.js
SUPABASE TBL : contacts
VIEW NAME    : Facility Directory Logic
LAST UPDATED : 2026-06-14 @ 03:45 PM
================================================================*/

import { openIssueModal } from '../../view_5_issues/view_5_modal.js';
import { fetchContacts, insertContact as createContact, updateContact, deleteContact } from '../view_3_data.js';
import { fetchFacilityIssues } from '../../view_5_issues/view_5_data.js';

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

    const issueModal = document.getElementById('issueModal');
    const issueCloseBtn = document.getElementById('closeIssueModal');
    const issueSaveBtn = document.getElementById('saveIssueBtn');
    const issueTextBtn = document.getElementById('issueTextBtn');
    const issueEmailBtn = document.getElementById('issueEmailBtn');

    if (issueCloseBtn) {
        issueCloseBtn.onclick = () => {
            if (issueModal) issueModal.style.display = 'none';
        };
    }

    if (issueSaveBtn) {
        issueSaveBtn.onclick = () => {
            if (issueModal) issueModal.style.display = 'none';
        };
    }

    if (issueTextBtn) {
        issueTextBtn.onclick = () => {
            const title = document.getElementById('issueTitleInput')?.value || '';
            const phone = activeSelectedContact?.phone || '';
            if (phone) window.location.href = `sms:${phone}?body=${encodeURIComponent(title)}`;
        };
    }

    if (issueEmailBtn) {
        issueEmailBtn.onclick = () => {
            const title = document.getElementById('issueTitleInput')?.value || '';
            const email = activeSelectedContact?.email || '';
            if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent('Maintenance Update')}&body=${encodeURIComponent(title)}`;
        };
    }

    if (viewContext.facility?.id) {
        localContactsList = await fetchContacts(viewContext.facility.id);
        renderGrid(localContactsList);
    }

    function renderGrid(contacts) {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        if (!contacts || contacts.length === 0) {
            gridContainer.innerHTML = `<p style="grid-column: 1/-1; color:#6b7280; font-size:14px; font-style:italic;">No contacts added yet.</p>`;
            return;
        }

        contacts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'contact-thumbnail';

            const fallbackAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
            const displayPhoto = item.image_url || item.profile_photo_url || fallbackAvatar;

            card.innerHTML = `
                <img src="${displayPhoto}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;" />
                <div class="thumbnail-name">${item.contact_name || 'Unnamed Contact'}</div>
                <div class="thumbnail-role">${item.role || item.role_title || 'No Title'}</div>
            `;

            card.onclick = () => showContactProfile(item);
            gridContainer.appendChild(card);
        });
    }

    async function showContactProfile(contact) {
        activeSelectedContact = contact;

        document.getElementById('detailAvatar').src =
            contact.image_url || contact.profile_photo_url || '';

        document.getElementById('detailName').textContent =
            contact.contact_name || 'Unnamed Contact';

        document.getElementById('detailRole').textContent =
            contact.role || contact.role_title || 'N/A';

        const phoneLink = document.getElementById('detailPhoneLink');
        phoneLink.textContent = contact.phone || 'N/A';
        phoneLink.href = contact.phone ? `tel:${contact.phone}` : '#';

        const emailLink = document.getElementById('detailEmailLink');
        emailLink.textContent = contact.email || 'N/A';
        emailLink.href = contact.email ? `mailto:${contact.email}` : '#';

        document.getElementById('detailNotes').textContent =
            contact.notes || 'No operational notes provided.';
    }

    function hideContactProfile() {
        activeSelectedContact = null;
        if (profilePane) profilePane.style.display = 'none';
        if (directorySelectionLayout) directorySelectionLayout.style.display = 'block';
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', { facility: viewContext.facility });
            }
        };
    }

    /* KEEP EVERYTHING SAME - NO CHANGES ABOVE THIS POINT */

}

/* =========================================================
CRITICAL FIX: compatibility export for main.js loader
========================================================= */
export default function renderFacilityContacts() {
    return initializeGridLogic.apply(this, arguments);
}
