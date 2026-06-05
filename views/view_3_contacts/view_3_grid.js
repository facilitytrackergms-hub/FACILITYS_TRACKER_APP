/* =================================================
FILE: views/view_3_contacts/view_3_grid.js
UPDATED: 2026-06-05 03:52:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchContacts } from './view_3_data.js';
import { setupContactsEvents, openEditContactModal } from './view_3_modal.js';
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
            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; }
            .modal-shell-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; margin-bottom:15px; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .camera-action-row { display:flex; align-items:center; gap:12px; margin-top:6px; }
            .camera-status-text { font-size:13px; font-weight:500; color:#4b5563; }
            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-bottom:15px; text-align:center; padding:4px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="contacts-view-container" id="mainContactsContainer">
            <div class="contacts-card-wrapper">
                <h1 class="contacts-view-title">Facility Directory</h1>
                <p class="contacts-view-subtitle">${facility?.name || ''}</p>

                <div class="view-build-stamp">
                    File: views/view_3_contacts/view_3_grid.js<br>Updated: 2026-06-05 03:52:00 PM
                </div>

                <div id="directorySelectionLayout">
                    <button id="manualContactTriggerBtn" class="contacts-view-btn btn-emerald">➕ Add New Contact</button>
                    <div id="contactsGridElement" class="contacts-grid-layout">Loading...</div>
                    <button id="backBtn" class="contacts-view-btn btn-navy">⬅️ Back to Controls</button>
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

                    <label class="form-field-label">Contact Photo Upload</label>
                    <div class="camera-action-row">
                        <button id="triggerCameraBtn" class="contacts-view-btn btn-navy" style="width:auto; padding:8px 15px; font-size:12px;">Choose File / Camera</button>
                        <input type="file" id="manualContactFile" style="display:none;" accept="image/*">
                        <span id="uploadStatusText" class="camera-status-text">No image captured</span>
                    </div>

                    <label class="form-field-label">Contact Notes</label>
                    <textarea id="manualContactNotes" class="form-field-input" style="height:60px; resize:none;"></textarea>

                    <div class="form-action-group" style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="manualContactSaveBtn" class="contacts-view-btn btn-navy">Save Details</button>
                        <button id="manualContactCloseBtn" class="contacts-view-btn btn-gray">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupContactsEvents(facility, renderFacilityContacts);

    let rawIssues = [];
    try { if (facility?.id) rawIssues = await fetchFacilityIssues(facility.id); } catch(e) {}

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
                    openEditContactModal(c);
                }
            };

            grid.appendChild(block);
        });
    }

    await loadContactsGridData();
}
