/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_photo_dashboard.js
SUPABASE TBL : facility_images, contacts
VIEW NAME    : Reusable Project Photo Dashboard with Sharing Engine
POP-UP TITLE : Continuous Photo Capture System & Contact Share
LAST UPDATED : 2026-06-12 @ 06:58 PM
================================================================*/
const __FILENAME = 'view_4_photo_dashboard.js';

import { escapeHtml, escapeAttr, formatDate } from './view_4_render_helpers.js';
import { renderStyles } from './view_4_styles.js';
import { fetchContacts } from '../../view_3_contacts/view_3_data.js';
import { supabase } from '../../../js/supabaseClient.js';

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
                    <input type="file" id="continuousCameraInput" accept="image/*" capture="environment" style="display: none;" />
                    
                    <button id="triggerCaptureBtn" class="cabinet-btn cabinet-btn-green" style="font-size: 16px; padding: 12px; width: 100%; max-width: 300px; margin: 0 auto; display: block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        📸 Take New Picture
                    </button>
                    <p style="font-size: 11px; color: #6b7280; margin-top: 6px; margin-bottom: 0;">
                        App automatically reopens your camera to take consecutive shots until you hit Finish.
                    </p>
                </div>

                <!-- Picture Grid Stream with Action Checkboxes -->
                <div class="cabinet-section">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h2 class="cabinet-section-title" style="margin: 0;">
                            Captured Gallery (<span id="galleryCountBadge">${photos.length}</span>)
                        </h2>
                        <div id="bulkActionsWrapper" style="display: ${photos.length > 0 ? 'flex' : 'none'}; gap: 8px;">
                            <button id="bulkTextBtn" class="cabinet-btn" style="padding: 4px 8px; font-size: 11px; margin: 0;">💬 Text</button>
                            <button id="bulkEmailBtn" class="cabinet-btn cabinet-btn-blue" style="padding: 4px 8px; font-size: 11px; margin: 0;">✉️ Email Report</button>
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
                                        <!-- FIXED: Checkboxes now default to unchecked/blank -->
                                        <input type="checkbox" class="photo-select-checkbox" data-url="${escapeAttr(p.image_url)}" style="position: absolute; top: 8px; left: 8px; width: 20px; height: 20px; z-index: 10; cursor: pointer;" />
                                        <img src="${escapeAttr(p.image_url)}" style="width:100%; height:120px; object-fit:cover; display:block; cursor: zoom-in;" alt="Capture">
                                        <div style="padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
                                            <span style="font-size: 10px; color: #4b5563;">${formatDate(p.created_at)}</span>
                                            <button class="delete-photo-btn" data-id="${escapeAttr(p.id)}" style="background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 0;">🗑️</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>

                <!-- Fullscreen Image Zoom Lightbox Modal Popup -->
                <div id="imageLightboxModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2000; align-items: center; justify-content: center; touch-action: none;">
                    <span id="closeLightboxBtn" style="position: absolute; top: 20px; right: 25px; color: #ffffff; font-size: 38px; font-weight: bold; cursor: pointer; user-select: none; z-index: 2100; text-shadow: 0 2px 4px rgba(0,0,0,0.6);">&times;</span>
                    <img id="lightboxImage" src="" style="max-width: 95%; max-height: 90%; object-fit: contain; border-radius: 4px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transform: scale(1); transition: transform 0.2s ease;" />
                </div>

                <!-- Contact Selection Modal Popup Interface -->
                <div id="shareContactModal" class="cabinet-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                    <div class="cabinet-modal-body" style="background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; max-height: 80vh; overflow-y: auto;">
                        <h3 id="modalShareTitle" style="margin-top: 0;">Select Facility Contacts</h3>
                        <div id="contactsModalList" style="margin: 15px 0; max-height: 250px; overflow-y: auto;">
                            ${facilityContacts.length === 0 ? '<p style="color: #6b7280; font-size: 13px;">No directory contacts found for this facility.</p>' : 
                            facilityContacts.map(c => `
                                <label style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; cursor: pointer;">
                                    <!-- FIXED: Contact checkboxes now default to unchecked/blank -->
                                    <input type="checkbox" class="contact-share-checkbox" data-phone="${escapeAttr(c.phone)}" data-email="${escapeAttr(c.email)}" data-name="${escapeAttr(c.contact_name)}" />
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

                <!-- Exit Navigation Options -->
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

    // Local state tracking to update DOM incrementally
    let localPhotoCount = photos.length;

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
                    const fileName = `${project.id}_${Date.now()}.${fileExt}`;
                    
                    // Categorized clean storage folders inside your single bucket
                    const filePath = `project_images/${currentType.toLowerCase()}/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('facility-assets')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('facility-assets')
                        .getPublicUrl(filePath);

                    // Insert payload directly mapped to columns in your facility_images table
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

                    // Get the newly inserted ID
                    const newPhotoId = insertData?.[0]?.id || Date.now();

                    // --- HIGH-PERFORMANCE DOM INJECTION (Prevents context reload) ---
                    // 1. Hide the placeholder if it exists
                    const placeholder = document.getElementById('emptyPhotosPlaceholder');
                    if (placeholder) placeholder.style.display = 'none';

                    // 2. Add the photo to our live container
                    const liveGrid = document.getElementById('liveGridStream');
                    if (liveGrid) {
                        const cardMarkup = `
                            <div class="photo-card" id="photo-card-${newPhotoId}" style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.05); animation: fadeIn 0.3s ease-out;">
                                <!-- FIXED: Newly taken photos also start unchecked -->
                                <input type="checkbox" class="photo-select-checkbox" data-url="${escapeAttr(urlData.publicUrl)}" style="position: absolute; top: 8px; left: 8px; width: 20px; height: 20px; z-index: 10; cursor: pointer;" />
                                <img src="${escapeAttr(urlData.publicUrl)}" style="width:100%; height:120px; object-fit:cover; display:block; cursor: zoom-in;" alt="Capture">
                                <div style="padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 10px; color: #4b5563;">Just now</span>
                                    <button class="delete-photo-btn" data-id="${escapeAttr(newPhotoId)}" style="background: none; border: none; color: #ef4444; font-size: 12px; cursor: pointer; padding: 0;">🗑️</button>
                                </div>
                            </div>
                        `;
                        liveGrid.insertAdjacentHTML('afterbegin', cardMarkup);

                        // Attach delete listener on the newly created trash button immediately
                        const newCard = document.getElementById(`photo-card-${newPhotoId}`);
                        if (newCard) {
                            const deleteBtn = newCard.querySelector('.delete-photo-btn');
                            if (deleteBtn) {
                                deleteBtn.onclick = async () => {
                                    if (!confirm("Are you sure you want to delete this captured image?")) return;
                                    try {
                                        await supabase.from('facility_images').delete().eq('id', newPhotoId);
                                        newCard.remove();
                                        localPhotoCount--;
                                        document.getElementById('galleryCountBadge').innerText = localPhotoCount;
                                        if (localPhotoCount === 0) {
                                            if (placeholder) placeholder.style.display = 'block';
                                            document.getElementById('bulkActionsWrapper').style.display = 'none';
                                        }
                                    } catch (err) {
                                        console.error(err);
                                    }
                                };
                            }
                        }
                    }

                    // 3. Increment counters & show sharing buttons
                    localPhotoCount++;
                    document.getElementById('galleryCountBadge').innerText = localPhotoCount;
                    document.getElementById('bulkActionsWrapper').style.display = 'flex';
                }

                // Clean the input, reset button states safely
                cameraInput.value = "";
                captureBtn.disabled = false;
                captureBtn.innerText = "📸 Take New Picture";
                
                // Programmatically trigger next camera click immediately for infinite loops
                cameraInput.click();

            } catch (err) {
                alert(`Upload failed: ${err.message || err}`);
                captureBtn.disabled = false;
                captureBtn.innerText = "📸 Take New Picture";
            }
        };
    }

    // --- FULLSCREEN IMAGE INTERACTIVE PREVIEW ENGINE (EVENT DELEGATION) ---
    const photoGridContainer = document.getElementById('photoGridContainer');
    const lightboxModal = document.getElementById('imageLightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');

    if (photoGridContainer && lightboxModal && lightboxImg) {
        // Monitor any tap/click on thumbnail images inside our grid container
        photoGridContainer.addEventListener('click', (e) => {
            const clickedImg = e.target;
            // Ensure the clicked element is an image and is part of a photo card (not a checkbox/trash button)
            if (clickedImg.tagName === 'IMG' && clickedImg.closest('.photo-card')) {
                lightboxImg.src = clickedImg.src;
                lightboxModal.style.display = 'flex';
            }
        });

        // Close when clicking the close button
        if (closeLightboxBtn) {
            closeLightboxBtn.onclick = () => {
                lightboxModal.style.display = 'none';
                lightboxImg.src = '';
            };
        }

        // Close when tapping anywhere on the dark background
        lightboxModal.onclick = (e) => {
            if (e.target === lightboxModal || e.target === lightboxImg) {
                lightboxModal.style.display = 'none';
                lightboxImg.src = '';
            }
        };
    }

    // Connect delete hooks to pre-existing items loaded on page startup
    document.querySelectorAll('.delete-photo-btn').forEach(btn => {
        const photoId = btn.dataset.id;
        btn.onclick = async () => {
            if (!confirm("Are you sure you want to delete this captured image?")) return;
            try {
                if (supabase) {
                    await supabase.from('facility_images').delete().eq('id', photoId);
                }
                const card = document.getElementById(`photo-card-${photoId}`);
                if (card) card.remove();
                
                localPhotoCount--;
                document.getElementById('galleryCountBadge').innerText = localPhotoCount;
                if (localPhotoCount === 0) {
                    const placeholder = document.getElementById('emptyPhotosPlaceholder');
                    if (placeholder) placeholder.style.display = 'block';
                    document.getElementById('bulkActionsWrapper').style.display = 'none';
                }
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
