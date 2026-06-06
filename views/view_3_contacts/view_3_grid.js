/* =================================================
FILE: views/view_3_contacts/view_3_grid.js
UPDATED: 2026-06-05 09:18:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchContacts, insertContact } from './view_3_data.js';
import { setupContactsEvents } from './view_3_modal.js';
import { fetchFacilityIssues } from '../view_5_issues/view_5_data.js';

export async function renderFacilityContacts(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    // Track active workflow session configurations
    const returnToView = data?.returnToView || null;
    const cachedIssueForm = data?.cachedIssueForm || null;

    const styles = `
        <style>
            .contacts-view-container { padding:20px; font-family:Arial; min-height:100vh; background:#f3f4f6; text-align:center; box-sizing:border-box; }
            .contacts-card-wrapper { max-width:500px; margin:0 auto; background:white; border-radius:12px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05); }
            .contacts-view-title { color:#00264d; font-size:24px; font-weight:bold; margin-bottom:5px; text-transform:uppercase; }
            .contacts-view-subtitle { color:#6b7280; font-size:14px; margin-bottom:20px; }
            .contacts-view-detail-box { text-align:left; background:#f9fafb; padding:20px; border-radius:8px; border:1px solid #e5e7eb; margin-bottom:0px; position:relative; }
            .contacts-view-btn { width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px; text-transform:uppercase; box-sizing:border-box; }
            .btn-navy { background:#00264d; color:white; }
            .btn-emerald { background:#10b981; color:white; margin-bottom:12px; }
            .btn-gray { background:#9ca3af; color:white; }
            .contacts-grid-layout { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:12px; margin:20px 0; text-align:left; }
            .contact-thumbnail { background:white; border:1px solid #e5e7eb; padding:12px; border-radius:8px; cursor:pointer; text-align:center; transition:transform 0.15s ease; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; }
            .contact-thumbnail:hover { transform:translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .thumbnail-name { font-weight:bold; color:#00264d; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; margin-top:5px; }
            .thumbnail-role { font-size:12px; color:#6b7280; margin-top:2px; }
            
            /* Clean Full Profile Dedicated Screen View Panel Styles */
            .detail-view-card { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:20px; text-align:left; display:none; }
            .detail-row { margin-bottom:14px; font-size:15px; color:#4b5563; }
            .detail-label { font-weight:bold; color:#00264d; font-size:12px; text-transform:uppercase; display:block; margin-bottom:2px; }
            .detail-link { color:#10b981; text-decoration:none; font-weight:600; font-size:16px; }
            .detail-link:hover { text-decoration:underline; }

            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; }
            .modal-shell-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; margin-bottom:15px; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-bottom:15px; text-align:center; padding:4px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="contacts-view-container" id="mainContactsContainer">
            <div class="contacts-card-wrapper">
                
                <h1 class="contacts-view-title" id="viewHeaderTitle">Facility Directory</h1>
                <p class="contacts-view-subtitle" id="viewHeaderSubtitle">${facility?.name || ''}</p>

                <div class="view-build-stamp" id="viewBuildStampInfo">
                    File: views/view_3_contacts/view_3_grid.js<br>Updated: 2026-06-05 09:18:00 PM
                </div>

                <div id="directorySelectionLayout">
                    <button id="manualContactTriggerBtn" class="contacts-view-btn btn-emerald">➕ Add New Contact</button>
                    <div id="contactsGridElement" class="contacts-grid-layout">Loading...</div>
                    <button id="backBtn" class="contacts-view-btn btn-navy">⬅️ Back to Controls</button>
                </div>
                
                <div id="contactDetailPane" class="detail-view-card">
                    <div style="display:flex; justify-content:center; margin-bottom:15px;">
                        <img id="detailAvatar" src="" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid #e5e7eb;" />
                    </div>
                    <h3 id="detailName" style="margin:0 0 15px 0; text-align:center; color:#00264d; font-size:20px;">Contact Profile</h3>
                    
                    <div class="detail-row"><span class="detail-label">Role / Job Title</span><span id="detailRole"></span></div>
                    <div class="detail-row"><span class="detail-label">Direct Phone Line</span><a id="detailPhoneLink" class="detail-link" href=""></a></div>
                    <div class="detail-row"><span class="detail-label">Email Address</span><a id="detailEmailLink" class="detail-link" href=""></a></div>
                    <div class="detail-row"><span class="detail-label">Internal Operations Notes</span><span id="detailNotes"></span></div>
                    
                    <button id="closeDetailPaneBtn" class="contacts-view-btn btn-navy" style="margin-top:15px;">⬅️ Return to Directory</button>
                </div>
            </div>

            <div id="manualContactModal" class="modal-mask">
                <div class="modal-shell">
                    <h3 class="modal-shell-title" id="modalTemplateTitle">Create Directory Entry</h3>
                    <input type="hidden" id="editingContactId" value="">
                    <input type="hidden" id="manualContactImage" value="">
                    
                    <label class="form-field-label">Full Name</label>
                    <input type="text" id="manualContactName" class="form-field-input">

                    <label class="form-field-label">Job Title / Role</label>
                    <input type="text" id="manualContactRole" class="form-field-input">

                    <label class="form-field-label">Phone Number</label>
                    <input type="text" id="manualContactPhone" class="form-field-input">

                    <label class="form-field-label">Email Address</label>
                    <input type="email" id="manualContactEmail" class="form-field-input">

                    <label class="form-field-label">Contact Notes</label>
                    <textarea id="manualContactNotes" class="form-field-input" style="height:60px; resize:none;"></textarea>

                    <div class="form-action-group" style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="customSaveContactBtn" class="contacts-view-btn btn-navy">Save Details</button>
                        <button id="manualContactCloseBtn" class="contacts-view-btn btn-gray">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupContactsEvents(facility, renderFacilityContacts);

    let rawIssues = [];
    try { if (facility?.id) rawIssues = await fetchFacilityIssues(facility.id); } catch(e) {}

    document.getElementById('customSaveContactBtn').onclick = async () => {
        const name = document.getElementById('manualContactName').value.trim();
        const role = document.getElementById('manualContactRole').value.trim() || 'Staff';
        const phone = document.getElementById('manualContactPhone').value.trim();
        const email = document.getElementById('manualContactEmail').value.trim();
        const notes = document.getElementById('manualContactNotes').value.trim();

        if (!name) {
            alert("Contact name is required.");
            return;
        }

        const newContact = await insertContact({
            facility_id: facility.id,
            name: name,
            role: role,
            phone: phone,
            email: email,
            notes: notes
        });

        if (newContact) {
            document.getElementById('manualContactModal').style.display = 'none';
            if (returnToView === 'view_5_issues' && window.navigateTo) {
                window.navigateTo('view_5_issues', {
                    facility: facility,
                    openFormInstantly: true,
                    selectedContact: { id: newContact.id, name: newContact.name },
                    cachedIssueForm: cachedIssueForm
                });
            } else {
                await loadContactsGridData();
            }
        } else {
            alert("Could not save new contact directory entries.");
        }
    };

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_2_controls', { facility: facility });
    };

    // View state switcher logic to return to grid list screen
    document.getElementById('closeDetailPaneBtn').onclick = () => {
        document.getElementById('contactDetailPane').style.display = 'none';
        document.getElementById('directorySelectionLayout').style.display = 'block';
        document.getElementById('viewBuildStampInfo').style.display = 'block';
        document.getElementById('viewHeaderTitle').innerText = "Facility Directory";
    };

    if (data?.openFormInstantly) {
        document.getElementById('manualContactModal').style.display = 'flex';
    }

    async function loadContactsGridData() {
        if (!facility?.id) return;
        const grid = document.getElementById('contactsGridElement');
        if (!grid) return;
        
        const contacts = await fetchContacts(facility.id);
        grid.innerHTML = '';

        if (!contacts || contacts.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#9ca3af; font-size:13px; padding:10px;">No contacts found.</div>';
            return;
        }

        contacts.forEach(c => {
            const block = document.createElement('div');
            block.className = 'contact-thumbnail';
            const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || 'Staff')}&background=00264d&color=fff`;
            
            block.innerHTML = `
                <img src="${c.image_url || fallbackAvatar}" style="width:45px; height:45px; border-radius:50%; object-fit:cover;" />
                <div class="thumbnail-name">${c.name}</div>
                <div class="thumbnail-role">${c.role || 'Staff'}</div>
            `;

            block.onclick = () => {
                if (returnToView === 'view_5_issues' && window.navigateTo) {
                    window.navigateTo('view_5_issues', {
                        facility: facility,
                        openFormInstantly: true,
                        selectedContact: { id: c.id, name: c.name },
                        cachedIssueForm: cachedIssueForm
                    });
                } else {
                    // Step 1: Hide current grid overview panels cleanly
                    document.getElementById('directorySelectionLayout').style.display = 'none';
                    document.getElementById('viewBuildStampInfo').style.display = 'none';
                    
                    // Step 2: Swap layout heading title text context safely
                    document.getElementById('viewHeaderTitle').innerText = "Contact Profile";

                    // Step 3: Populate deep variables into dedicated screen view form layouts
                    document.getElementById('detailAvatar').src = c.image_url || fallbackAvatar;
                    document.getElementById('detailName').innerText = c.name;
                    document.getElementById('detailRole').innerText = c.role || 'Staff';
                    
                    const pLink = document.getElementById('detailPhoneLink');
                    if (c.phone && c.phone !== 'N/A') {
                        pLink.innerText = c.phone;
                        pLink.href = `tel:${c.phone}`;
                        pLink.style.display = 'inline';
                    } else {
                        pLink.innerText = 'N/A';
                        pLink.removeAttribute('href');
                    }

                    const eLink = document.getElementById('detailEmailLink');
                    if (c.email) {
                        eLink.innerText = c.email;
                        eLink.href = `mailto:${c.email}`;
                        eLink.style.display = 'inline';
                    } else {
                        eLink.innerText = 'None';
                        eLink.removeAttribute('href');
                    }

                    document.getElementById('detailNotes').innerText = c.notes || 'No custom details left.';
                    
                    // Step 4: Render dedicated screen active panel state visible
                    document.getElementById('contactDetailPane').style.display = 'block';
                }
            };

            grid.appendChild(block);
        });
    }

    await loadContactsGridData();
}
