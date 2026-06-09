/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
SUPABASE TBL : facility_projects, project_actions, vendors, vendor_files, project_vendor_jobs, project_vendor_job_files, project_vendor_job_followups
VIEW NAME    : Facility Projects Dashboard
POP-UP TITLE : Create New Project / Add Project Action
LAST UPDATED : 2026-06-09 @ 01:20 AM
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
    insertProjectAction,
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
    const addProjectBtn = byId('cabinetAddProjectBtn');
    const addVendorBtn = byId('cabinetAddVendorBtn');
    const startVendorJobBtn = byId('cabinetStartVendorJobBtn');
    const closeProjectModalBtn = byId('closeProjectModalBtn');
    const closeVendorModalBtn = byId('closeVendorModalBtn');
    const closeJobModalBtn = byId('cabinetCloseJobModalBtn');
    const backBtn = byId('cabinetBackBtn');
    const saveProjectBtn = byId('saveProjectBtn');
    const saveVendorBtn = byId('saveVendorBtn');
    const saveJobBtn = byId('cabinetSaveJobBtn');

    if (addProjectBtn) {
        addProjectBtn.onclick = () => showModal('cabinetProjectModal');
    }

    if (addVendorBtn) {
        addVendorBtn.onclick = () => showModal('cabinetVendorModal');
    }

    if (startVendorJobBtn) {
        startVendorJobBtn.onclick = () => showModal('cabinetStartJobModal');
    }

    if (closeProjectModalBtn) {
        closeProjectModalBtn.onclick = () => hideModal('cabinetProjectModal');
    }

    if (closeVendorModalBtn) {
        closeVendorModalBtn.onclick = () => hideModal('cabinetVendorModal');
    }

    if (closeJobModalBtn) {
        closeJobModalBtn.onclick = () => hideModal('cabinetStartJobModal');
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (window.navigateTo) window.navigateTo('view_2_controls', facility);
        };
    }

    if (saveProjectBtn) {
        saveProjectBtn.onclick = async () => {
            const title = value('newProjectTitleInput');

            if (!title) {
                alert('[view_4_modal.js] Create Project Notice: Add a project name first.');
                return;
            }

            if (!facility || !facility.id) {
                alert('[view_4_modal.js] Create Project Error: Missing facility ID. Project was not saved.');
                return;
            }

            const result = await insertFacilityProject({
                facility_id: facility.id,
                project_name_text: title,
                project_title_text: title,
                notes: value('newProjectNotesInput'),
                active_status: true
            });

            if (result.error) {
                alert(`[view_4_modal.js] Database Error: Could not save project. ${result.error.message}`);
                return;
            }

            clearValue('newProjectTitleInput');
            clearValue('newProjectNotesInput');
            hideModal('cabinetProjectModal');

            if (refreshHome) await refreshHome();
        };
    }

    if (saveVendorBtn) {
        saveVendorBtn.onclick = async () => {
            const companyName = value('newVendorCompanyInput');

            if (!companyName) {
                alert('[view_4_modal.js] Vendor Notice: Add the vendor company name first.');
                return;
            }

            const imageInput = byId('newVendorImageInput');
            const imageFile = imageInput?.files?.[0] || null;
            let imageUrl = '';
            let imagePath = '';

            if (imageFile) {
                const upload = await uploadCabinetFile(imageFile, 'vendor-main-images');

                if (upload.error) {
                    alert(`[view_4_modal.js] Storage Error: Could not upload vendor image. ${upload.error.message}`);
                    return;
                }

                imageUrl = upload.url;
                imagePath = upload.path;
            }

            const result = await insertVendor({
                company_name: companyName,
                contact_name: value('newVendorContactInput'),
                phone: value('newVendorPhoneInput'),
                email: value('newVendorEmailInput'),
                website_url: value('newVendorWebsiteInput'),
                main_image_url: imageUrl,
                main_image_path: imagePath,
                notes: value('newVendorNotesInput'),
                status: 'active'
            });

            if (result.error) {
                alert(`[view_4_modal.js] Database Error: Could not save vendor. ${result.error.message}`);
                return;
            }

            hideModal('cabinetVendorModal');

            if (refreshHome) await refreshHome();
        };
    }

    if (saveJobBtn) {
        saveJobBtn.onclick = async () => {
            await saveVendorJobFromModal('cabinet', { refresh: refreshHome });
        };
    }

    document.querySelectorAll('[data-open-vendor]').forEach(button => {
        button.onclick = () => {
            if (openVendor) openVendor(button.dataset.openVendor);
        };
    });

    document.querySelectorAll('[data-open-vendor-job]').forEach(button => {
        button.onclick = () => {
            if (openVendorJob) openVendorJob(button.dataset.openVendorJob);
        };
    });
}

