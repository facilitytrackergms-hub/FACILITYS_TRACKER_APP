/* =================================================
FILE: controls_v3_modal.js
UPDATED: 2026-05-30 05:40 AM
================================================= */
import { getContacts, getContactIssues, getContactImages, insertContact } from './controls_v3_data.js';

export async function loadContactsGridData(facility) {
    const contactsGrid = document.getElementById('contactsGrid');
    contactsGrid.innerHTML = '<div style="grid-column: 1/-1; padding:40px; color:#666;">Refreshing List...</div>';

    try {
        const { data: contacts } = await getContacts(facility.id);
        const { data: openIssues } = await getContactIssues(facility.id);
        const { data: allImages } = await getContactImages();

        const imageMap = {};
        if (allImages) {
            allImages.forEach(img => {
                if (!imageMap[img.related_id] || new Date(img.created_at) > new Date(imageMap[img.related_id].created_at)) {
                    imageMap[img.related_id] = img;
                }
            });
        }

        const issuesCountMap = {};
        if (openIssues) {
            openIssues.forEach(issue => {
                if (issue.initiated_by) {
                    const key = issue.initiated_by.toLowerCase().trim();
                    issuesCountMap[key] = (issuesCountMap[key] || 0) + 1;
                }
            });
        }

        contactsGrid.innerHTML = '';
        if (contacts && contacts.length > 0) {
            contacts.forEach(contact => {
                const btn = document.createElement('button');
                btn.style.cssText = "padding:16px; border-radius:12px; background:#f5c400; border:none; cursor:pointer; font-weight:bold; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; transition: transform 0.1s;";

                const nameDisplay = contact.Name || 'Unnamed';
                const roleDisplay = contact.Role || '';
                const pendingCount = issuesCountMap[nameDisplay.toLowerCase().trim()] || 0;
                const contactImg = imageMap[contact.id];

                const avatarHtml = contactImg && contactImg.image_url
                    ? `<img src="${contactImg.image_url}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.15);" alt="">`
                    : `<div style="width:50px; height:50px; border-radius:50%; background:#00264d; color:white; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:bold; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.15);">${nameDisplay.charAt(0).toUpperCase()}</div>`;

                btn.innerHTML = `
                    ${avatarHtml}
                    <div style="text-align:center; width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        <span style="color:#00264d; display:block;">${nameDisplay}</span>
                        <span style="font-size:12px; font-weight:normal; color:#1e293b; display:block;">${roleDisplay}</span>
                    </div>
                    ${pendingCount ? `<span style="position:absolute; top:6px; right:6px; background:#dc2626; color:white; font-size:10px; padding:2px 6px; border-radius:8px;">${pendingCount}</span>` : ''}
                `;
                btn.onclick = () => openContactDetail(contact, facility);
                contactsGrid.appendChild(btn);
            });
        } else {
            contactsGrid.innerHTML = `<div style="grid-column:1/-1; color:#94a3b8; font-style:italic; padding:40px; background:white; border-radius:12px;">No contacts found for this facility.</div>`;
        }
    } catch (err) {
        console.error("Error loading contacts:", err);
        contactsGrid.innerHTML = `<div style="grid-column:1/-1; color:red; padding:20px;">Failed to load contacts.</div>`;
    }
}

// Modal buttons for adding manual contacts and back navigation
export function setupContactModals(facility) {
    document.getElementById('addManualContactBtn').onclick = () => {
        document.getElementById('modalTitle').innerText = "New Contact Profile";
        ['manualContactName','manualContactRole','manualContactPhone','manualContactEmail','manualContactNotes'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('manualContactSaveBtn').innerText = "SAVE DETAILS";
        document.getElementById('manualContactModal').style.display = 'flex';
    };

    document.getElementById('manualContactSaveBtn').onclick = async () => {
        const name = document.getElementById('manualContactName').value;
        if (!name) return alert('Name is required');

        const contactData = {
            Name: name,
            Role: document.getElementById('manualContactRole').value,
            Phone: document.getElementById('manualContactPhone').value,
            Email: document.getElementById('manualContactEmail').value,
            Notes: document.getElementById('manualContactNotes').value,
            facility_id: facility.id
        };

        const { error } = await insertContact(contactData);
        if (error) {
            alert("Error saving contact: " + error.message);
        } else {
            document.getElementById('manualContactModal').style.display = 'none';
            await loadContactsGridData(facility);
        }
    };

    document.getElementById('manualContactCloseBtn').onclick = () => document.getElementById('manualContactModal').style.display = 'none';

    document.getElementById('backBtn').onclick = () => window.navigateTo('facilityControls', facility);
}
