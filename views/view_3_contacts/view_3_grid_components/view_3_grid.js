/*================================================================
FACILITY_TRACKER_APP - CODEBASE EXECUTION PARAMETERS
================================================================
DESCRIPTION: Full file delivery with immediate DOM-existence binding fix.
================================================================*/
/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid.js
SUPABASE TBL : contacts
VIEW NAME    : Facility Directory
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-14 @ 06:45 PM
================================================================*/
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
            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-top:15px; text-align:center; padding:6px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; word-wrap:break-word; word-break:break-all; white-space:normal; overflow:hidden; }

            /* Associated Contextual Layout Elements */
            .contact-history-header { font-weight:bold; color:#00264d; font-size:12px; text-transform:uppercase; border-top:1px solid #e5e7eb; padding-top:15px; margin-top:15px; display:block; }
            .contact-history-container { margin-top:8px; display:flex; flex-direction:column; gap:8px; max-height:160px; overflow-y:auto; }
            .contact-history-item { background:white; border:1px solid #e5e7eb; padding:10px; border-radius:6px; font-size:13px; }
            .contact-history-title { font-weight:bold; color:#00264d; }
            .contact-history-meta { font-size:11px; color:#6b7280; margin-top:2px; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="contacts-view-container" id="mainContactsContainer">
            <div class="contacts-card-wrapper">
                
                <h1 class="contacts-view-title" id="viewHeaderTitle">Facility Directory</h1>
                <p class="contacts-view-subtitle" id="viewHeaderSubtitle">${facility?.name || ''}</p>

                <div id="directorySelectionLayout">
                    <button id="manualContactTriggerBtn" class="contacts-view-btn btn-emerald">➕ Add New Contact</button>
                    <div id="contactsGridElement" class="contacts-grid-layout">Loading...</div>
                </div>
                
                <div id="contactDetailPane" class="detail-view-card" style="pointer-events:auto;">
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
                    
                    <span class="contact-history-header">Reported Maintenance History</span>
                    <div id="contactIssuesHistoryList" class="contact-history-container">Loading logged history...</div>

                    <button id="closeDetailPaneBtn" class="contacts-view-btn btn-navy" style="margin-top:15px;">⬅️ Return to Directory</button>
                </div>

                <button id="backBtn" class="contacts-view-btn btn-navy" style="margin-top:15px;">⬅️ Back to Controls</button>

                <div class="view-build-stamp" id="viewBuildStampInfo">
                    File: views/view_3_contacts/view_3_grid_components/view_3_grid.js<br>Updated: 2026-06-14 06:45:00 PM
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
                    <input type="tel" id="manualContactPhone" class="form-field-input" inputmode="numeric" pattern="[0-9]*" autocomplete="tel">

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

    // Intercept navigation for reporting maintenance requests directly from profile view
    document.getElementById('profileAddIssueBtn').onclick = () => {
        const contactName = document.getElementById('detailName').textContent || '';
        if (window.navigateTo) {
            window.navigateTo('view_5_issues', { 
                facility: facility,
                openFormInstantly: true,
                prefilledReporterName: contactName !== 'Contact Profile' ? contactName : ''
            });
        }
    };

    // Initialize logic layer
    await initializeGridLogic({
        ...data,
        facility: facility,
        returnToView: returnToView,
        cachedIssueForm: cachedIssueForm
    });
}
