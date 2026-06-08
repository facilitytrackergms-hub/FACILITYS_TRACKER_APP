/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
SUPABASE TBL : facility_projects, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Vendor Project Filing Cabinet
POP-UP TITLE : Vendor Project Entry
LAST UPDATED : 2026-06-08 @ 10:45 PM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
     including this header and all rules, wrapped completely inside 
     a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
     in this header (File Name, Table, View, Title, Date, Time) are 
     fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_4_modal.js';

import {
    insertFacilityProject,
    insertVendor,
    insertVendorFile,
    insertProjectVendorJob,
    insertVendorJobFile,
    insertVendorJobFollowup,
    uploadCabinetFile,
    getProjectTitle,
    getVendorName
} from './view_4_data.js';

export function setupCabinetHomeEvents({ facility, projects, vendors, refreshHome, openVendor, openVendorJob }) {
    byId('cabinetAddProjectBtn').onclick = () => showModal('cabinetProjectModal');
    byId('cabinetAddVendorBtn').onclick = () => showModal('cabinetVendorModal');
    byId('cabinetStartVendorJobBtn').onclick = () => showModal('cabinetStartJobModal');

    byId('closeProjectModalBtn').onclick = () => hideModal('cabinetProjectModal');
    byId('closeVendorModalBtn').onclick = () => hideModal('cabinetVendorModal');
    byId('cabinetCloseJobModalBtn').onclick = () => hideModal('cabinetStartJobModal');

    byId('cabinetBackBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_2_controls', facility);
    };

    byId('saveProjectBtn').onclick = async () => {
        const title = value('newProjectTitleInput');
        if (!title) {
            alert('[view_4_modal.js] Notification: Add a project title first.');
            return;
        }

        const result = await insertFacilityProject({
            facility_id: facility.id,
            title,
            description: value('newProjectNotesInput'),
            status: 'open'
        });

        if (result.error) {
            alert(`[view_4_modal.js] Database Error: Could not save project. ${result.error.message}`);
            return;
        }

        hideModal('cabinetProjectModal');
        await refreshHome();
    };

    byId('saveVendorBtn').onclick = async () => {
        const companyName = value('newVendorCompanyInput');
        if (!companyName) {
            alert('[view_4_modal.js] Notification: Add the vendor company name first.');
            return;
        }

        const result = await insertVendor({
            company_name: companyName,
            contact_name: value('newVendorContactInput'),
            phone: value('newVendorPhoneInput'),
            email: value('newVendorEmailInput'),
            notes: value('newVendorNotesInput'),
            status: 'active'
        });

        if (result.error) {
            alert(`[view_4_modal.js] Database Error: Could not save vendor. ${result.error.message}`);
            return;
        }

        hideModal('cabinetVendorModal');
        await refreshHome();
    };

    byId('cabinetSaveJobBtn').onclick = async () => {
        await saveVendorJobFromModal('cabinet', { refresh: refreshHome });
    };

    document.querySelectorAll('[data-open-vendor]').forEach(button => {
        button.onclick = () => openVendor(button.dataset.openVendor);
    });

    document.querySelectorAll('[data-open-vendor-job]').forEach(button => {
        button.onclick = () => openVendorJob(button.dataset.openVendorJob);
    });
}

