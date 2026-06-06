/* =================================================
FILE: views/view_3_contacts/view_3_modal.js
UPDATED: 2026-06-05 09:12:00 PM

STRICT HEADER RULE:
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
            const imageUrl = document.getElementById('manualContactImage') ? document.getElementById('manualContactImage').value.trim() : '';
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

    if (document.getElementById('manualContactName')) document.getElementById('manualContactName').value = contact.name || '';
    if (document.getElementById('manualContactRole')) document.getElementById('manualContactRole').value = contact.role || '';
    if (document.getElementById('manualContactPhone')) document.getElementById('manualContactPhone').value = contact.phone || '';
    if (document.getElementById('manualContactEmail')) document.getElementById('manualContactEmail').value = contact.email || '';
    if (document.getElementById('manualContactNotes')) document.getElementById('manualContactNotes').value = contact.notes || '';
    if (document.getElementById('manualContactImage')) document.getElementById('manualContactImage').value = contact.image_url || '';

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
