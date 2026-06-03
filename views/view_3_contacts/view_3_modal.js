/* =================================================
FILE: views/view_3_contacts/view_3_modal.js
UPDATED: 2026-06-03 06:50:00 AM

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

            if (statusText) statusText.innerText = "⏳ Saving Snap...";
            triggerCameraBtn.disabled = true;

            try {
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `contacts/${Date.now()}.${fileExt}`;
                
                const { data, error } = await supabase.storage
                    .from('facility-assets')
                    .upload(fileName, file);

                if (error) throw error;

                const { data: urlData } = supabase.storage
                    .from('facility-assets')
                    .getPublicUrl(fileName);

                if (hiddenImageInput) hiddenImageInput.value = urlData.publicUrl;
                if (statusText) statusText.innerText = "✅ Picture Attached!";
            } catch (err) {
                console.error("Camera Upload Error:", err);
                if (statusText) statusText.innerText = "❌ Capture Failed";
                alert("Could not process and save camera image.");
            } finally {
                triggerCameraBtn.disabled = false;
            }
        };
    }

    if (triggerBtn) {
        triggerBtn.onclick = () => {
            document.getElementById('editingContactId').value = '';
            document.getElementById('modalTemplateTitle').innerText = 'Create Directory Entry';
            clearFormFields();
            modal.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; };
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_2_controls', { facility: facility });
            }
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const payload = {
                name: document.getElementById('manualContactName').value.trim(),
                role: document.getElementById('manualContactRole').value.trim(),
                phone: document.getElementById('manualContactPhone').value.trim(),
                email: document.getElementById('manualContactEmail').value.trim(),
                image_url: document.getElementById('manualContactImage').value.trim(),
                facility_id: facility.id
            };

            if (!payload.name) {
                alert("Please provide a name entry.");
                return;
            }

            const editingId = document.getElementById('editingContactId').value;
            let result = null;

            if (editingId) {
                result = await updateContact(editingId, payload);
            } else {
                result = await insertContact(payload);
            }

            if (result) {
                modal.style.display = 'none';
                clearFormFields();
                refreshCallback(facility);
            } else {
                alert("Could not update directory metadata entry row.");
            }
        };
    }
}

export function openEditContactModal(contact) {
    document.getElementById('editingContactId').value = contact.id;
    document.getElementById('modalTemplateTitle').innerText = 'Modify Directory Entry';
    
    document.getElementById('manualContactName').value = contact.name || '';
    document.getElementById('manualContactRole').value = contact.role || '';
    document.getElementById('manualContactPhone').value = contact.phone === 'N/A' ? '' : contact.phone;
    document.getElementById('manualContactEmail').value = contact.email || '';
    
    document.getElementById('manualContactNotes').value = contact.notes || '';
    const currentImgUrl = contact.image_url || contact.avatar_url || '';
    document.getElementById('manualContactImage').value = currentImgUrl;
    
    const statusText = document.getElementById('uploadStatusText');
    if (statusText) {
        statusText.innerText = currentImgUrl ? "✅ Has Profile Image" : "No image captured";
    }
    
    document.getElementById('manualContactModal').style.display = 'flex';
}

export async function openContactIssuesModal(contact) {
    let modal = document.getElementById('contactIssuesModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contactIssuesModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.6)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '10000';
        document.body.appendChild(modal);
    }

    modal.style.display = 'flex';

    const targetFacilityId = contact.facility_id || (window.currentFacility ? window.currentFacility.id : null);

    const { data: linkedConnections } = await supabase
        .from('contact_issues')
        .select(`
            issue_id,
            facility_issues!contact_issues_issue_id_fkey (
                id,
                title,
                description,
                status,
                priority,
                created_at,
                initiated_by
            )
        `)
        .eq('contact_id', Number(contact.id));

    let allIssues = [];
    if (targetFacilityId) {
        const { data } = await supabase
            .from('facility_issues')
            .select('*')
            .eq('facility_id', Number(targetFacilityId));
        allIssues = data || [];
    }

    modal.innerHTML = `
        <div style="background:white; padding:22px; border-radius:14px; width:90%; max-width:440px; box-shadow:0 10px 25px rgba(0,0,0,0.2); font-family:Arial, sans-serif;">
            <h3 style="margin-top:0; margin-bottom:5px; color:#00264d; font-size:18px;">Issues Involving:</h3>
            <div style="font-weight:bold; color:#64748b; margin-bottom:15px; font-size:15px;">${contact.name}</div>
            
            <label style="font-size:12px; font-weight:bold; color:#4b5563; display:block; margin-bottom:6px;">Current Linked System Issues:</label>
            <div id="currentIssuesList" style="max-height:240px; overflow-y:auto; margin-bottom:20px; border:1px solid #e5e7eb; padding:10px; border-radius:8px; background:#f9fafb;">
                ${linkedConnections && linkedConnections.length > 0 ? 
                    linkedConnections.map(c => {
                        const issue = c.facility_issues;
                        if (!issue) return '';
                        
                        const statusStr = (issue.status || 'Open').toLowerCase();
                        let badgeStyle = 'background:#fef3c7; color:#d97706;';
                        if (statusStr === 'closed') badgeStyle = 'background:#d1fae5; color:#059669;';
                        if (statusStr === 'pending') badgeStyle = 'background:#e0f2fe; color:#0284c7;';

                        return `
                            <div class="issue-history-item-card" data-issue-id="${issue.id}" style="background:white; padding:12px; border-radius:8px; border:1px solid #e5e7eb; margin-bottom:10px; position:relative; cursor:pointer; text-align:left;">
                                <div style="font-weight:bold; color:#00264d; font-size:14px; padding-right:65px; line-height:1.3;">
                                    ${issue.description || issue.title || 'No Description Logged'}
                                </div>
                                <div style="font-size:11px; color:#6b7280; margin-top:6px;">
                                    Priority: <span style="font-weight:600; color:#111827;">${issue.priority || 'Medium'}</span> 
                                    <span style="margin:0 4px;">|</span> 
                                    By: ${issue.initiated_by || 'Staff'}
                                </div>
                                <div style="font-size:10px; color:#9ca3af; margin-top:2px;">
                                    Reported: ${issue.created_at ? new Date(issue.created_at).toLocaleDateString() : '6/3/2026'}
                                </div>
                                <span style="position:absolute; top:12px; right:12px; font-size:10px; padding:2px 8px; border-radius:12px; font-weight:bold; text-transform:uppercase; ${badgeStyle}">
                                    ${issue.status || 'Open'}
                                </span>
                                <div style="margin-top:8px; border-top:1px dashed #e5e7eb; padding-top:6px; text-align:right;">
                                    <button class="unlink-issue-btn" data-issue-id="${issue.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold; font-size:11px; padding:0;">❌ Remove Link</button>
                                </div>
                            </div>
                        `;
                    }).join('') 
                    : '<span style="color:#9ca3af; font-size:12px; font-style:italic; display:block; padding:10px 0;">No active issues attached to this person.</span>'
                }
            </div>

            <label style="font-size:12px; font-weight:bold; color:#4b5563; display:block; margin-bottom:6px;">Attach to a Facility Issue:</label>
            <div style="display:flex; gap:8px; margin-bottom:20px;">
                <select id="issueSelectDropdown" style="flex:1; padding:10px; border-radius:8px; border:1px solid #d1d5db; font-size:13px; background:white;">
                    <option value="">-- Choose Active Issue --</option>
                    ${allIssues.map(i => {
                        const optionText = i.description || i.title || `Issue #${i.id}`;
                        return `<option value="${i.id}">${optionText}</option>`;
                    }).join('')}
                </select>
                <button id="submitLinkBtn" style="background:#0056b3; color:white; border:none; padding:10px 16px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:13px;">Link</button>
            </div>

            <button id="closeIssuesModalBtn" style="width:100%; padding:12px; background:#6b7280; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px;">
                DONE / CLOSE
            </button>
        </div>
    `;

    document.getElementById('submitLinkBtn').onclick = async () => {
        const selectedIssueId = document.getElementById('issueSelectDropdown').value;
        if (!selectedIssueId) {
            alert('Please select an active facility issue from the list.');
            return;
        }

        const { error } = await supabase
            .from('contact_issues')
            .insert([{ contact_id: Number(contact.id), issue_id: Number(selectedIssueId) }]);

        if (error) {
            alert('This issue connection is already registered to this profile.');
        } else {
            openContactIssuesModal(contact);
        }
    };

    const unlinkButtons = modal.querySelectorAll('.unlink-issue-btn');
    unlinkButtons.forEach(btn => {
        btn.onclick = async (e) => {
            e.stopPropagation();
            const issueId = btn.getAttribute('data-issue-id');
            const { error } = await supabase
                .from('contact_issues')
                .delete()
                .eq('contact_id', Number(contact.id))
                .eq('issue_id', Number(issueId));

            if (!error) {
                openContactIssuesModal(contact);
            } else {
                alert('Could not remove link entry.');
            }
        };
    });

    const historyCards = modal.querySelectorAll('.issue-history-item-card');
    historyCards.forEach(card => {
        card.onclick = (e) => {
            if (e.target.classList.contains('unlink-issue-btn')) return;
            const issueId = card.getAttribute('data-issue-id');
            modal.style.display = 'none';
            if (window.navigateTo) {
                window.navigateTo('view_5_issues', {
                    facility: { id: targetFacilityId },
                    autoOpenIssue: issueId
                });
            }
        };
    });

    document.getElementById('closeIssuesModalBtn').onclick = () => {
        modal.style.display = 'none';
    };
}

window.openContactIssuesModal = openContactIssuesModal;

function clearFormFields() {
    document.getElementById('manualContactName').value = '';
    document.getElementById('manualContactRole').value = '';
    document.getElementById('manualContactPhone').value = '';
    document.getElementById('manualContactEmail').value = '';
    document.getElementById('manualContactNotes').value = '';
    document.getElementById('manualContactImage').value = '';
    
    const statusText = document.getElementById('uploadStatusText');
    if (statusText) statusText.innerText = "No image captured";
    
    const fileInput = document.getElementById('manualContactFile');
    if (fileInput) fileInput.value = '';
}

/* =================================================
VERSION TRACKING BLOCK
====================================================
MODULE: view_3_contacts
FILE_TYPE: modal_view
TARGET_RELATION: view_5_issues_grid
==================================================== */