export function setupVendorDashboardEvents({ facility, vendor, projects, refreshVendor, backHome, openVendorJob }) {
    byId('vendorAddProfileFileBtn').onclick = () => showModal('vendorProfileFileModal');
    byId('vendorStartJobBtn').onclick = () => showModal('vendorStartJobModal');
    byId('vendorBackHomeBtn').onclick = () => backHome();

    byId('closeVendorFileModalBtn').onclick = () => hideModal('vendorProfileFileModal');
    byId('vendorCloseJobModalBtn').onclick = () => hideModal('vendorStartJobModal');

    byId('saveVendorFileBtn').onclick = async () => {
        const fileInput = byId('vendorFileInput');
        const file = fileInput?.files?.[0] || null;
        const pastedUrl = value('vendorFileUrlInput');
        let fileUrl = pastedUrl;
        let storagePath = '';
        let fileName = file?.name || '';

        if (file) {
            const upload = await uploadCabinetFile(file, `vendor-files/${vendor.id}`);
            if (upload.error) {
                alert(`[view_4_modal.js] Storage Error: Could not upload vendor file. ${upload.error.message}`);
                return;
            }
            fileUrl = upload.url;
            storagePath = upload.path;
        }

        if (!fileUrl) {
            alert('[view_4_modal.js] Notification: Upload a file or paste a file URL first.');
            return;
        }

        const result = await insertVendorFile({
            vendor_id: vendor.id,
            file_type: detectFileType(fileName, fileUrl),
            file_label: value('vendorFileLabelInput') || fileName || 'Vendor file',
            file_name: fileName,
            file_url: fileUrl,
            storage_path: storagePath,
            notes: value('vendorFileNotesInput')
        });

        if (result.error) {
            alert(`[view_4_modal.js] Database Error: Could not save vendor file. ${result.error.message}`);
            return;
        }

        hideModal('vendorProfileFileModal');
        await refreshVendor();
    };

    byId('vendorSaveJobBtn').onclick = async () => {
        await saveVendorJobFromModal('vendor', { vendorId: vendor.id, refresh: refreshVendor });
    };

    document.querySelectorAll('[data-open-vendor-job]').forEach(button => {
        button.onclick = () => openVendorJob(button.dataset.openVendorJob);
    });
}

export function setupVendorJobDashboardEvents({ facility, job, project, files, followups, refreshJob, backVendor }) {
    byId('jobAddFollowupBtn').onclick = () => showModal('jobFollowupModal');
    byId('jobAddFileBtn').onclick = () => showModal('jobFileModal');
    byId('jobBackVendorBtn').onclick = () => backVendor();

    byId('closeJobFollowupModalBtn').onclick = () => hideModal('jobFollowupModal');
    byId('closeJobFileModalBtn').onclick = () => hideModal('jobFileModal');

    byId('saveJobFollowupBtn').onclick = async () => {
        const note = value('jobFollowupNoteInput');
        if (!note) {
            alert('[view_4_modal.js] Notification: Add a follow-up note first.');
            return;
        }

        const result = await insertVendorJobFollowup({
            vendor_job_id: job.id,
            followup_type: value('jobFollowupTypeInput') || 'note',
            followup_note: note,
            followup_by: value('jobFollowupByInput'),
            next_followup_date: value('jobNextFollowupDateInput'),
            completed: false
        });

        if (result.error) {
            alert(`[view_4_modal.js] Database Error: Could not save follow-up. ${result.error.message}`);
            return;
        }

        hideModal('jobFollowupModal');
        await refreshJob();
    };

    byId('saveJobFileBtn').onclick = async () => {
        const fileInput = byId('jobFileInput');
        const file = fileInput?.files?.[0] || null;
        const pastedUrl = value('jobFileUrlInput');
        let fileUrl = pastedUrl;
        let storagePath = '';
        let fileName = file?.name || '';

        if (file) {
            const upload = await uploadCabinetFile(file, `vendor-job-files/${job.id}`);
            if (upload.error) {
                alert(`[view_4_modal.js] Storage Error: Could not upload job file. ${upload.error.message}`);
                return;
            }
            fileUrl = upload.url;
            storagePath = upload.path;
        }

        if (!fileUrl) {
            alert('[view_4_modal.js] Notification: Upload a file or paste a file URL first.');
            return;
        }

        const result = await insertVendorJobFile({
            vendor_job_id: job.id,
            followup_id: value('jobFileFollowupSelect'),
            file_type: value('jobFileTypeInput') || detectFileType(fileName, fileUrl),
            file_name: fileName,
            file_url: fileUrl,
            storage_path: storagePath,
            notes: value('jobFileNotesInput'),
            uploaded_by: ''
        });

        if (result.error) {
            alert(`[view_4_modal.js] Database Error: Could not save job file. ${result.error.message}`);
            return;
        }

        hideModal('jobFileModal');
        await refreshJob();
    };

    byId('jobEmailCorporateBtn').onclick = () => {
        const body = buildCorporateEmailBody({ facility, job, project, files, followups });
        const subject = encodeURIComponent(`Vendor Job Report - ${job.job_title || 'Vendor Job'} - ${getVendorName(job.vendors)}`);
        window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
    };
}

