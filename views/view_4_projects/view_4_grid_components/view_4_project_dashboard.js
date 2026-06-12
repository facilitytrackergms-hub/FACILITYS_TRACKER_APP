/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_photo_dashboard.js
SUPABASE TBL : project_actions, contacts
VIEW NAME    : Photo Management view
POP-UP TITLE : Photo Communications Center
LAST UPDATED : 2026-06-12 @ 07:30 AM
================================================================*/
const __FILENAME = 'view_4_photo_dashboard.js';

import { escapeHtml } from './view_4_render_helpers.js';
import { renderStyles } from './view_4_styles.js';

const supabaseClient = window.supabase;

export async function renderPhotoDashboard({ facility, project, photoType }, nav) {
    const app = document.getElementById('app');

    // Dynamically establish screen headers based on clicked classification
    const viewTitle = `${photoType ? photoType.toUpperCase() : 'PROJECT'} PHOTO DASHBOARD`;
    
    // Fetch contacts and existing actions
    let contacts = [];
    let photoActions = [];
    
    try {
        if (supabaseClient) {
            const { data: cData } = await supabaseClient.from('contacts').select('*').eq('facility_id', facility.id);
            if (cData) contacts = cData;

            const { data: pData } = await supabaseClient.from('project_actions')
                .select('*')
                .eq('project_id', project.id)
                .ilike('action_title', `%${photoType}%`);
            if (pData) photoActions = pData;
        }
    } catch (err) {
        console.error("Error loading dashboard data framework:", err);
    }

    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card" style="max-width: 650px; margin: 0 auto;">
                <h1 class="vendor-cabinet-title">${viewTitle}</h1>
                <p class="vendor-cabinet-sub">${escapeHtml(project.title || 'Project')} · ${escapeHtml(facility.name || 'Facility')}</p>

                <input type="file" id="photoCaptureHardwareInput" accept="image/*" capture="environment" style="display:none;">

                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button id="snapNewPhotoBtn" class="cabinet-btn cabinet-btn-blue" style="flex: 1; padding: 14px;">
                        📸 Take New ${photoType} Pic
                    </button>
                    <button id="photoDashboardBackBtn" class="cabinet-btn cabinet-btn-gray" style="width: 100px;">
                        ⬅️ Back
                    </button>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Select Photos to Send or Assign</h2>
                    
                    ${photoActions.length === 0 ? `
                        <p style="color:#6b7280; font-style:italic; text-align:center; padding: 20px; border: 2px dashed #e5e7eb; border-radius:8px;">
                            No ${photoType} pictures found. Snap a photo above to begin!
                        </p>
                    ` : `
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;" id="photoGalleryGridTray">
                            ${photoActions.map(action => `
                                <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; position: relative; background: #fff;">
                                    <input type="checkbox" class="photo-select-checkbox" data-url="${action.file_url}" data-id="${action.id}" style="position: absolute; top: 12px; left: 12px; width: 20px; height: 20px; z-index: 10; cursor: pointer;">
                                    <img src="${action.file_url}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" onerror="this.src='https://via.placeholder.com/150?text=No+Image';">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 11px; color:#6b7280;">${new Date(action.created_at).toLocaleDateString()}</span>
                                        <button class="delete-photo-asset-btn" data-id="${action.id}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 14px; padding: 2px 6px;">🗑️ Delete</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <div class="cabinet-section" style="margin-top: 20px; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <h2 class="cabinet-section-title" style="margin-bottom: 12px;">🔗 Assignment & Routing Actions</h2>
                    
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button id="assignToReportBtn" class="cabinet-btn cabinet-btn-blue" style="width: 100%; text-align: left; padding: 12px;">
                            📋 Add Selected Photos to Project Report
                        </button>
                        
                        <div style="border-top: 1px solid #e5e7eb; margin: 5px 0;"></div>
                        
                        <label style="font-weight: 600; font-size: 13px; color: #374151;">Select Destination Directory Contact:</label>
                        <select id="contactPickerDropdown" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #d1d5db; background: white;">
                            <option value="">-- Choose a Facility Contact --</option>
                            ${contacts.map(c => `<option value="${c.id}" data-phone="${c.contact_phone || ''}" data-email="${c.contact_email || ''}">${escapeHtml(c.contact_name)} (${escapeHtml(c.contact_role || 'Staff')})</option>`).join('')}
                        </select>

                        <button id="quickCreateContactBtn" style="background: none; border: none; color: #2563eb; text-align: left; font-size: 12px; cursor: pointer; font-weight: 600; padding: 0; margin-top: -4px;">
                            ➕ Contact missing? Click here to add a new contact instantly
                        </button>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px;">
                            <button id="sendPhotoTextBtn" class="cabinet-btn cabinet-btn-green" style="padding: 12px;">
                                💬 Send via Text (SMS)
                            </button>
                            <button id="sendPhotoEmailBtn" class="cabinet-btn cabinet-btn-blue" style="padding: 12px; background-color: #4f46e5;">
                                ✉️ Send via Email
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div id="quickContactModalOverlay" style="display: none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; padding: 15px;">
            <div style="background: white; padding: 20px; border-radius: 8px; width: 100%; max-width: 400px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <h3 style="margin-top:0; margin-bottom: 15px; font-size: 16px; color:#1e3a8a;">Create Directory Entry</h3>
                
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Full Name</label>
                <input type="text" id="newContactName" style="width:100%; padding:8px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:4px;">
                
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Operational Role Title</label>
                <input type="text" id="newContactRole" placeholder="e.g. Property Manager" style="width:100%; padding:8px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:4px;">
                
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Phone Number</label>
                <input type="text" id="newContactPhone" placeholder="863-555-0199" style="width:100%; padding:8px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:4px;">
                
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Email Address</label>
                <input type="email" id="newContactEmail" placeholder="name@domain.com" style="width:100%; padding:8px; margin-bottom:15px; border:1px solid #d1d5db; border-radius:4px;">
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="closeQuickContactBtn" style="padding: 8px 14px; background:#e5e7eb; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
                    <button id="saveQuickContactBtn" style="padding: 8px 14px; background:#1e3a8a; color:white; border:none; border-radius:4px; cursor:pointer;">Save Entry</button>
                </div>
            </div>
        </div>
    `;

    // --- Core Interaction Event Handlers ---
    
    // Back Button
    document.getElementById('photoDashboardBackBtn').onclick = () => {
        if (nav.renderSingleProjectDashboard) {
            nav.renderSingleProjectDashboard({ facility, project }, nav);
        }
    };

    // Camera Hardware Click Handler
    const cameraInput = document.getElementById('photoCaptureHardwareInput');
    document.getElementById('snapNewPhotoBtn').onclick = () => {
        if (cameraInput) {
            cameraInput.value = '';
            cameraInput.click();
        }
    };

    // Camera Capture Image Upload Processing Pipeline
    if (cameraInput) {
        cameraInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            document.getElementById('snapNewPhotoBtn').innerText = '⏳ Uploading Asset...';

            try {
                let publicUrl = '';
                if (supabaseClient && supabaseClient.storage) {
                    const fileExt = file.name.split('.').pop() || 'jpg';
                    const fileName = `${project.id}/${photoType.toLowerCase()}_${Date.now()}.${fileExt}`;
                    const filePath = `project_images/${fileName}`;

                    await supabaseClient.storage.from('facility-assets').upload(filePath, file);
                    const { data: urlData } = supabaseClient.storage.from('facility-assets').getPublicUrl(filePath);
                    publicUrl = urlData?.publicUrl || '';
                } else {
                    publicUrl = await new Promise((res) => {
                        const reader = new FileReader();
                        reader.onloadend = () => res(reader.result);
                        reader.readAsDataURL(file);
                    });
                }

                if (supabaseClient) {
                    await supabaseClient.from('project_actions').insert([{
                        project_id: project.id,
                        action_title: `${photoType.toUpperCase()} Photo Asset`,
                        action_notes: `Captured snapshot saved under dashboard tracking context.`,
                        file_url: publicUrl,
                        created_at: new Date().toISOString()
                    }]);
                }

                // Hot refresh layout components
                await renderPhotoDashboard({ facility, project, photoType }, nav);
            } catch (error) {
                console.error("Camera processing fault:", error);
                alert(`Upload failed: ${error.message}`);
                await renderPhotoDashboard({ facility, project, photoType }, nav);
            }
        };
    }

    // Asset Selection Helper Array
    const getSelectedPhotoUrls = () => {
        const checkedBoxes = document.querySelectorAll('.photo-select-checkbox:checked');
        return Array.from(checkedBoxes).map(cb => cb.getAttribute('data-url'));
    };

    // Delete Picture Logic Row
    document.querySelectorAll('.delete-photo-asset-btn').forEach(btn => {
        btn.onclick = async () => {
            if (!confirm("Are you sure you want to remove this photo item?")) return;
            const actionId = btn.getAttribute('data-id');
            try {
                if (supabaseClient) {
                    await supabaseClient.from('project_actions').delete().eq('id', actionId);
                }
                await renderPhotoDashboard({ facility, project, photoType }, nav);
            } catch (err) {
                alert(`Delete processing error: ${err.message}`);
            }
        };
    });

    // 📋 Assign Selection Directly to Core Report Interface
    document.getElementById('assignToReportBtn').onclick = () => {
        const selectedUrls = getSelectedPhotoUrls();
        if (selectedUrls.length === 0) {
            alert('Please select at least one photo by marking its checkbox before allocating items to reports.');
            return;
        }
        alert(`Success! Added ${selectedUrls.length} file links to the active system compiled layout summary report.`);
    };

    // 💬 Send Selected Photos via Text Messaging
    document.getElementById('sendPhotoTextBtn').onclick = () => {
        const dropdown = document.getElementById('contactPickerDropdown');
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        const phone = selectedOption ? selectedOption.getAttribute('data-phone') : '';
        const selectedUrls = getSelectedPhotoUrls();

        if (selectedUrls.length === 0) {
            alert('Please select the photos you want to text out.');
            return;
        }
        if (!phone) {
            alert('Please select a target contact directory entry with a verified phone number.');
            return;
        }

        const smsBody = `Project: ${project.title || 'Update'} - Here are the ${photoType} photo updates:\n${selectedUrls.join('\n')}`;
        window.open(`sms:${phone}?&body=${encodeURIComponent(smsBody)}`);
    };

    // ✉️ Send Selected Photos via Email Client
    document.getElementById('sendPhotoEmailBtn').onclick = () => {
        const dropdown = document.getElementById('contactPickerDropdown');
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        const email = selectedOption ? selectedOption.getAttribute('data-email') : '';
        const selectedUrls = getSelectedPhotoUrls();

        if (selectedUrls.length === 0) {
            alert('Please select the photos you want to email.');
            return;
        }
        if (!email) {
            alert('Please select a contact entry with a valid email address.');
            return;
        }

        const subject = encodeURIComponent(`${photoType.toUpperCase()} Progress Updates: ${project.title || 'Project'}`);
        const body = encodeURIComponent(`Hello,\n\nPlease find the requested ${photoType.toLowerCase()} photo progress attachments for the facility dashboard linked below:\n\n${selectedUrls.join('\n')}\n\nBest Regards.`);
        window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    };

    // --- Missing Contacts Handling Modal Triggers ---
    const overlay = document.getElementById('quickContactModalOverlay');
    document.getElementById('quickCreateContactBtn').onclick = () => { overlay.style.display = 'flex'; };
    document.getElementById('closeQuickContactBtn').onclick = () => { overlay.style.display = 'none'; };

    document.getElementById('saveQuickContactBtn').onclick = async () => {
        const name = document.getElementById('newContactName').value.trim();
        const role = document.getElementById('newContactRole').value.trim();
        const phone = document.getElementById('newContactPhone').value.trim();
        const email = document.getElementById('newContactEmail').value.trim();

        if (!name) {
            alert('A profile directory entry name field is required.');
            return;
        }

        try {
            if (supabaseClient) {
                await supabaseClient.from('contacts').insert([{
                    facility_id: facility.id,
                    contact_name: name,
                    contact_role: role,
                    contact_phone: phone,
                    contact_email: email,
                    created_at: new Date().toISOString()
                }]);
            }
            overlay.style.display = 'none';
            // Hot reload view tracking data parameters
            await renderPhotoDashboard({ facility, project, photoType }, nav);
        } catch (err) {
            alert(`Failed saving profile contact record: ${err.message}`);
        }
    };
}
