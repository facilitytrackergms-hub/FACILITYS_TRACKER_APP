/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid_logic.js
SUPABASE TBL : contacts
VIEW NAME    : Directory Entries
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-07 @ 06:10 AM
================================================================*/

import { fetchContacts, insertContact } from '/FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_data.js';

let localContactsList = [];
let activeSelectedContact = null;
let viewContext = {};

const rowFallbackSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af' width='32' height='32'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/></svg>`;

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

    const addNewContactBtn = document.getElementById('addNewContactBtn');
    if (addNewContactBtn) {
        addNewContactBtn.onclick = () => {
            const contactModal = document.getElementById('contactFormModal');
            if (contactModal) contactModal.style.display = 'flex';
        };
    }

    const backToControlsBtn = document.getElementById('backToControlsBtn');
    if (backToControlsBtn) {
        backToControlsBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', { facility: viewContext.facility });
            }
        };
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

function renderGrid(contacts) {
    const gridBody = document.getElementById('contactsGridBody');
    if (!gridBody) return;

    if (!contacts || contacts.length === 0) {
        gridBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:30px; color:#9ca3af;">No directory records available.</td></tr>`;
        return;
    }

    gridBody.innerHTML = contacts.map(contact => {
        const imageSource = contact.avatar_url || rowFallbackSvg;
        return `
            <tr class="contact-row" data-id="${contact.id}" style="cursor:pointer; border-bottom:1px solid #e5e7eb;">
                <td style="padding:12px; display:flex; align-items:center; gap:10px;">
                    <img src="${imageSource}" 
                         alt="Avatar" 
                         style="width:32px; height:32px; border-radius:50%; object-fit:cover; vertical-align:middle;"
                         onerror="this.onerror=null; this.src='${rowFallbackSvg}';">
                    <span style="font-weight:500; color:#1f2937;">${contact.contact_name || 'Unnamed Contact'}</span>
                </td>
                <td style="padding:12px; color:#4b5563;">${contact.contact_role || contact.role || 'General Staff'}</td>
                <td style="padding:12px; color:#4b5563;">${contact.contact_phone || contact.phone || 'N/A'}</td>
                <td style="padding:12px; color:#4b5563;">${contact.contact_email || contact.email || 'N/A'}</td>
            </tr>
        `;
    }).join('');

    const rows = gridBody.querySelectorAll('.contact-row');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const id = row.getAttribute('data-id');
            const target = localContactsList.find(c => String(c.id) === String(id));
            if (target) showContactProfile(target);
        });
    });
}

function showContactProfile(contact) {
    activeSelectedContact = contact;
    const placeholder = document.getElementById('contactPanelPlaceholder');
    const realPanel = document.getElementById('contactDetailPanel');

    if (placeholder) placeholder.style.display = 'none';
    if (realPanel) realPanel.style.display = 'block';

    const detailAvatar = document.getElementById('detailAvatar');
    const detailName = document.getElementById('detailName');
    const detailRole = document.getElementById('detailRole');
    const detailPhone = document.getElementById('detailPhone');
    const detailEmail = document.getElementById('detailEmail');
    const detailNotes = document.getElementById('detailNotes');

    if (detailAvatar) {
        detailAvatar.src = contact.avatar_url || rowFallbackSvg;
        detailAvatar.onerror = () => { detailAvatar.src = rowFallbackSvg; };
    }
    if (detailName) detailName.textContent = contact.contact_name || 'Contact Profile';
    if (detailRole) detailRole.textContent = contact.contact_role || contact.role || 'General Staff';
    if (detailPhone) detailPhone.textContent = contact.contact_phone || contact.phone || 'N/A';
    if (detailEmail) detailEmail.textContent = contact.contact_email || contact.email || 'N/A';
    if (detailNotes) detailNotes.textContent = contact.operational_notes || contact.notes || 'No extended operational summaries submitted.';
}

function hideContactProfile() {
    activeSelectedContact = null;
    const placeholder = document.getElementById('contactPanelPlaceholder');
    const realPanel = document.getElementById('contactDetailPanel');
    if (placeholder) placeholder.style.display = 'block';
    if (realPanel) realPanel.style.display = 'none';
}

function setupMediaCaptureHooks() {
    const cameraTriggerBtn = document.getElementById('cameraTriggerBtn');
    const cameraFileInput = document.getElementById('cameraFileInput');
    const cameraStatusText = document.getElementById('cameraStatusText');
    const hiddenImageInput = document.getElementById('manualContactImageBase64');

    if (cameraTriggerBtn && cameraFileInput) {
        cameraTriggerBtn.onclick = () => {
            cameraFileInput.