export function setupProjectDashboardEvents({ facility, project, refreshProject }) {
    const addActionBtn = byId('projectAddActionBtn');
    const closeActionBtn = byId('closeProjectActionModalBtn');
    const saveActionBtn = byId('saveProjectActionBtn');
    const actionModal = byId('projectActionModal');
    const actionNotice = byId('projectActionModalNotice');

    if (addActionBtn) {
        addActionBtn.onclick = () => {
            clearValue('projectActionTitleInput');
            clearValue('projectActionNotesInput');
            setProjectActionNotice('', false);
            showModal('projectActionModal');
        };
    }

    if (closeActionBtn) {
        closeActionBtn.onclick = () => {
            hideModal('projectActionModal');
            setProjectActionNotice('', false);
        };
    }

    if (actionModal) {
        actionModal.onclick = event => {
            if (event.target === actionModal) {
                hideModal('projectActionModal');
                setProjectActionNotice('', false);
            }
        };
    }

    if (saveActionBtn) {
        saveActionBtn.onclick = async () => {
            const actionTitle = value('projectActionTitleInput');
            const actionType = value('projectActionTypeInput') || 'note';
            const notes = value('projectActionNotesInput');

            if (!project || !project.id) {
                setProjectActionNotice('[view_4_modal.js] Project Action Error: Missing project ID. Action was not saved.', true);
                return;
            }

            if (!actionTitle && !notes) {
                setProjectActionNotice('[view_4_modal.js] Project Action Notice: Add an action title or notes first.', true);
                return;
            }

            const result = await insertProjectAction({
                project_id: project.id,
                action_type: actionType,
                action_title_text: actionTitle || actionType,
                notes,
                active_status: true
            });

            if (result.error) {
                setProjectActionNotice(`[view_4_modal.js] Database Error: Could not save project action. ${result.error.message}`, true);
                return;
            }

            clearValue('projectActionTitleInput');
            clearValue('projectActionNotesInput');
            hideModal('projectActionModal');
            setProjectActionNotice('', false);

            if (refreshProject) await refreshProject();
        };
    }

    function setProjectActionNotice(message, show) {
        if (!actionNotice) return;

        actionNotice.textContent = message || '';
        actionNotice.style.display = show ? 'block' : 'none';
    }
}

