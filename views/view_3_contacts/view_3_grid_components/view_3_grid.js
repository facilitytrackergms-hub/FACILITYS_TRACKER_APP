/*================================================================
FACILITY_TRACKER_APP - CODEBASE EXECUTION PARAMETERS
================================================================
DESCRIPTION: The following parameters govern how the attached source 
code file must be processed, updated, and formatted upon output.

1. PROCESS COMPLIANCE: Apply all structural constraints outlined below during code modification.

2. MISSING METADATA HANDLING: If any fields in a FILE METADATA block are generic placeholders or missing, analyze the provided source code below to determine the correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly at the prompt text or comments for the exact sequential filename (e.g., view_2_data.js). NEVER invent, guess, or substitute a descriptive semantic name (like facility_data_service.js) based on the code context. If the exact filename cannot be verified, leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any parameters in this header block unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to make a fix work, explicitly state *why* in the text response before showing the code block.

7. CODE COMPLETENESS: Provide the full updated file or function so nothing gets omitted during formatting.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag identifying its source file, last update date, and time. If missing, add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of an existing file unless the current code is fully pasted into the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom notifications. Always add a distinct, visible ID or tag to the message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, including this parameter header, wrapped completely inside a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields in the active metadata block (File Name, Table, View, Title, Date, Time) are fully updated and preserved at the top of the file.

13. LINE COUNT CONSTRAINT & AUTOMATIC FILE SPLITTING (GIT-ALIGNED):
- Absolute Ceiling: The maximum allowable length for the entire single file is 350 lines to accommodate local editor line-wrapping and Git line-ending interpretations.
- Mandatory Pre-Check: BEFORE outputting any code block, the AI must explicitly print a "LINE COUNT AUDIT" in plain text containing: Raw Line Count (including this 53-line header), Git-Scaled Line Count (Raw x 1.5), and Split Decision Status.
- Empty Line & Wrap Accounting: When calculating the total line count, all empty lines, blank spacing, and visually wrapped or long string layout blocks must be accounted for using a 1.5x scaling margin to guarantee strict alignment with Git repositories.
- Split Trigger: The exact moment the total Git-Scaled Line Count reaches or exceeds 350 lines, processing MUST stop automatically. NO CODE BLOCK MAY BE GENERATED.
- Action Required: Explicitly flag the line count to the user, cite this constraint, and propose an even split plan aimed at creating two balanced files of approximately 175 lines each.
- User Confirmation: Wait for the user's explicit approval or division plan before outputting any code blocks.
================================================================*/
/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid.js
SUPABASE TBL : contacts
VIEW NAME    : Facility Directory
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-06 @ 05:32 PM
================================================================*/
const __FILENAME = 'view_3_grid.js';

import { initializeGridLogic } from './view_3_grid_logic.js';

