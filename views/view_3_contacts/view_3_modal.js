/* =================================================
FILE: views/view_3_contacts/view_3_modal.js
UPDATED: 2026-06-03 07:15:00 PM

STRICT HEADER RULE:/* =================================================
FILE: views/view_3_contacts/view_3_grid.js
UPDATED: 2026-06-05 03:15:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchContacts, insertContact } from './view_3_data.js'; // FIXED: Changed insertFacilityContact to insertContact
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
                    File: views/view_3_contacts/view_3_grid.js<br>Updated: 2026-06-05 03:15:00 PM
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

    // Overwrite the normal save behavior to catch workflows coming from an active issue report
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

        // FIXED: Using valid exported schema adapter function
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
            
            // Loop back straight to original issue request form if flagged
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
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { insertContact, updateContact } from './view_3_data.js';
import { supabase } from '../../js/supabaseClient.js';

export function setupContactsEvents(facility, refreshCallback) {
    const modal = document.getElementById('manualContactModal');
    const triggerBtn = document.getElementById('manualContactTriggerBtn');
    const closeBtn = document.getElementById('manualContactCloseBtn');
    const saveBtn = document.getElementById('manualContactSaveBtn');
    const backBtn = document.getElementById('backBtn');

    // Camera Upload Elements
    const fileInput = document.getElementById('manualContactFile');
    const triggerCameraBtn = document.getElementById('triggerCameraBtn');
    const statusText = document.getElementById('uploadStatusText');
    const hiddenImageInput = document.getElementById('manualContactImage');

    if (triggerCameraBtn && fileInput) {
        triggerCameraBtn.onclick = (e) => {
            e.preventDefault();
            fileInput.click();
        };

        fileInput.onchange = async () => {
            const file = fileInput.files[0];
            if (!file) return;

            if (statusText) statusText.innerText = "⏳ Saving ...";

            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('facility-assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('facility-assets')
                    .getPublicUrl(filePath);

                if (hiddenImageInput) hiddenImageInput.value = publicUrlData.publicUrl;
                if (statusText) statusText.innerText = "✅ Captured image ready";

            } catch (err) {
                console.error("Camera storage upload failed:", err);
                if (statusText) statusText.innerText = "❌ Upload failed";
            }
        };
    }

    if (triggerBtn) {
        triggerBtn.onclick = () => {
            clearFormFields();
            document.getElementById('modalTemplateTitle').innerText = "Create Directory Entry";
            document.getElementById('editingContactId').value = "";
            modal.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                // If returning from an issue redirection context trail path, send user back cleanly
                if (facility?.returnToView === 'view_5_issues') {
                    window.navigateTo('view_5_issues', { 
                        facility: { id: facility.id },
                        autoOpenPrefill: facility.cachedIssueForm
                    });
                    return;
                }
                window.navigateTo('view_2_controls', facility);
            }
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const name = document.getElementById('manualContactName').value.trim();
            const role = document.getElementById('manualContactRole').value.trim();
            const phone = document.getElementById('manualContactPhone').value.trim();
            const email = document.getElementById('manualContactEmail').value.trim();
            const notes = document.getElementById('manualContactNotes').value.trim();
            const imageUrl = document.getElementById('manualContactImage').value.trim();
            const editingId = document.getElementById('editingContactId').value;

            if (!name) {
                alert("Please provide at least a name row label value.");
                return;
            }

            const payload = {
                facility_id: Number(facility.id),
                name,
                role: role || 'Staff',
                phone: phone || 'N/A',
                email: email || '',
                image_url: imageUrl || ''
            };

            if ('notes' in payload || notes) {
                payload.notes = notes;
            }

            let success = false;
            if (editingId) {
                const res = await updateContact(editingId, payload);
                if (res) success = true;
            } else {
                const res = await insertContact(payload);
                if (res) success = true;
            }

            if (success) {
                modal.style.display = 'none';
                
                // ROUTING WORKFLOW INTERCEPTOR: Back to original unsubmitted issue tracker draft safely
                if (facility?.returnToView === 'view_5_issues') {
                    if (window.navigateTo) {
                        window.navigateTo('view_5_issues', {
                            facility: { id: facility.id },
                            autoOpenPrefill: {
                                ...facility.cachedIssueForm,
                                initiated_by: name // Use newly populated matching identity context row value
                            }
                        });
                    }
                    return;
                }

                if (refreshCallback) refreshCallback(facility);
            } else {
                alert("Could not process directory database action request row values.");
            }
        };
    }

    // AUTOMATED REDIRECTION INTENT CHECKER: Check if triggered by an unlisted reporter setup trace request
    if (facility?.prefillContactName) {
        clearFormFields();
        document.getElementById('modalTemplateTitle').innerText = "Complete Contact Directory Entry";
        document.getElementById('editingContactId').value = "";
        
        document.getElementById('manualContactName').value = facility.prefillContactName;
        document.getElementById('manualContactRole').value = "Staff";
        
        if (statusText) statusText.innerText = "Awaiting detail input updates...";
        modal.style.display = 'flex';
        
        // Wipe variables to prevent popups on refresh cycles
        delete facility.prefillContactName;
    }
}

export function openEditContactModal(contact) {
    const modal = document.getElementById('manualContactModal');
    if (!modal) return;

    document.getElementById('modalTemplateTitle').innerText = "Modify Contact Details";
    document.getElementById('editingContactId').value = contact.id;

    document.getElementById('manualContactName').value = contact.name || '';
    document.getElementById('manualContactRole').value = contact.role || '';
    document.getElementById('manualContactPhone').value = contact.phone || '';
    document.getElementById('manualContactEmail').value = contact.email || '';
    document.getElementById('manualContactNotes').value = contact.notes || '';
    document.getElementById('manualContactImage').value = contact.image_url || '';

    const statusText = document.getElementById('uploadStatusText');
    if (statusText) {
        statusText.innerText = contact.image_url ? "✅ Has avatar photo attached" : "No image captured";
    }

    modal.style.display = 'flex';
}

export function openContactIssuesModal(contactIssues, targetFacilityId, contactName = "") {
    let checkModal = document.getElementById('contactIssuesListModal');
    
    if (!checkModal) {
        checkModal = document.createElement('div');
        checkModal.id = 'contactIssuesListModal';
        checkModal.className = 'modal-mask';
        document.body.appendChild(checkModal);
    }

    const modalTitle = contactName ? `${contactName}'s Historic Issues Log` : "Cross-Referenced Issues Log";
    const issuesArray = contactIssues || [];

    checkModal.innerHTML = `
        <div class="modal-shell" style="max-width: 450px;">
            <h3 class="modal-shell-title">${modalTitle}</h3>
            <div class="contact-issues-scrollbar-tray" style="max-height: 250px; margin-bottom: 20px; overflow-y: auto;">
                ${issuesArray.length === 0 ? `
                    <p style="text-align:center; padding:10px; color:#6b7280; font-style:italic;">No logged issues attached to this contact.</p>
                ` : issuesArray.map((issue, idx) => {
                    const statusClass = String(issue.status).toLowerCase() === 'resolved' ? 'tag-resolved' : 'tag-active';
                    const displayTitle = issue.title || `Issue #${issue.issue_id || idx}`;
                    return `
                        <button class="history-issue-nav-btn" id="modalHistoryIssueClickBtn_${idx}" style="margin-bottom: 4px; width: 100%; text-align: left; display: flex; justify-content: space-between; align-items: center;">
                            <span>⚠️ ${displayTitle}</span>
                            <span class="status-indicator-tag ${statusClass}">${issue.status || 'OPEN'}</span>
                        </button>
                    `;
                }).join('')}
            </div>
            <button id="closeIssuesModalBtn" class="contacts-view-btn btn-gray" style="width: 100%;">Close Log Window</button>
        </div>
    `;

    checkModal.style.display = 'flex';

    issuesArray.forEach((issue, idx) => {
        const btn = document.getElementById(`modalHistoryIssueClickBtn_${idx}`);
        if (btn) {
            btn.onclick = () => {
                checkModal.style.display = 'none';
                if (window.navigateTo) {
                    window.navigateTo('view_5_issues', {
                        facility: { id: targetFacilityId },
                        autoOpenIssue: issue.issue_id,
                        filterContactName: contactName
                    });
                }
            };
        }
    });

    document.getElementById('closeIssuesModalBtn').onclick = () => {
        checkModal.style.display = 'none';
    };
}

window.openContactIssuesModal = openContactIssuesModal;

function clearFormFields() {
    const nameEl = document.getElementById('manualContactName');
    if (nameEl) nameEl.value = '';

    const roleEl = document.getElementById('manualContactRole');
    if (roleEl) roleEl.value = '';

    const phoneEl = document.getElementById('manualContactPhone');
    if (phoneEl) phoneEl.value = '';

    const emailEl = document.getElementById('manualContactEmail');
    if (emailEl) emailEl.value = '';

    const notesEl = document.getElementById('manualContactNotes');
    if (notesEl) notesEl.value = '';

    const imgEl = document.getElementById('manualContactImage');
    if (imgEl) imgEl.value = '';
    
    const statusText = document.getElementById('uploadStatusText');
    if (statusText) statusText.innerText = "No image captured";
    
    const fileInput = document.getElementById('manualContactFile');
    if (fileInput) fileInput.value = '';
}
