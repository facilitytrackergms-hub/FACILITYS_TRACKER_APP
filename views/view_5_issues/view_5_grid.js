/*================================================================
AUTOMATED PATH UPDATE INSTRUCTION
================================================================
NEW ROOT DIRECTORY FOR COMPONENT:
FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_grid_components/   /*================================================================
FILE METADATA
================================================================
FILE NAME    : view_5_grid.js
SUPABASE TBL : facility_issues
VIEW NAME    : Maintenance Requests
POP-UP TITLE : Report Maintenance Issue
LAST UPDATED : 2026-06-07 @ 08:55 AM
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
const __FILENAME = 'view_5_grid.js';

import { fetchFacilityIssues, insertFacilityIssue } from './view_5_data.js';
import { openIssueModal, setupIssuesEvents } from './view_5_modal.js';
import { fetchContacts } from '../view_3_contacts/view_3_data.js';

export async function renderFacilityIssues(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;
    let localContactsCache = [];

    const styles = `
        <style>
            .issues-view-container { padding:20px; font-family:Arial; min-height:100vh; background:#f3f4f6; text-align:center; box-sizing:border-box; }
            .issues-card-wrapper { max-width:500px; margin:0 auto; background:white; border-radius:12px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05); }
            .issues-view-title { color:#00264d; font-size:24px; font-weight:bold; margin-bottom:5px; text-transform:uppercase; }
            .issues-view-subtitle { color:#6b7280; font-size:14px; margin-bottom:20px; }
            .issues-view-btn { width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px; text-transform:uppercase; box-sizing:border-box; }
            .btn-navy { background:#00264d; color:white; }
            .btn-emerald { background:#10b981; color:white; margin-bottom:12px; }
            .btn-gray { background:#9ca3af; color:white; }
            .issues-list-layout { margin:20px 0; text-align:left; display:flex; flex-direction:column; gap:10px; }
            .issue-list-item { background:#f9fafb; border:1px solid #e5e7eb; padding:15px; border-radius:8px; cursor:pointer; }
            .issue-list-item:hover { background:#f3f4f6; }
            .issue-list-title { font-weight:bold; color:#00264d; font-size:15px; }
            .issue-list-meta { font-size:12px; color:#6b7280; margin-top:4px; }
            
            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; max-height:90vh; overflow-y:auto; }
            .modal-shell-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; margin-bottom:15px; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-bottom:15px; text-align:center; padding:4px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; }

            .combobox-container { position:relative; display:block; width:100%; }
            .combobox-select-underlay { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; background:white; color:#111827; }
            .combobox-input-overlay { position:absolute; top:5px; left:1px; width:calc(100% - 32px); margin:0; padding:10px; border:none; border-radius:5px 0 0 5px; box-sizing:border-box; outline:none; font-size:13px; }

            .custom-confirm-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:100; padding:15px; }
            .custom-confirm-box { background:white; border-radius:10px; padding:20px; width:100%; max-width:360px; box-shadow:0 10px 20px rgba(0,0,0,0.15); text-align:center; }
            .custom-confirm-msg { font-size:14px; color:#374151; margin-bottom:20px; font-family:Arial, sans-serif; line-height:1.4; }
            .custom-confirm-actions { display:flex; gap:10px; justify-content:center; }
            .custom-confirm-btn { padding:10px 20px; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; min-width:80px; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="issues-view-container">
            <div class="issues-card-wrapper">
                <h1 class="issues-view-title">Maintenance Requests</h1>
                <p class="issues-view-subtitle">${facility?.name || ''}</p>

                <div class="view-build-stamp">
                    File: views/view_5_issues/view_5_grid.js<br>Updated: 2026-06-07 08:55:00 AM
                </div>

                <button id="addIssueTriggerBtn" class="issues-view-btn btn-emerald">➕ Create Maintenance Request</button>
                <div id="issuesListElement" class="issues-list-layout">Loading issues...</div>
                <button id="backToControlsBtn" class="issues-view-btn btn-navy">⬅️ Back to Controls</button>
            </div>

            <div id="issueFormModal" class="modal-mask">
                <div class="modal-shell">
                    <h3 class="modal-shell-title">Report Maintenance Issue</h3>
                    
                    <label class="form-field-label">Issue Title / Subject</label>
                    <input type="text" id="issueFormTitle" class="form-field-input" placeholder="e.g. Broken AC in Lounge">

                    <label class="form-field-label">Description / Details</label>
                    <textarea id="issueFormDesc" class="form-field-input" style="height:70px; resize:none;"></textarea>

                    <label class="form-field-label">Reported By</label>
                    <div class="combobox-container">
                        <select id="issueFormReporterSelect" class="combobox-select-underlay">
                            <option value=""></option>
                        </select>
                        <input type="text" id="issueFormReporter" class="combobox-input-overlay" placeholder="Your Full Name">
                    </div>

                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="submitIssueFormBtn" class="issues-view-btn btn-navy">Submit Request</button>
                        <button id="closeIssueFormBtn" class="issues-view-btn btn-gray">Cancel</button>
                    </div>
                </div>
            </div>

            <div id="issueModal" class="modal-mask">
                <div class="modal-shell">
                    <h3 id="issueModalTitle" class="modal-shell-title">Issue Dashboard</h3>

                    <input type="hidden" id="issueId" value="">
                    <input type="hidden" id="hiddenReporterName" value="">
                    <input type="hidden" id="hiddenReporterId" value="">

                    <label class="form-field-label">Issue Title / Subject</label>
                    <input type="text" id="issueTitleInput" class="form-field-input">

                    <label class="form-field-label">Description / Details</label>
                    <textarea id="issueDescInput" class="form-field-input" style="height:80px; resize:none;"></textarea>

                    <label class="form-field-label">Priority</label>
                    <select id="issuePriorityInput" class="form-field-input">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <label class="form-field-label">Status</label>
                    <select id="issueStatusInput" class="form-field-input">
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <div id="issue-image-container" style="margin-top:15px;"></div>

                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="saveIssueBtn" class="issues-view-btn btn-navy">Update Info</button>
                        <button id="deleteIssueRequestBtn" class="issues-view-btn btn-gray" style="display:none;">Delete Issue</button>
                        <button id="closeIssueModal" class="issues-view-btn btn-gray">Back to Issues</button>
                    </div>
                </div>
            </div>

            <div id="view_5_grid_contact_confirm_dialog" class="custom-confirm-mask">
                <div class="custom-confirm-box">
                    <div id="view_5_grid_confirm_message" class="custom-confirm-msg"></div>
                    <div class="custom-confirm-actions">
                        <button id="view_5_grid_confirm_yes" class="custom-confirm-btn btn-navy">Yes</button>
                        <button id="view_5_grid_confirm_no" class="custom-confirm-btn btn-gray">No</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('issueFormModal');
    const selectUnderlay = document.getElementById('issueFormReporterSelect');
    const textOverlay = document.getElementById('issueFormReporter');

    selectUnderlay.onchange = () => {
        if (selectUnderlay.value) {
            textOverlay.value = selectUnderlay.value;
        }
    };

    textOverlay.oninput = () => {
        selectUnderlay.value = "";
    };

    async function populateContactsDropdown() {
        if (!facility?.id) return;

        try {
            localContactsCache = await fetchContacts(facility.id);
        } catch (e) {
            console.error("Failed loading local contacts dependency layer:", e);
            localContactsCache = [];
        }

        selectUnderlay.innerHTML = '<option value=""></option>';

        if (Array.isArray(localContactsCache)) {
            localContactsCache.forEach(contact => {
                const nameValue = contact.contact_name || '';
                if (nameValue) {
                    const opt = document.createElement('option');
                    opt.value = nameValue;
                    opt.textContent = nameValue;
                    selectUnderlay.appendChild(opt);
                }
            });
        }
    }

    document.getElementById('addIssueTriggerBtn').onclick = async () => {
        document.getElementById('issueFormTitle').value = '';
        document.getElementById('issueFormDesc').value = '';
        textOverlay.value = '';
        selectUnderlay.value = '';
        await populateContactsDropdown();
        modal.style.display = 'flex';
    };

    document.getElementById('closeIssueFormBtn').onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', { facility: facility });
        }
    };

    function promptNewContactCreation(targetName) {
        return new Promise((resolve) => {
            const dialog = document.getElementById('view_5_grid_contact_confirm_dialog');
            const messageSlot = document.getElementById('view_5_grid_confirm_message');
            const yesBtn = document.getElementById('view_5_grid_confirm_yes');
            const noBtn = document.getElementById('view_5_grid_confirm_no');

            messageSlot.innerText = `"${targetName}" is not listed in the contacts for this facility. Would you like to add them as an established contact?`;
            dialog.style.display = 'flex';

            yesBtn.onclick = () => {
                dialog.style.display = 'none';
                resolve(true);
            };

            noBtn.onclick = () => {
                dialog.style.display = 'none';
                resolve(false);
            };
        });
    }

    document.getElementById('submitIssueFormBtn').onclick = async () => {
        const title = document.getElementById('issueFormTitle').value.trim();
        const desc = document.getElementById('issueFormDesc').value.trim();
        const reporter = textOverlay.value.trim();

        if (!title || !reporter) {
            alert("Subject and Reporter fields are required.");
            return;
        }

        const matchedContact = localContactsCache.find(c =>
            (c.contact_name || '').toLowerCase() === reporter.toLowerCase()
        );

        if (!matchedContact) {
            const shouldAdd = await promptNewContactCreation(reporter);

            if (shouldAdd && window.navigateTo) {
                window.navigateTo('view_3_contacts', {
                    facility: facility,
                    openFormInstantly: true,
                    prefilledContactName: reporter,
                    pendingIssueData: {
                        facility_id: facility.id,
                        title: title,
                        description: desc,
                        reported_by: reporter,
                        status: 'Open'
                    }
                });
                return;
            }
        }

        const inserted = await insertFacilityIssue({
            facility_id: facility.id,
            contact_id: matchedContact?.id || null,
            title: title,
            description: desc,
            reported_by: reporter,
            status: 'Open'
        });

        if (inserted) {
            modal.style.display = 'none';
            await loadIssuesListData();
        } else {
            alert("Could not register maintenance request data.");
        }
    };

    async function loadIssuesListData() {
        if (!facility?.id) return;

        const listElement = document.getElementById('issuesListElement');
        if (!listElement) return;

        const issues = await fetchFacilityIssues(facility.id);
        listElement.innerHTML = '';

        if (!issues || issues.length === 0) {
            listElement.innerHTML = '<div style="text-align:center; color:#9ca3af; font-size:14px; padding:20px;">No ongoing requests logged.</div>';
            return;
        }

        issues.forEach(issue => {
            const row = document.createElement('div');
            row.className = 'issue-list-item';

            row.innerHTML = `
                <div class="issue-list-title">${issue.title}</div>
                <div class="issue-list-meta">Status: <b>${issue.status || 'Open'}</b> | Reported by: ${issue.reported_by || 'Unknown'}</div>
            `;

            row.onclick = () => {
                openIssueModal(facility, issue);
            };

            listElement.appendChild(row);
        });
    }

    if (data?.openFormInstantly) {
        document.getElementById('issueFormTitle').value = '';
        document.getElementById('issueFormDesc').value = '';

        if (data?.prefilledReporterName) {
            textOverlay.value = data.prefilledReporterName;
            selectUnderlay.value = data.prefilledReporterName;
        }

        modal.style.display = 'flex';
    }

    setupIssuesEvents(facility, async () => {
        await renderFacilityIssues({ facility: facility });
    });

    await populateContactsDropdown();
    await loadIssuesListData();
}
