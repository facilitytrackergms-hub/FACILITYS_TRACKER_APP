/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_photo_dashboard.js
SUPABASE TBL : facility_images, contacts
VIEW NAME    : Reusable Project Photo Dashboard with Sharing Engine
POP-UP TITLE : Continuous Photo Capture System & Contact Share
LAST UPDATED : 2026-06-12 @ 05:45 PM
================================================================*/
const __FILENAME = 'view_4_photo_dashboard.js';

import { escapeHtml, escapeAttr, formatDate } from './view_4_render_helpers.js';
import { renderStyles } from './view_4_styles.js';
import { fetchContacts } from '../../view_3_contacts/view_3_data.js';

// FIXED IMPORT: Direct reference to the authentic database client module instance
import { supabase } from '../../../js/supabaseClient.js';

export async function renderPhotoDashboard({ facility, project, photoType }, nav) {
    const app = document.getElementById('app');
    if (!app) return;

    const currentType = photoType || 'Before'; 
    const facilityName = escapeHtml(facility?.name || facility?.Name || 'Facility');
    const projectTitle = escapeHtml(project?.title || project?.Name || 'Project');

    // 1. Fetch existing pictures matching this project and photo type phase
    let photos = [];
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('facility_images')
                .select('*')
                .eq('project_id', project.id)
                .eq('photo_type', currentType)
                .order('created_at', { ascending: false });

            if (!error && data) photos = data;
        }
    } catch (err) {
        console.error("Error fetching project photos:", err);
    }

    // 2. Fetch contacts for sharing actions
    const facilityContacts = await fetchContacts(facility.id);

    // 3. Render View Framework
    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">📸 ${currentType.toUpperCase()} PHOTOS</h1>
                <p class="vendor-cabinet-sub">${projectTitle} · ${facilityName}</p>

                <div class="cabinet-section" style="text-align: center; background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <input type="file" id="continuousCameraInput" accept="image/*" capture="environment" style="display: none;" />
                    
                    <button id="triggerCaptureBtn" class="cabinet-btn cabinet-btn-green" style="font-size: 16px; padding: 12px; width: 100%; max-width: 300px; margin: 0 auto; display: block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        📸 Take New Picture
                    </button>
                    <p style="font-size: 11px; color: #6b7280; margin-top: 6px; margin-bottom: 0;">
                        App automatically reopens your camera to take consecutive shots until you hit Finish.
                    </p>
                </div>

                <div class="cabinet-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h2 class="cabinet-section-title" style="margin: 0;">Captured Gallery (${photos.length})</h2>
                        ${photos.length > 0 ? `
                            <div style="display: flex; gap: 8px;">
                                <button id="bulkTextBtn" class="cabinet-btn" style="padding: 4px 8px; font-size: 11px; margin: 0;">💬 Text</button>
                                <button id="bulkEmailBtn" class="cabinet-btn cabinet-btn-blue" style="padding: 4px 8px; font-size: 11px; margin: 0;">✉️ Email Report</button>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${photos.length === 0 ? `
                        <div style="text-align: center; color: #9ca3af; padding: 40px 20px; border: 2px dashed #e5e7eb; border-radius: 6px;">
                            No ${currentType.toLowerCase()} photos uploaded yet.
                        </div>
                    ` : `
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            ${photos.map(p => `
                                <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                                    <input type="checkbox" class="photo-select-checkbox" data-url="${escapeAttr(p.file_url)}" style="position: absolute; top: 8px; left: 8px; width: 20px; height: 20px; z-index: 10; cursor: pointer;" checked />
                                    <img src="${escapeAttr(p.file_url)}" style="width:100%; height:120px; object-fit:cover; display:block;" alt="Capture">
                                    <div style="padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 10px; color: #4b5563;">${formatDate(p.created_at)}</span>
                                        <button class="delete-photo-btn" data-id="${escapeAttr(p.id)}" style="background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 0;">🗑️</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <div id="shareContactModal" class="cabinet-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                    <div class="cabinet-modal-body" style="background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; max-height: 80vh; overflow-y: auto;">
                        <h3 id="modalShareTitle" style="margin-top: 0;">Select Facility Contacts</h3>
                        <div id="contactsModalList" style="margin: 15px 0; max-height: 250px; overflow-y: auto;">
                            ${facilityContacts.length === 0 ? '<p style="color: #6b7280; font-size: 13px;">No directory contacts found for this facility.</p>' : 
                            facilityContacts.map(c => `
                                <label style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; cursor: pointer;">
                                    <input type="checkbox" class="contact-share-checkbox" data-phone="${escapeAttr(c.phone)}" data-email="${escapeAttr(c.email)}" data-name="${escapeAttr(c.contact_name)}" checked />
                                    <div>
                                        <div style="font-weight: 500; font-size: 13px;">${escapeHtml(c.contact_name)}</div>
                                        <div style="font-size: 11px; color: #6b7280;">${escapeHtml(c.phone || '')} ${c.email ? `· ${escapeHtml(c.email)}` : ''}</div>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button id="closeShareModalBtn" class="cabinet-btn cabinet-btn-gray" style="margin:0; padding: 8px 12px; font-size:12px;">Cancel</button>
                            <button id="confirmShareBtn" class="cabinet-btn cabinet-btn-green" style="margin:0; padding: 8px 12px; font-size:12px;">Send Report</button>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 25px;">
                    <button id="photoDashboardBackBtn" class="cabinet-btn cabinet-btn-gray" style="width: 100%;">
                        ⬅️ Finish & Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;

    // 4. Connect Core System Event Logic Hooks
    const cameraInput = document.getElementById('continuousCameraInput');
    const captureBtn = document.getElementById('triggerCaptureBtn');
    const backBtn = document.getElementById('photoDashboardBackBtn');
    const shareModal = document.getElementById('shareContactModal');
    let shareMode = 'text'; // 'text' or 'email'

    if (captureBtn && cameraInput) {
        captureBtn.onclick = () => cameraInput.click();

        cameraInput.onchange = async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            captureBtn.disabled = true;
            captureBtn.innerText = "⏳ Uploading Pic...";

            try {
                if (supabase) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${project.id}_${currentType}_${Date.now()}.${fileExt}`;
                    const filePath = `project_images/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('facility-assets')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('facility-assets')
                        .getPublicUrl(filePath);

                    const { error: dbError } = await supabase
                        .from('facility_images')
                        .insert({
                            project_id: project.id,
                            facility_id: facility.id,
                            photo_type: currentType,
                            file_url: urlData.publicUrl,
                            created_at: new Date().toISOString()
                        });

                    if (dbError) throw dbError;
                }

                cameraInput.value = "";
                await renderPhotoDashboard({ facility, project, photoType: currentType }, nav);
                
                // Trigger camera immediately for continuous flow loop
                const nextInput = document.getElementById('continuousCameraInput');
                if (nextInput) nextInput.click();

            } catch (err) {
                alert(`Upload failed: ${err.message || err}`);
                captureBtn.disabled = false;
                captureBtn.innerText = "📸 Take New Picture";
            }
        };
    }

    // Individual Item Deletion System
    document.querySelectorAll('.delete-photo-btn').forEach(btn => {
        btn.onclick = async () => {
            if (!confirm("Are you sure you want to delete this captured image?")) return;
            try {
                if (supabase) {
                    await supabase.from('facility_images').delete().eq('id', btn.dataset.id);
                }
                await renderPhotoDashboard({ facility, project, photoType: currentType }, nav);
            } catch (err) {
                console.error(err);
            }
        };
    });

    // Opening Sharing Overlay Management Actions
    const openShareFlow = (mode) => {
        shareMode = mode;
        const titleEl = document.getElementById('modalShareTitle');
        if (titleEl) titleEl.innerText = mode === 'text' ? '💬 Text Photo Report' : '✉️ Email Photo Report';
        if (shareModal) shareModal.style.display = 'flex';
    };

    const textBtn = document.getElementById('bulkTextBtn');
    if (textBtn) textBtn.onclick = () => openShareFlow('text');

    const emailBtn = document.getElementById('bulkEmailBtn');
    if (emailBtn) emailBtn.onclick = () => openShareFlow('email');

    const closeModalBtn = document.getElementById('closeShareModalBtn');
    if (closeShareModalBtn) closeModalBtn.onclick = () => { if (shareModal) shareModal.style.display = 'none'; };

    // Processing Report Delivery Target Packaging
    const confirmShareBtn = document.getElementById('confirmShareBtn');
    if (confirmShareBtn) {
        confirmShareBtn.onclick = () => {
            const selectedPhotoUrls = Array.from(document.querySelectorAll('.photo-select-checkbox:checked')).map(cb => cb.dataset.url);
            const selectedContacts = Array.from(document.querySelectorAll('.contact-share-checkbox:checked')).map(cb => ({
                name: cb.dataset.name,
                phone: cb.dataset.phone,
                email: cb.dataset.email
            }));

            if (selectedPhotoUrls.length === 0) {
                alert("Please select at least one photo report file checkbox.");
                return;
            }
            if (selectedContacts.length === 0) {
                alert("Please select at least one facility directory target contact entry row.");
                return;
            }

            const subject = `${facility.name || 'Facility'} - ${currentType.toUpperCase()} Project Photo Report`;
            let bodyMsg = `Hello,\n\nHere are the ${currentType.toLowerCase()} photos for the project "${project.title || project.Name || 'Maintenance'}" at ${facility.name || 'the facility'}:\n\n`;
            
            selectedPhotoUrls.forEach((url, index) => {
                bodyMsg += `Photo ${index + 1}: ${url}\n`;
            });

            if (shareMode === 'text') {
                const phoneNumbers = selectedContacts.map(c => c.phone).filter(p => p).join(',');
                if (!phoneNumbers) {
                    alert("The selected contacts do not contain valid phone numbers.");
                    return;
                }
                window.open(`sms:${phoneNumbers}?&body=${encodeURIComponent(bodyMsg)}`, '_blank');
            } else {
                const emails = selectedContacts.map(c => c.email).filter(e => e).join(',');
                if (!emails) {
                    alert("The selected contacts do not contain valid email addresses.");
                    return;
                }
                window.open(`mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyMsg)}`, '_blank');
            }

            if (shareModal) shareModal.style.display = 'none';
        };
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (nav && nav.renderSingleProjectDashboard) {
                nav.renderSingleProjectDashboard({ facility, project });
            } else {
                window.navigateTo('view_4_project_dashboard', { facility, project });
            }
        };
    }
}