async function saveVendorJobFromModal(prefix, options = {}) {
    const projectId = value(`${prefix}JobProjectSelect`);
    const vendorId = options.vendorId || value(`${prefix}JobVendorSelect`);
    const title = value(`${prefix}JobTitleInput`);

    if (!projectId) {
        alert('[view_4_modal.js] Notification: Select a facility project first.');
        return;
    }

    if (!vendorId) {
        alert('[view_4_modal.js] Notification: Select a vendor first.');
        return;
    }

    if (!title) {
        alert('[view_4_modal.js] Notification: Add a job title first.');
        return;
    }

    const imageInput = byId(`${prefix}JobImageInput`);
    const imageFile = imageInput?.files?.[0] || null;
    let imageUrl = '';
    let imagePath = '';

    if (imageFile) {
        const upload = await uploadCabinetFile(imageFile, `vendor-job-main/${vendorId}`);
        if (upload.error) {
            alert(`[view_4_modal.js] Storage Error: Could not upload main job image. ${upload.error.message}`);
            return;
        }
        imageUrl = upload.url;
        imagePath = upload.path;
    }

    const result = await insertProjectVendorJob({
        project_id: projectId,
        vendor_id: vendorId,
        job_title: title,
        estimated_amount: value(`${prefix}JobAmountInput`),
        job_status: value(`${prefix}JobStatusInput`) || 'open',
        job_scope: value(`${prefix}JobNotesInput`),
        notes: value(`${prefix}JobNotesInput`),
        main_image_url: imageUrl,
        main_image_path: imagePath,
        approval_status: 'pending'
    });

    if (result.error) {
        alert(`[view_4_modal.js] Database Error: Could not create vendor job. ${result.error.message}`);
        return;
    }

    hideModal(`${prefix}StartJobModal`);
    if (options.refresh) await options.refresh();
}

function buildCorporateEmailBody({ facility, job, project, files, followups }) {
    let body = '';
    body += `VENDOR JOB REPORT\n`;
    body += `Facility: ${facility.name || facility.Name || 'Facility'}\n`;
    body += `Project: ${getProjectTitle(project)}\n`;
    body += `Vendor: ${getVendorName(job.vendors)}\n`;
    body += `Job: ${job.job_title || ''}\n`;
    body += `Status: ${job.job_status || ''}\n`;
    body += `Estimated Amount: ${job.estimated_amount ? `$${Number(job.estimated_amount).toLocaleString()}` : ''}\n`;
    body += `Approval Status: ${job.approval_status || ''}\n`;
    body += `Scope: ${job.job_scope || ''}\n`;
    body += `Notes: ${job.notes || ''}\n\n`;

    body += `FOLLOW-UPS / TIMELINE\n`;
    if (!followups || followups.length === 0) {
        body += `No follow-ups saved yet.\n`;
    } else {
        followups.forEach((followup, index) => {
            body += `${index + 1}. ${followup.followup_type || 'note'} - ${followup.followup_date || ''}\n`;
            body += `${followup.followup_note || ''}\n`;
            if (followup.followup_by) body += `By: ${followup.followup_by}\n`;
            body += `\n`;
        });
    }

    body += `FILES / ATTACHMENTS\n`;
    if (!files || files.length === 0) {
        body += `No files saved yet.\n`;
    } else {
        files.forEach((file, index) => {
            body += `${index + 1}. ${file.file_type || 'file'} - ${file.file_name || file.notes || 'Attachment'}\n`;
            body += `${file.file_url || ''}\n\n`;
        });
    }

    return body;
}

function detectFileType(fileName, fileUrl) {
    const valueToCheck = `${fileName || ''} ${fileUrl || ''}`.toLowerCase();
    if (/\.(png|jpg|jpeg|webp|gif)/.test(valueToCheck)) return 'image';
    if (/invoice/.test(valueToCheck)) return 'invoice';
    if (/quote|estimate/.test(valueToCheck)) return 'quote';
    if (/approval/.test(valueToCheck)) return 'approval';
    if (/\.(pdf)/.test(valueToCheck)) return 'pdf';
    return 'file';
}

function showModal(id) {
    const modal = byId(id);
    if (modal) modal.style.display = 'flex';
}

function hideModal(id) {
    const modal = byId(id);
    if (modal) modal.style.display = 'none';
}

function value(id) {
    const el = byId(id);
    return el ? String(el.value || '').trim() : '';
}

function byId(id) {
    return document.getElementById(id);
}

/*================================================================
END FILE: view_4_modal.js
UPDATED: 2026-06-08 @ 10:45 PM
================================================================*/
