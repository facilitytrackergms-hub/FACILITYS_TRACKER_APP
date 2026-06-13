/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_photo_dashboard.js
SUPABASE TBL : facility_images, contacts
VIEW NAME    : Reusable Project Photo Dashboard with Sharing Engine
POP-UP TITLE : Continuous Photo Capture System & Contact Share
LAST UPDATED : 2026-06-13 @ 12:25 AM
================================================================*/
const __FILENAME = 'view_4_photo_dashboard.js';

import { escapeHtml, escapeAttr, formatDate } from './view_4_render_helpers.js';
import { renderStyles } from './view_4_styles.js';
import { fetchContacts } from '../../view_3_contacts/view_3_data.js';
import { supabase } from '../../js/supabaseClient.js';

// Reusable SVG Red Trash Can Icon
const redTrashIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
`;

const getReportAttachmentKey = (projectId) => `view4_report_attachments_${projectId || 'unknown_project'}`;

const readReportAttachments = (projectId) => {
    try {
        return JSON.parse(localStorage.getItem(getReportAttachmentKey(projectId)) || '[]');
    } catch (err) {
        console.error(`[${__FILENAME}] Failed reading report attachments:`, err);
        return [];
    }
};

const writeReportAttachments = (projectId, attachments) => {
    localStorage.setItem(getReportAttachmentKey(projectId), JSON.stringify(attachments));
};

const isPhotoAttachedToReport = (projectId, photoId, imageUrl) => {
    const attachments = readReportAttachments(projectId);
    return attachments.some(item => String(item.id) === String(photoId) || String(item.image_url) === String(imageUrl));
};

const attachPhotoToReport = ({ project, facility, photoId, imageUrl, photoType }) => {
    const projectId = project?.id || 'unknown_project';
    const attachments = readReportAttachments(projectId);
    const alreadyAttached = attachments.some(item => String(item.id) === String(photoId) || String(item.image_url) === String(imageUrl));

    if (!alreadyAttached) {
        attachments.push({
            id: photoId,
            image_url: imageUrl,
            photo_type: photoType || 'Project',
            project_id: projectId,
            facility_id: facility?.id || null,
            attached_at: new Date().toISOString()
        });
        writeReportAttachments(projectId, attachments);
    }

    return true;
};

export async function renderPhotoDashboard({ facility, project, photoType }, nav) {
    const app = document.getElementById('app');
    if (!app) return;

    const currentType = photoType || 'Before'; 
    const facilityName = escapeHtml(facility?.name || facility?.Name || 'Facility');
    const projectTitle = escapeHtml(project?.title || project?.Name || 'Project');

    // 1. Fetch existing pictures from the single facility_images table matching this project
    let photos = [];
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('facility_images')
                .select('*')
                .eq('project_id', String(project.id))
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

                <!-- Action Capture Matrix Controls -->
                <div class="cabinet-section" style="text-align: center; background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <!-- Native camera continuous stream input -->
                    <input type="file" id="continuousCameraInput" accept="image/*" capture="environment" style="display: none;" />
                    
                    <!-- NEW: Bulk photo gallery picker element -->
                    <input type="file" id="bulkGalleryInput" accept="image/*" multiple style="display: none;" />
                    
                    <!-- Green Camera Capture Trigger Button -->
                    <button type="button" id="triggerCaptureBtn" class="cabinet-btn cabinet-btn-green" style="font-size: 16px; padding: 12px; width: 100%; max-width: 300px; margin: 0 auto; display: block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        📸 Take New Picture
                    </button>

                    <!-- NEW: Styled Blue Bulk Gallery Upload Button directly under green camera button -->
                    <button type="button" id="triggerBulkUploadBtn" class="cabinet-btn" style="font-size: 16px; padding: 12px; width: 100%; max-width: 300px; margin: 10px auto 0 auto; display: block; background-color: #3b82f6; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: none; font-weight: bold; border-radius: 6px;">
                        📂 Upload Images
                    </button>

                    <!-- Relocated Finish & Back Button directly under green and blue action keys -->
                    <button type="button" id="photoDashboardBackBtn" class="cabinet-btn cabinet-btn-gray" style="font-size: 14px; padding: 10px; width: 100%; max-width: 300px; margin: 10px auto 0 auto; display: block;">
                        ⬅️ Finish & Back to Dashboard
                    </button>
                </div>

                <!-- Picture Grid Stream with Action Checkboxes -->
                <div class="cabinet-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h2 class="cabinet-section-title" style="margin: 0;">
                            Captured Gallery (<span id="galleryCountBadge">${photos.length}</span>)
                        </h2>
                        <div id="bulkActionsWrapper" style="display: ${photos.length > 0 ? 'flex' : 'none'}; gap: 8px;">
                            <button type="button" id="bulkTextBtn" class="cabinet-btn" style="padding: 4px 8px; font-size: 11px; margin: 0;">💬 Text</button>
                            <button type="button" id="bulkEmailBtn" class="cabinet-btn cabinet-btn-blue" style="padding: 4px 8px; font-size: 11px; margin: 0;">✉️ Email Report</button>
                        </div>
                    </div>
                    
                    <div id="photoGridContainer">
                        ${photos.length === 0 ? `
                            <div id="emptyPhotosPlaceholder" style="text-align: center; color: #9ca3af; padding: 40px 20px; border: 2px dashed #e5e7eb; border-radius: 6px;">
                                No ${currentType.toLowerCase()} photos uploaded yet.
                            </div>
                            <div id="liveGridStream" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;"></div>
                        ` : `
                            <div id="liveGridStream" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                ${photos.map(p => `
                                    <div class="photo-card" id="photo-card-${p.id}" style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                                        <input type="checkbox" class="photo-select-checkbox" data-url="${escapeAttr(p.image_url)}" style="position: absolute; top: 8px; left: 8px; width: 20px; height: 20px; z-index: 10; cursor: pointer;" />
                                        <img src="${escapeAttr(p.image_url)}" data-id="${p.id}" style="width:100%; height:120px; object-fit:cover; display:block; cursor: zoom-in;" alt="Capture">
                                        <div style="padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
                                            <span style="font-size: 10px; color: #4b5563;">${formatDate(p.created_at)}</span>
                                            <button type="button" class="delete-photo-btn" data-id="${escapeAttr(p.id)}" style="background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; height: 24px; width: 24px;">
                                                ${redTrashIcon}
                                            </button>
                                        </div>
                                        <div style="padding: 0 8px 8px 8px;">
                                            <button type="button" class="attach-report-photo-btn" data-id="${escapeAttr(p.id)}" data-url="${escapeAttr(p.image_url)}" data-type="${escapeAttr(currentType)}" style="width: 100%; border: none; border-radius: 5px; padding: 7px 5px; font-size: 10px; font-weight: 700; color: white; background: ${isPhotoAttachedToReport(project.id, p.id, p.image_url) ? '#16a34a' : '#003366'}; cursor: pointer;">
                                                ${isPhotoAttachedToReport(project.id, p.id, p.image_url) ? '✅ ATTACHED TO REPORT' : '📎 ATTACH PICTURE TO REPORT'}
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>

                <!-- Fullscreen Image Zoom Lightbox Modal Popup (With Touch Navigation Support) -->
                <div id="imageLightboxModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; align-items: center; justify-content: center; touch-action: none; user-select: none;">
                    <span id="closeLightboxBtn" style="position: absolute; top: 20px; right: 25px; color: #ffffff; font-size: 38px; font-weight: bold; cursor: pointer; user-select: none; z-index: 2100; text-shadow: 0 2px 4px rgba(0,0,0,0.6);">&times;</span>
                    
                    <!-- Swipe helper overlay indicators -->
                    <div style="position: absolute; left: 15px; color: rgba(255,255,255,0.4); font-size: 24px; pointer-events: none; user-select: none;">〈</div>
                    <div style="position: absolute; right: 15px; color: rgba(255,255,255,0.4); font-size: 24px; pointer-events: none; user-select: none;">〉</div>

                    <img id="lightboxImage" src="" style="max-width: 95%; max-height: 80%; object-fit: contain; border-radius: 4px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transform: scale(1); transition: transform 0.2s ease, opacity 0.15s ease; opacity: 1;" />
                    
                    <!-- Delete from Fullscreen View -->
                    <button type="button" id="lightboxDeleteBtn" style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: #ef4444; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 2100; font-size: 14px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block;">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete This Photo
                    </button>
                </div>

                <!-- Custom Modal for Delete Confirmation (Prevents Accidental Deletes, Iframe Safe) -->
                <div id="deleteConfirmModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 3000; align-items: center; justify-content: center;">
                    <div style="background: white; padding: 24px; border-radius: 12px; width: 90%; max-width: 340px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid #e5e7eb;">
                        <div style="font-size: 40px; margin-bottom: 12px;">⚠️</div>
                        <h3 style="margin-top: 0; color: #111827; font-size: 18px; font-weight: 700;">Delete Photo?</h3>
                        <p style="color: #4b5563; font-size: 13px; line-height: 1.5; margin-bottom: 24px; margin-top: 8px;">Are you sure you want to permanently delete this photo? This action cannot be undone.</p>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button id="cancelDeleteBtn" type="button" class="cabinet-btn cabinet-btn-gray" style="margin: 0; padding: 10px 18px; font-size: 13px; width: 100%; border-radius: 6px;">Cancel</button>
                            <button id="confirmDeleteBtn" type="button" class="cabinet-btn" style="margin: 0; padding: 10px 18px; font-size: 13px; width: 100%; background-color: #ef4444; color: white; border-radius: 6px; font-weight: 600;">Delete</button>
                        </div>
                    </div>
                </div>

                <!-- Contact Selection Modal Popup Interface -->
                <div id="shareContactModal" class="cabinet-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                    <div class="cabinet-modal-body" style="background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; max-height: 80vh; overflow-y: auto;">
                        <h3 id="modalShareTitle" style="margin-top: 0;">Select Facility Contacts</h3>
                        <div id="contactsModalList" style="margin: 15px 0; max-height: 250px; overflow-y: auto;">
                            ${facilityContacts.length === 0 ? '<p style="color: #6b7280; font-size: 13px;">No directory contacts found for this facility.</p>' : 
                            facilityContacts.map(c => `
                                <label style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; cursor: pointer;">
                                    <input type="checkbox" class="contact-share-checkbox" data-phone="${escapeAttr(c.phone)}" data-email="${escapeAttr(c.email)}" data-name="${escapeAttr(c.contact_name)}" />
                                    <div>
                                        <div style="font-weight: 500; font-size: 13px;">${escapeHtml(c.contact_name)}</div>
                                        <div style="font-size: 11px; color: #6b7280;">${escapeHtml(c.phone || '')} ${c.email ? `· ${escapeHtml(c.email)}` : ''}</div>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button type="button" id="closeShareModalBtn" class="cabinet-btn cabinet-btn-gray" style="margin:0; padding: 8px 12px; font-size:12px;">Cancel</button>
                            <button type="button" id="confirmShareBtn" class="cabinet-btn cabinet-btn-green" style="margin:0; padding: 8px 12px; font-size:12px;">Send Report</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    // 4. Connect Core System Event Logic Hooks
    const cameraInput = document.getElementById('continuousCameraInput');
    const captureBtn = document.getElementById('triggerCaptureBtn');
    const bulkInput = document.getElementById('bulkGalleryInput');
    const bulkBtn = document.getElementById('triggerBulkUploadBtn');
    const backBtn = document.getElementById('photoDashboardBackBtn');
    const shareModal = document.getElementById('shareContactModal');
    let shareMode = 'text'; 

    // Local state tracking to update DOM incrementally
    let localPhotoCount = photos.length;
    let pendingDeleteId = null;
    let pendingDeleteCardId = null;

    // --- CUSTOM CONFIRMATION MODAL LOGIC (IFRAME FRIENDLY) ---
    const deleteModal = document.getElementById('deleteConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    const triggerDeleteConfirmation = (photoId, cardId) => {
        pendingDeleteId = photoId;
        pendingDeleteCardId = cardId;
        if (deleteModal) deleteModal.style.display = 'flex';
    };

    if (cancelDeleteBtn && deleteModal) {
        cancelDeleteBtn.onclick = (e) => {
            e.preventDefault();
            deleteModal.style.display = 'none';
            pendingDeleteId = null;
            pendingDeleteCardId = null;
        };
    }

    if (confirmDeleteBtn && deleteModal) {
        confirmDeleteBtn.onclick = async (e) => {
            e.preventDefault();
            if (!pendingDeleteId) return;

            try {
                if (supabase) {
                    await supabase.from('facility_images').delete().eq('id', pendingDeleteId);
                }
                
                // Remove card from the grid
                const card = document.getElementById(pendingDeleteCardId);
                if (card) card.remove();

                // If currently open in lightbox, close it too
                if (lightboxModal && lightboxModal.style.display === 'flex' && lightboxImg.dataset.id === String(pendingDeleteId)) {
                    lightboxModal.style.display = 'none';
                    lightboxImg.src = '';
                }

                localPhotoCount--;
                const badge = document.getElementById('galleryCountBadge');
                if (badge) badge.innerText = localPhotoCount;

                if (localPhotoCount === 0) {
                    const placeholder = document.getElementById('emptyPhotosPlaceholder');
                    if (placeholder) placeholder.style.display = 'block';
                    const bulkWrapper = document.getElementById('bulkActionsWrapper');
                    if (bulkWrapper) bulkWrapper.style.display = 'none';
                }

            } catch (err) {
                console.error("Error deleting image:", err);
            } finally {
                deleteModal.style.display = 'none';
                pendingDeleteId = null;
                pendingDeleteCardId = null;
            }
        };
    }

    // --- REUSABLE CARD INJECTION HELPER (Instantly adds image card with handlers) ---
    const injectImageToGallery = (imageUrl, dbPhotoId) => {
        const placeholder = document.getElementById('emptyPhotosPlaceholder');
        if (placeholder) placeholder.style.display = 'none';

        const liveGrid = document.getElementById('liveGridStream');
        if (liveGrid) {
            const cardMarkup = `
                <div class="photo-card" id="photo-card-${dbPhotoId}" style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.05); animation: fadeIn 0.3s ease-out;">
                    <input type="checkbox" class="photo-select-checkbox" data-url="${escapeAttr(imageUrl)}" style="position: absolute; top: 8px; left: 8px; width: 20px; height: 20px; z-index: 10; cursor: pointer;" />
                    <img src="${escapeAttr(imageUrl)}" data-id="${dbPhotoId}" style="width:100%; height:120px; object-fit:cover; display:block; cursor: zoom-in;" alt="Capture">
                    <div style="padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 10px; color: #4b5563;">Just now</span>
                        <button type="button" class="delete-photo-btn" data-id="${escapeAttr(dbPhotoId)}" style="background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; height: 24px; width: 24px;">
                            ${redTrashIcon}
                        </button>
                    </div>
                    <div style="padding: 0 8px 8px 8px;">
                        <button type="button" class="attach-report-photo-btn" data-id="${escapeAttr(dbPhotoId)}" data-url="${escapeAttr(imageUrl)}" data-type="${escapeAttr(currentType)}" style="width: 100%; border: none; border-radius: 5px; padding: 7px 5px; font-size: 10px; font-weight: 700; color: white; background: #003366; cursor: pointer;">
                            📎 ATTACH PICTURE TO REPORT
                        </button>
                    </div>
                </div>
            `;
            liveGrid.insertAdjacentHTML('afterbegin', cardMarkup);

            // Attach dynamic click events to the trash button inside the new card
            const newCard = document.getElementById(`photo-card-${dbPhotoId}`);
            if (newCard) {
                const deleteBtn = newCard.querySelector('.delete-photo-btn');
                if (deleteBtn) {
                    deleteBtn.onclick = (delEvt) => {
                        delEvt.preventDefault();
                        triggerDeleteConfirmation(dbPhotoId, `photo-card-${dbPhotoId}`);
                    };
                }
            }
        }

        localPhotoCount++;
        const badge = document.getElementById('galleryCountBadge');
        if (badge) badge.innerText = localPhotoCount;
        const bulkWrapper = document.getElementById('bulkActionsWrapper');
        if (bulkWrapper) bulkWrapper.style.display = 'flex';
    };

    // --- CONTINUOUS SINGLE CAMERA UPLOAD LOGIC ---
    if (captureBtn && cameraInput) {
        captureBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            cameraInput.click();
        };

        cameraInput.onchange = async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            captureBtn.disabled = true;
            if (bulkBtn) bulkBtn.disabled = true;
            captureBtn.innerText = "⏳ Uploading Pic...";

            try {
                if (supabase) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${project.id}_${Date.now()}.${fileExt}`;
                    const filePath = `project_images/${currentType.toLowerCase()}/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('facility-assets')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('facility-assets')
                        .getPublicUrl(filePath);

                    const { data: insertData, error: dbError } = await supabase
                        .from('facility_images')
                        .insert({
                            project_id: String(project.id),
                            facility_id: facility.id ? Number(facility.id) : null,
                            photo_type: currentType,
                            image_url: urlData.publicUrl,
                            created_at: new Date().toISOString()
                        })
                        .select();

                    if (dbError) throw dbError;

                    const newPhotoId = insertData?.[0]?.id || Date.now();
                    injectImageToGallery(urlData.publicUrl, newPhotoId);
                }

                cameraInput.value = "";
                captureBtn.disabled = false;
                if (bulkBtn) bulkBtn.disabled = false;
                captureBtn.innerText = "📸 Take New Picture";

            } catch (err) {
                alert(`Upload failed: ${err.message || err}`);
                captureBtn.disabled = false;
                if (bulkBtn) bulkBtn.disabled = false;
                captureBtn.innerText = "📸 Take New Picture";
            }
        };
    }

    // --- NEW: MULTI-FILE GALLERY UPLOAD LOGIC ---
    if (bulkBtn && bulkInput) {
        bulkBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            bulkInput.click();
        };

        bulkInput.onchange = async (e) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;

            // Lock controls
            bulkBtn.disabled = true;
            captureBtn.disabled = true;

            let failedUploads = 0;

            // Sequentially upload selected gallery files
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                bulkBtn.innerText = `⏳ Uploading (${i + 1}/${files.length})...`;

                try {
                    if (supabase) {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${project.id}_bulk_${Date.now()}_${i}.${fileExt}`;
                        const filePath = `project_images/${currentType.toLowerCase()}/${fileName}`;

                        const { error: uploadError } = await supabase.storage
                            .from('facility-assets')
                            .upload(filePath, file);

                        if (uploadError) throw uploadError;

                        const { data: urlData } = supabase.storage
                            .from('facility-assets')
                            .getPublicUrl(filePath);

                        const { data: insertData, error: dbError } = await supabase
                            .from('facility_images')
                            .insert({
                                project_id: String(project.id),
                                facility_id: facility.id ? Number(facility.id) : null,
                                photo_type: currentType,
                                image_url: urlData.publicUrl,
                                created_at: new Date().toISOString()
                            })
                            .select();

                        if (dbError) throw dbError;

                        const newPhotoId = insertData?.[0]?.id || (Date.now() + i);
                        
                        // Inject into gallery view immediately
                        injectImageToGallery(urlData.publicUrl, newPhotoId);
                    }
                } catch (err) {
                    console.error(`Bulk upload failed for file #${i}:`, err);
                    failedUploads++;
                }
            }

            // Unlock controls
            bulkInput.value = "";
            bulkBtn.disabled = false;
            captureBtn.disabled = false;
            bulkBtn.innerText = "📂 Upload Images";

            if (failedUploads > 0) {
                alert(`Batch upload finished. ${files.length - failedUploads} images uploaded successfully. ${failedUploads} failed.`);
            }
        };
    }

    // --- FULLSCREEN LIGHTBOX, PREVIEW & SWIPE NAVIGATION ENGINE ---
    const photoGridContainer = document.getElementById('photoGridContainer');
    const lightboxModal = document.getElementById('imageLightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');
    const lightboxDeleteBtn = document.getElementById('lightboxDeleteBtn');

    // Dynamically retrieve current image elements on screen for swiping order
    const getGalleryImages = () => {
        const imgElements = Array.from(document.querySelectorAll('#liveGridStream .photo-card img'));
        return imgElements.map(img => ({
            id: img.getAttribute('data-id'),
            src: img.getAttribute('src')
        }));
    };

    if (photoGridContainer && lightboxModal && lightboxImg) {
        photoGridContainer.addEventListener('click', (e) => {
            const attachBtn = e.target.closest('.attach-report-photo-btn');
            if (attachBtn) {
                e.preventDefault();
                e.stopPropagation();

                attachPhotoToReport({
                    project,
                    facility,
                    photoId: attachBtn.dataset.id,
                    imageUrl: attachBtn.dataset.url,
                    photoType: attachBtn.dataset.type || currentType
                });

                attachBtn.innerText = '✅ ATTACHED TO REPORT';
                attachBtn.style.background = '#16a34a';
                return;
            }

            const clickedImg = e.target;
            if (clickedImg.tagName === 'IMG' && clickedImg.closest('.photo-card')) {
                lightboxImg.src = clickedImg.src;
                lightboxImg.dataset.id = clickedImg.dataset.id; // Store active photo ID
                lightboxModal.style.display = 'flex';
            }
        });

        if (closeLightboxBtn) {
            closeLightboxBtn.onclick = (e) => {
                e.preventDefault();
                lightboxModal.style.display = 'none';
                lightboxImg.src = '';
                lightboxImg.removeAttribute('data-id');
            };
        }

        // Handle direct deletion from Zoom Screen
        if (lightboxDeleteBtn) {
            lightboxDeleteBtn.onclick = (e) => {
                e.preventDefault();
                const activeId = lightboxImg.dataset.id;
                if (activeId) {
                    triggerDeleteConfirmation(activeId, `photo-card-${activeId}`);
                }
            };
        }

        // Touch Variables for Mobile Swipe Gestures
        let touchStartX = 0;
        let touchEndX = 0;

        const navigateGallery = (direction) => {
            const gallery = getGalleryImages();
            if (gallery.length <= 1) return;

            const currentId = lightboxImg.dataset.id;
            const currentIndex = gallery.findIndex(item => String(item.id) === String(currentId));
            if (currentIndex === -1) return;

            let targetIndex = currentIndex;
            if (direction === 'next') {
                targetIndex = currentIndex + 1;
                if (targetIndex >= gallery.length) targetIndex = 0; // loop to start
            } else if (direction === 'prev') {
                targetIndex = currentIndex - 1;
                if (targetIndex < 0) targetIndex = gallery.length - 1; // loop to end
            }

            const nextPhoto = gallery[targetIndex];
            if (nextPhoto) {
                // Apply a smooth transition effect
                lightboxImg.style.opacity = '0';
                setTimeout(() => {
                    lightboxImg.src = nextPhoto.src;
                    lightboxImg.dataset.id = nextPhoto.id;
                    lightboxImg.style.opacity = '1';
                }, 120);
            }
        };

        // Touch gesture capture hooks
        lightboxModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        lightboxModal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const swipeThreshold = 45; // pixels
            const diffX = touchEndX - touchStartX;

            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0) {
                    // Swipe right -> Show Previous image
                    navigateGallery('prev');
                } else {
                    // Swipe left -> Show Next image
                    navigateGallery('next');
                }
            }
        }, { passive: true });

        // Click off background to close
        lightboxModal.onclick = (e) => {
            if (e.target === lightboxModal || e.target === lightboxImg) {
                lightboxModal.style.display = 'none';
                lightboxImg.src = '';
                lightboxImg.removeAttribute('data-id');
            }
        };
    }

    // Connect standard card trash bin triggers
    document.querySelectorAll('.delete-photo-btn').forEach(btn => {
        const photoId = btn.dataset.id;
        btn.onclick = (e) => {
            e.preventDefault();
            triggerDeleteConfirmation(photoId, `photo-card-${photoId}`);
        };
    });

    // Share Overlays
    const openShareFlow = (mode) => {
        shareMode = mode;
        const titleEl = document.getElementById('modalShareTitle');
        if (titleEl) titleEl.innerText = mode === 'text' ? '💬 Text Photo Report' : '✉️ Email Photo Report';
        if (shareModal) shareModal.style.display = 'flex';
    };

    const textBtn = document.getElementById('bulkTextBtn');
    if (textBtn) textBtn.onclick = (e) => { e.preventDefault(); openShareFlow('text'); };

    const emailBtn = document.getElementById('bulkEmailBtn');
    if (emailBtn) emailBtn.onclick = (e) => { e.preventDefault(); openShareFlow('email'); };

    const closeModalBtn = document.getElementById('closeShareModalBtn');
    if (closeModalBtn) closeModalBtn.onclick = (e) => { e.preventDefault(); if (shareModal) shareModal.style.display = 'none'; };

    const confirmShareBtn = document.getElementById('confirmShareBtn');
    if (confirmShareBtn) {
        confirmShareBtn.onclick = (e) => {
            e.preventDefault();
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
        backBtn.onclick = (e) => {
            e.preventDefault();
            if (nav && nav.renderSingleProjectDashboard) {
                nav.renderSingleProjectDashboard({ facility, project });
            } else {
                window.navigateTo('view_4_project_dashboard', { facility, project });
            }
        };
    }
}
