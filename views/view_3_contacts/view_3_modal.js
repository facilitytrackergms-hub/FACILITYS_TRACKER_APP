/* =================================================
FILE: views/view_3_contacts/view_3_modal.js
UPDATED: 2026-06-03 05:15:00 AM

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
            fileInput.click(); // Instantly pops open the live mobile camera viewfinder
        };

        fileInput.onchange = async () => {
            const file = fileInput.files[0];
            if (!file) return;

            if (statusText) statusText.innerText = "⏳ Saving Snap...";
            triggerCameraBtn.disabled = true;

            try {
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `contacts/${Date.now()}.${fileExt}`;
                
                // Point directly to your active unified storage bucket
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
                notes: document.getElementById('manualContactNotes').value.trim(),
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
    document.getElementById('manualContactNotes').value = contact.notes === 'No notes added.' ? '' : contact.notes;
    document.getElementById('manualContactImage').value = contact.image_url || '';
    
    const statusText = document.getElementById('uploadStatusText');
    if (statusText) {
        statusText.innerText = contact.image_url ? "✅ Has Profile Image" : "No image captured";
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

    // Fetch relational items matching your numeric bigint columns securely
    const { data: linkedConnections } = await supabase
        .from('contact_issues')
        .select(`
            issue_id,
            facility_issues!contact_issues_issue_id_fkey (
                id,
                title,
                description
            )
        `)
        .eq('contact_id', Number(contact.id));

    const { data: allIssues } = await supabase
        .from('facility_issues')
        .select('*')
        .eq('facility_id', contact.facility_id);

    modal.innerHTML = `
        <div style="background:white; padding:22px; border-radius:14px; width:90%; max-width:440px; box-shadow:0 10px 25px rgba(0,0,0,0.2); font-family:Arial, sans-serif;">
            <h3 style="margin-top:0; margin-bottom:5px; color:#00264d; font-size:18px;">Issues Involving:</h3>
            <div style="font-weight:bold; color:#64748b; margin-bottom:15px; font-size:15px;">${contact.name}</div>
            
            <label style="font-size:12px; font-weight:bold; color:#4b5563; display:block; margin-bottom:6px;">Current Linked System Issues:</label>
            <div id="currentIssuesList" style="max-height:160px; overflow-y:auto; margin-bottom:20px; border:1px solid #e5e7eb; padding:10px; border-radius:8px; background:#f9fafb;">
                ${linkedConnections && linkedConnections.length > 0 ? 
                    linkedConnections.map(c => {
                        const issue = c.facility_issues;
                        if (!issue) return '';
                        return `
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid #e5e7eb; font-size:13px; color:#1f2937;">
                                <span style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:280px;">⚠️ ${issue.title || issue.description || 'Unnamed Issue'}</span>
                                <button class="unlink-issue-btn" data-issue-id="${issue.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold; font-size:12px;">Remove</button>
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
                    ${allIssues ? allIssues.map(i => `<option value="${i.id}">${i.title || i.description || ('ID: ' + i.id)}</option>`).join('') : ''}
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
        if (!selectedIssueId) return alert('Please select an active facility issue from the list.');

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
            const issueId = e.target.getAttribute('data-issue-id');
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

    document.getElementById('closeIssuesModalBtn').onclick = () => {
        modal.style.display = 'none';
    };
}

// Make globally accessible for instances when decoupled event tracking occurs
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