export async function renderFacilityContacts(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    // Track active workflow session configurations
    const returnToView = data?.returnToView || null;
    const cachedIssueForm = data?.cachedIssueForm || null;

    const styles = `
        <style>
            .contacts-view-container { padding:20px; font-family:Arial; min-height:100vh; background:#f3f4f6; text-align:center; box-sizing:border-box; }
            .contacts-card-wrapper { max-width:500px; margin:0 auto; background:white; border-radius:12px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05); }
            .contacts-view-title { color:#00264d; font-size:24px; font-weight:bold; margin-bottom:5px; text-transform:uppercase; }
            .contacts-view-subtitle { color:#6b7280; font-size:14px; margin-bottom:20px; }
            .contacts-view-btn { width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px; text-transform:uppercase; box-sizing:border-box; }
            .btn-navy { background:#00264d; color:white; }
            .btn-emerald { background:#10b981; color:white; margin-bottom:12px; }
            .btn-gray { background:#9ca3af; color:white; }
            .btn-crimson { background:#dc2626; color:white; }
            .btn-amber { background:#f59e0b; color:white; }
            .contacts-grid-layout { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:12px; margin:20px 0; text-align:left; }
            .contact-thumbnail { background:white; border:1px solid #e5e7eb; padding:12px; border-radius:8px; cursor:pointer; text-align:center; transition:transform 0.15s ease; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; }
            .contact-thumbnail:hover { transform:translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .thumbnail-name { font-weight:bold; color:#00264d; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; margin-top:5px; }
            .thumbnail-role { font-size:12px; color:#6b7280; margin-top:2px; }
            
            /* Profile Panel Styles */
            .detail-view-card { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:20px; text-align:left; display:none; }
            .detail-row { margin-bottom:14px; font-size:15px; color:#4b5563; }
            .detail-label { font-weight:bold; color:#00264d; font-size:12px; text-transform:uppercase; display:block; margin-bottom:2px; }
            .detail-link { color:#10b981; text-decoration:none; font-weight:600; font-size:16px; }
            .detail-link:hover { text-decoration:underline; }
            .profile-actions-toolbar { display:flex; gap:8px; margin-bottom:15px; }
            .profile-actions-toolbar .contacts-view-btn { padding:8px 12px; font-size:12px; }

            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; max-height:90vh; overflow-y:auto; }
            .modal-shell-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; margin-bottom:15px; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-bottom:15px; text-align:center; padding:4px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="contacts-view-container" id="mainContactsContainer">
            <div class="contacts-card-wrapper">
                
                <h1 class="contacts-view-title" id="viewHeaderTitle">Facility Directory</h1>
                <p class="contacts-view-subtitle" id="viewHeaderSubtitle">${facility?.name || ''}</p>

                <div class="view-build-stamp" id="viewBuildStampInfo">
                    File: views/view_3_contacts/view_3_grid_components/view_3_grid.js<br>Updated: 2026-06-06 05:32:00 PM
                </div>

                <div id="directorySelectionLayout">
                    <button id="manualContactTriggerBtn" class="contacts-view-btn btn-emerald">➕ Add New Contact</button>
                    <div id="contactsGridElement" class="contacts-grid-layout">Loading...</div>
                    <button id="backBtn" class="contacts-view-btn btn-navy">⬅️ Back to Controls</button>
                </div>
                
                <div id="contactDetailPane" class="detail-view-card">
                    <div style="display:flex; justify-content:center; margin-bottom:15px;">
                        <img id="detailAvatar" src="" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid #e5e7eb;" />
                    </div>
                    <h3 id="detailName" style="margin:0 0 15px 0; text-align:center; color:#00264d; font-size:20px;">Contact Profile</h3>
                    
                    <div class="profile-actions-toolbar">
                        <button id="profileEditBtn" class="contacts-view-btn btn-amber">✏️ Edit</button>
                        <button id="profileDeleteBtn" class="contacts-view-btn btn-crimson">🗑️ Delete</button>
                        <button id="profileAddIssueBtn" class="contacts-view-btn btn-emerald" style="margin-bottom:0;">⚠️ Add Issue</button>
                    </div>

                    <div class="detail-row"><span class="detail-label">Role / Job Title</span><span id="detailRole"></span></div>
                    <div class="detail-row"><span class="detail-label">Direct Phone Line</span><a id="detailPhoneLink" class="detail-link" href=""></a></div>
                    <div class="detail-row"><span class="detail-label">Email Address</span><a id="detailEmailLink" class="detail-link" href=""></a></div>
                    <div class="detail-row"><span class="detail-label">Internal Operations Notes</span><span id="detailNotes"></span></div>
                    
                    <button id="closeDetailPaneBtn" class="contacts-view-btn btn-navy" style="margin-top:15px;">⬅️ Return to Directory</button>
                </div>
            </div>

            <div id="manualContactModal" class="modal-mask">
                <div class="modal-shell">
                    <h3 class="modal-shell-title" id="modalTemplateTitle">Create Directory Entry</h3>
                    <input type="hidden" id="editingContactId" value="">
                    <input type="hidden" id="manualContactImage" value="">
                    
                    <label class="form-field-label">Profile Photo</label>
                    <div style="display:flex; gap:10px; align-items:center; margin-top:4px; margin-bottom:8px;">
                        <button type="button" id="cameraTriggerBtn" class="contacts-view-btn btn-navy" style="margin:0; padding:10px; width:auto; white-space:nowrap;">📸 Open Camera</button>
                        <span id="cameraStatusText" style="font-size:11px; color:#6b7280; font-style:italic;">No photo captured</span>
                        <input type="file" id="manualContactImageFile" accept="image/*" capture="environment" style="display:none;">
                    </div>

                    <label class="form-field-label">Full Name</label>
                    <input type="text" id="manualContactName" class="form-field-input">

                    <label class="form-field-label">Job Title / Role</label>
                    <input type="text" id="manualContactRole" class="form-field-input">

                    <label class="form-field-label">Phone Number</label>
                    <input type="text" id="manualContactPhone" class="form-field-input">

                    <label class="form-field-label">Email Address</label>
                    <input type="email" id="manualContactEmail" class="form-field-input">

                    <label class="form-field-label">Operational Notes</label>
                    <input type="text" id="manualContactNotes" class="form-field-input">

                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="saveContactBtn" class="contacts-view-btn btn-navy">Save Entry</button>
                        <button id="cancelContactModalBtn" class="contacts-view-btn btn-gray">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize logic layer
    await initializeGridLogic({ facility, returnToView, cachedIssueForm });
}
