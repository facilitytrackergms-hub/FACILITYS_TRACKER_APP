/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_photos.js
SUPABASE TBL : reports, report_attachments
VIEW NAME    : Report Development Photos
POP-UP TITLE : Report Photos
LAST UPDATED : 2026-06-13 @ 02:35 PM
================================================================*/
const __FILENAME = 'view_4_report_dev_photos.js';

import {
    fetchReportAttachments,
    insertReportAttachment,
    removeReportAttachment,
    uploadCabinetFile
} from '../view_4_core/view_4_data.js';

import {
    escapeHtml,
    ensureReport,
    getProjectId,
    getFacilityId,
    makeChildContext,
    showMessage
} from './view_4_report_dev_helpers.js';

export function renderPhotosSection(context) {
    return `
        <div class="v4-report-dev-panel">
            <h3>${escapeHtml(context.photoWorkflow.title)}</h3>
            <div id="v4ReportDevMessage" class="v4-report-dev-message"></div>

            <input id="v4ReportDevCameraInput" class="v4-report-dev-hidden-file" type="file" accept="image/*" capture="environment">
            <input id="v4ReportDevUploadInput" class="v4-report-dev-hidden-file" type="file" accept="image/*">

            <button id="v4ReportDevOpenCamera" class="v4-report-dev-main-btn">
                Open Camera
            </button>

            <button id="v4ReportDevUploadPhoto" class="v4-report-dev-main-btn">
                Upload Photo
            </button>

            <div id="v4ReportDevSelectedPhotoBox" class="v4-report-dev-selected-photo-box">
                No photo selected.
            </div>

            <div id="v4ReportDevAttachmentList" class="v4-report-dev-photo-grid">Loading...</div>

            <div id="v4ReportDevPhotoLightbox" class="v4-report-dev-lightbox">
                <button id="v4ReportDevLightboxClose" class="v4-report-dev-lightbox-close">×</button>
                <button id="v4ReportDevLightboxPrev" class="v4-report-dev-lightbox-nav left">‹</button>
                <img id="v4ReportDevLightboxImage" src="" alt="Report Photo">
                <button id="v4ReportDevLightboxNext" class="v4-report-dev-lightbox-nav right">›</button>
            </div>

            <button id="v4ReportDevBackEditFromPhotos" class="v4-report-dev-main-btn secondary">
                Back To Edit Report Sections
            </button>
        </div>
    `;
}

export function renderAttachmentList(attachments) {
    if (!attachments || attachments.length === 0) return 'No photos saved yet.';

    return attachments.map((item, index) => `
        <div class="v4-report-dev-photo-card" data-attachment-id="${escapeHtml(item.id)}">
            ${item.file_url ? `
                <img 
                    class="v4-report-dev-photo-thumb" 
                    src="${escapeHtml(item.file_url)}" 
                    alt="${escapeHtml(item.title || 'Report Photo')}"
                    data-photo-index="${index}"
                    data-photo-url="${escapeHtml(item.file_url)}"
                >
            ` : ''}
            <button 
                type="button" 
                class="v4-report-dev-delete-photo-btn" 
                data-attachment-id="${escapeHtml(item.id)}"
            >
                Delete
            </button>
        </div>
    `).join('');
}

export async function loadAttachments(context) {
    const report = await ensureReport(context);
    const box = document.getElementById('v4ReportDevAttachmentList');
    if (!box || !report?.id) return;

    const attachments = await fetchReportAttachments(report.id);
    box.innerHTML = renderAttachmentList(attachments);
    setupPhotoAttachmentEvents(context, attachments);
}

export async function uploadReportPhoto(context, fileObj) {
    if (!fileObj) {
        showMessage('No photo selected.', true);
        return null;
    }

    const report = await ensureReport(context);

    if (!report?.id) {
        showMessage('Report could not be created.', true);
        return null;
    }

    const safeFileName = String(fileObj.name || 'report_photo.jpg')
        .replaceAll(' ', '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');

    const filePath = `report_attachments/${report.id}/${context.photoWorkflow.photoType}_${Date.now()}_${safeFileName}`;

    const result = await uploadCabinetFile('facility-assets', filePath, fileObj);

    if (result?.error || !result?.publicUrl) {
        console.error(`[${__FILENAME}] Photo upload failed.`, result?.error);
        showMessage('Photo upload failed.', true);
        return null;
    }

    await saveAttachment(
        makeChildContext(context, { report }),
        'photo',
        context.photoWorkflow.title,
        result.publicUrl,
        '',
        context.photoWorkflow.photoType
    );

    showMessage('Photo saved to report.');
    return result.publicUrl;
}