export function setupVendorDashboardEvents({ facility, vendor, projects, refreshVendor, backHome, openVendorJob }) {
    const addProfileFileBtn = byId('vendorAddProfileFileBtn');
    const startJobBtn = byId('vendorStartJobBtn');
    const backHomeBtn = byId('vendorBackHomeBtn');
    const closeFileBtn = byId('closeVendorFileModalBtn');
    const closeJobBtn = byId('vendorCloseJobModalBtn');
    const saveVendorFileBtn = byId('saveVendorFileBtn');
    const saveJobBtn = byId('vendorSaveJobBtn');

    if (addProfileFileBtn) {
        addProfileFileBtn.onclick = () => showModal('vendorProfileFileModal');
    }

    if (startJobBtn) {
        startJobBtn.onclick = () => showModal('vendorStartJobModal');
    }

    if (backHomeBtn) {
        backHomeBtn.onclick = () => {
            if (backHome) backHome();
        };
    }

    if (closeFileBtn) {
        closeFileBtn.onclick = () => hideModal('vendorProfileFileModal');
    }

    if (closeJobBtn) {
        closeJobBtn.onclick = () => hideModal('vendorStartJobModal');
    }

    if (saveVendorFileBtn) {
        saveVendorFileBtn.onclick = async () => {
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
                alert('[view_4_modal.js] Vendor File Notice: Upload a file or paste a file URL first.');
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

            if (refreshVendor) await refreshVendor();
        };
    }

    if (saveJobBtn) {
        saveJobBtn.onclick = async () => {
            await saveVendorJobFromModal('vendor', { vendorId: vendor.id, refresh: refreshVendor });
        };
    }

    document.querySelectorAll('[data-open-vendor-job]').forEach(button => {
        button.onclick = () => {
            if (openVendorJob) openVendorJob(button.dataset.openVendorJob);
        };
    });
}

export function setupVendorJobDashboardEvents({ facility, job, project, files, followups, refreshJob, backVendor }) {
    const addFollowupBtn = byId('jobAddFollowupBtn');
    const addFileBtn = byId('jobAddFileBtn');
    const backVendorBtn = byId('jobBackVendorBtn');
    const closeFollowupBtn = byId('closeJobFollowupModalBtn');
    const closeFileBtn = byId('closeJobFileModalBtn');
    const saveFollowupBtn = byId('saveJobFollowupBtn');
    const saveFileBtn = byId('saveJobFileBtn');
    const emailCorporateBtn = byId('jobEmailCorporateBtn');

    if (addFollowupBtn) {
        addFollowupBtn.onclick = () => showModal('jobFollowupModal');
    }

    if (addFileBtn) {
        addFileBtn.onclick = () => showModal('jobFileModal');
    }

    if (backVendorBtn) {
        backVendorBtn.onclick = () => {
            if (backVendor) backVendor();
        };
    }

    if (closeFollowupBtn) {
        closeFollowupBtn.onclick = () => hideModal('jobFollowupModal');
    }

    if (closeFileBtn) {
        closeFileBtn.onclick = () => hideModal('jobFileModal');
    }

    if (saveFollowupBtn) {
        saveFollowupBtn.onclick = async () => {
            const note = value('jobFollowupNoteInput');

            if (!note) {
                alert('[view_4_modal.js] Follow-up Notice: Add a follow-up note first.');
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

            if (refreshJob) await refreshJob();
        };
    }

    if (saveFileBtn) {
        saveFileBtn.onclick = async () => {
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
                alert('[view_4_modal.js] Job File Notice: Upload a file or paste a file URL first.');
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

            if (refreshJob) await refreshJob();
        };
    }

    if (emailCorporateBtn) {
        emailCorporateBtn.onclick = () => {
            const body = buildCorporateEmailBody({ facility, job, project, files, followups });
            const subject = encodeURIComponent(`Vendor Job Report - ${job.job_title || 'Vendor Job'} - ${getVendorName(job.vendors)}`);
            window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
        };
    }
}

async function saveVendorJobFromModal(prefix, options = {}) {
    const projectId = value(`${prefix}JobProjectSelect`);
    const vendorId = options.vendorId || value(`${prefix}JobVendorSelect`);
    const title = value(`${prefix}JobTitleInput`);

    if (!projectId) {
        alert('[view_4_modal.js] Vendor Job Notice: Select a facility project first.');
        return;
    }

    if (!vendorId) {
        alert('[view_4_modal.js] Vendor Job Notice: Select a vendor first.');
        return;
    }

    if (!title) {
        alert('[view_4_modal.js] Vendor Job Notice: Add a job title first.');
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

function clearValue(id) {
    const el = byId(id);
    if (el) el.value = '';
}

function byId(id) {
    return document.getElementById(id);
}

/*================================================================
END FILE: view_4_modal.js
UPDATED: 2026-06-09 @ 01:20 AM
================================================================*/
