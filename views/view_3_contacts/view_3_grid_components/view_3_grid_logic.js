/*================================================================
FACILITY_TRACKER_APP - CODEBASE EXECUTION PARAMETERS
================================================================
DESCRIPTION: Full file delivery with functional modal button bindings.
================================================================*/
/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid_logic.js
SUPABASE TBL : contacts
VIEW NAME    : Facility Directory Logic
LAST UPDATED : 2026-06-14 @ 07:30 PM
================================================================*/

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

    // --- FIX: Modal Event Bindings ---
    if (openModalBtn) {
        openModalBtn.onclick = () => {
            if (modalShell) modalShell.style.display = 'flex';
        };
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            if (modalShell) modalShell.style.display = 'none';
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
            gridContainer.innerHTML = `<p style="grid-column: 1/-1; color:#6b7280; font-size:14px; font-style:italic;">No contacts found.</p>`;
            return;
        }

        contacts.forEach(contact => {
            const card = document.createElement('div');
            card.className = 'contact-thumbnail';
            card.innerHTML = `
                <div class="thumbnail-name">${contact.contact_name}</div>
                <div class="thumbnail-role">${contact.role || 'No role assigned'}</div>
            `;
            card.onclick = () => showProfile(contact);
            gridContainer.appendChild(card);
        });
    }

    function showProfile(contact) {
        activeSelectedContact = contact;
        document.getElementById('detailName').textContent = contact.contact_name;
        document.getElementById('detailRole').textContent = contact.role;
        document.getElementById('detailPhoneLink').textContent = contact.phone;
        document.getElementById('detailPhoneLink').href = `tel:${contact.phone}`;
        document.getElementById('detailEmailLink').textContent = contact.email;
        document.getElementById('detailEmailLink').href = `mailto:${contact.email}`;
        document.getElementById('detailNotes').textContent = contact.notes;
        
        directorySelectionLayout.style.display = 'none';
        profilePane.style.display = 'block';
    }

    function hideContactProfile() {
        directorySelectionLayout.style.display = 'block';
        profilePane.style.display = 'none';
        activeSelectedContact = null;
    }

    if (document.getElementById('closeDetailPaneBtn')) {
        document.getElementById('closeDetailPaneBtn').onclick = hideContactProfile;
    }

    if (saveContactBtn) {
        saveContactBtn.onclick = async () => {
            const payload = {
                facility_id: viewContext.facility?.id,
                contact_name: document.getElementById('manualContactName').value.trim(),
                role: document.getElementById('manualContactRole').value.trim(),
                phone: document.getElementById('manualContactPhone').value.trim(),
                email: document.getElementById('manualContactEmail').value.trim(),
                notes: document.getElementById('manualContactNotes').value.trim()
            };

            if (!payload.contact_name) {
                alert("Missing contact name.");
                return;
            }
            
            await createContact(payload);
            localContactsList = await fetchContacts(viewContext.facility?.id);
            renderGrid(localContactsList);
            if (modalShell) modalShell.style.display = 'none';
        };
    }
}