export function showSelectedPhoto(fileObj) {
    const box = document.getElementById('v4ReportDevSelectedPhotoBox');
    if (!box || !fileObj) return;

    const localUrl = URL.createObjectURL(fileObj);

    box.innerHTML = `
        <div><strong>Selected Photo:</strong> ${escapeHtml(fileObj.name || 'Camera Photo')}</div>
        <img class="v4-report-dev-photo-preview" src="${localUrl}" alt="Selected Photo">
    `;
}

export async function handlePhotoFileSelected(context, fileObj) {
    showSelectedPhoto(fileObj);
    await uploadReportPhoto(context, fileObj);
}

export async function saveAttachment(context, attachmentType, title, fileUrl, description, photoType = null) {
    const report = await ensureReport(context);

    if (!report?.id) {
        showMessage('Report could not be created.', true);
        return false;
    }

    if (attachmentType === 'photo' && !fileUrl) {
        showMessage('Upload a photo first.', true);
        return false;
    }

    const { error } = await insertReportAttachment({
        report_id: report.id,
        project_id: getProjectId(context),
        facility_id: getFacilityId(context),
        attachment_type: attachmentType,
        source_table: 'manual_entry',
        source_id: '',
        title,
        description,
        file_url: fileUrl,
        photo_type: photoType,
        sort_order: 1,
        active_status: true
    });

    if (error) {
        console.error(`[${__FILENAME}] Error saving attachment.`, error);
        showMessage('Attachment save failed.', true);
        return false;
    }

    await loadAttachments(makeChildContext(context, { report }));
    return true;
}

export function setupPhotoAttachmentEvents(context, attachments = []) {
    let currentIndex = 0;

    const lightbox = document.getElementById('v4ReportDevPhotoLightbox');
    const lightboxImage = document.getElementById('v4ReportDevLightboxImage');
    const closeBtn = document.getElementById('v4ReportDevLightboxClose');
    const prevBtn = document.getElementById('v4ReportDevLightboxPrev');
    const nextBtn = document.getElementById('v4ReportDevLightboxNext');

    const photoItems = (attachments || []).filter(item => item.file_url);

    const openPhoto = (index) => {
        if (!lightbox || !lightboxImage || photoItems.length === 0) return;
        currentIndex = index;
        lightboxImage.src = photoItems[currentIndex].file_url;
        lightbox.style.display = 'flex';
    };

    const showPrev = () => {
        if (photoItems.length === 0) return;
        currentIndex = currentIndex <= 0 ? photoItems.length - 1 : currentIndex - 1;
        openPhoto(currentIndex);
    };

    const showNext = () => {
        if (photoItems.length === 0) return;
        currentIndex = currentIndex >= photoItems.length - 1 ? 0 : currentIndex + 1;
        openPhoto(currentIndex);
    };

    document.querySelectorAll('.v4-report-dev-photo-thumb').forEach(img => {
        img.onclick = () => {
            const index = Number(img.dataset.photoIndex || 0);
            openPhoto(index);
        };
    });

    document.querySelectorAll('.v4-report-dev-delete-photo-btn').forEach(btn => {
        btn.onclick = async () => {
            const attachmentId = btn.dataset.attachmentId;
            if (!attachmentId) return;

            await removeReportAttachment(attachmentId);
            await loadAttachments(context);
        };
    });

    if (closeBtn && lightbox && lightboxImage) {
        closeBtn.onclick = () => {
            lightbox.style.display = 'none';
            lightboxImage.src = '';
        };
    }

    if (prevBtn) prevBtn.onclick = showPrev;
    if (nextBtn) nextBtn.onclick = showNext;

    if (lightbox) {
        let startX = 0;

        lightbox.ontouchstart = (e) => {
            startX = e.touches?.[0]?.clientX || 0;
        };

        lightbox.ontouchend = (e) => {
            const endX = e.changedTouches?.[0]?.clientX || 0;
            const diff = endX - startX;

            if (Math.abs(diff) > 45) {
                if (diff > 0) showPrev();
                else showNext();
            }
        };

        lightbox.onclick = (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                if (lightboxImage) lightboxImage.src = '';
            }
        };
    }
}

/*================================================================
END FILE: view_4_report_dev_photos.js
================================================================*/
