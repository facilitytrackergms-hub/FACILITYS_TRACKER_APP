/* =================================================
FILE: views/view_3_contacts/view_3_grid.js
UPDATED: 2026-06-04 07:55:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchContacts, deleteContact } from './view_3_data.js';
import { setupContactsEvents, openEditContactModal } from './view_3_modal.js';
import { fetchFacilityIssues } from '../view_5_issues/view_5_data.js';

export async function renderFacilityContacts(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    const styles = `
        <style>
            .contacts-view-container { padding:20px; font-family:Arial; min-height:100vh; background:#f3f4f6; text-align:center; box-sizing:border-box; }
            .contacts-card-wrapper { max-width:500px; margin:0 auto; background:white; border-radius:12px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05); }
            .contacts-view-title { color:#00264d; font-size:24px; font-weight:bold; margin-bottom:5px; text-transform:uppercase; }
            .contacts-view-subtitle { color:#6b7280; font-size:14px; margin-bottom:20px; }
            .contacts-view-detail-box { text-align:left; background:#f9fafb; padding:20px; border-radius:8px; border:1px solid #e5e7eb; margin-bottom:0px; position:relative; }
            .contacts-view-label { font-size:12px; font-weight:bold; color:#9ca3af; text-transform:uppercase; margin-bottom:2px; }
            .contacts-view-value { font-size:16px; color:#1f2937; margin-bottom:15px; font-weight:500; }
            .contacts-view-btn { width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px; text-transform:uppercase; box-sizing:border-box; }
            .btn-navy { background:#00264d; color:white; }
            .btn-emerald { background:#10b981; color:white; margin-bottom:12px; }
            .btn-gray { background:#9ca3af; color:white; }
            .btn-danger { background:#dc2626; color:white; margin-top:0; }
            .btn-warning { background:#f59e0b; color:white; margin-top:0; }
            .btn-blue { background:#0056b3; color:white; margin-top:0; }
            .contacts-grid-layout { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:12px; margin:20px 0; text-align:left; }
            .contact-thumbnail { background:white; border:1px solid #e5e7eb; padding:12px; border-radius:8px; cursor:pointer; text-align:center; transition:transform 0.15s ease; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; }
            .contact-thumbnail:hover { transform:translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .thumbnail-name { font-weight:bold; color:#00264d; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; margin-top:5px; }
            .thumbnail-role { font-size:12px; color:#6b7280; margin-top:2px; }
            .modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:50; padding:15px; }
            .modal-shell { background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.1); box-sizing:border-box; }
            .modal-shell-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; margin-bottom:15px; }
            .form-field-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .form-field-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            
            .contact-avatar-frame { width:70px; height:70px; border-radius:50%; object-fit:cover; background:#e5e7eb; border:2px solid #00264d; margin-bottom:8px; }
            .detail-avatar-frame { width:90px; height:90px; border-radius:50%; object-fit:cover; background:#e5e7eb; border:3px solid #00264d; margin-bottom:15px; display:block; }
            .action-row { display:flex; gap:6px; width:100%; justify-content:space-between; align-items:center; margin-top:15px; }
            
            /* Camera Row Layout Styles */
            .camera-action-row { display:flex; align-items:center; gap:12px; margin-top:6px; }
            .camera-status-text { font-size:13px; font-weight:500; color:#4b5563; }
            
            /* Grid Warning Badge */
            .grid-issue-badge { position:absolute; top:6px; right:6px; background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; font-size:10px; font-weight:bold; border-radius:4px; padding:2px 4px; line-height:1; }

            /* Scrollable Issue Tracker Log Styling */
            .contact-issues-scrollbar-tray { max-height:140px; overflow-y:auto; border:1px solid #e5e7eb; padding:8px; border-radius:8px; background:#ffffff; display:flex; flex-direction:column; gap:6px; margin-top:4px; margin-bottom:12px; }
            .history-issue-nav-btn { display:flex; justify-content:space-between; align-items:center; width:100%; text-align:left; border:1px solid #d1d5db; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-family:Arial, sans-serif; background:#f9fafb; font-weight:500; transition: background 0.15s; }
            .history-issue-nav-btn:hover { background:#f3f4f6; border-color:#9ca3af; }
            .status-indicator-tag { font-size:10px; font-weight:bold; text-transform:uppercase; padding:2px 6px; border-radius:4px; line-height:1; }
            .tag-active { background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; }
            .tag-resolved { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }
            
            /* Visual Stamp Styles */
            .view-build-stamp { font-size:11px; color:#9ca3af; font-family:monospace; margin-bottom:15px; text-align:center; padding:4px; background:#f9fafb; border-radius:6px; border:1px dashed #d1d5db; }
        </style>
    `;

    // Extract any pipeline properties from the route invocation object context safely
    if (data?.prefillContactName) {
        facility.prefillContactName = data.prefillContactName;
    }
    if (data?.returnToView) {
        facility.returnToView = data.returnToView;
    }
    if (data?.cachedIssueForm) {
        facility.cachedIssueForm = data.cachedIssueForm;
    }
    if (data?.openFormInstantly) {
        facility.openFormInstantly = data.openFormInstantly;
    }

    // Pre-fetch all issues upfront so we can reference them within both components smoothly
    let rawIssues = [];
    try {
        if (facility?.id) {
            rawIssues = await fetchFacilityIssues(facility.id);
        }
    } catch(e) {
        console.warn("Could not load companion issue markers for profile view cards:", e);
    }

    app.innerHTML = `
        ${styles}
        <div class="contacts-view-container" id="mainContactsContainer">
            <div class="contacts-card-wrapper">
                <h1 class="contacts-view-title" id="contactsTitleHeader">Facility Directory</h1>
                <p class="contacts-view-subtitle">${facility?.name || ''}</p>

                <div class="view-build-stamp">
                    File: views/view_3_contacts/view_3_grid.js<br>Updated: 2026-06-04 07:55:00 PM
                </div>

                <div id="activeContactDetailCard" style="display:none;" class="contacts-view-detail-box"></div>

                <div id="directorySelectionLayout">
                    <button id="manualContactTriggerBtn" class="contacts-view-btn btn-emerald">➕ Add New Contact</button>
                    
                    <div id="contactsGridElement" class="contacts-grid-layout">Loading...</div>

                    <button id="backBtn" class="contacts-view-btn btn-navy">⬅️ Back to Controls</button>
                </div>
            </div>

            <div id="manualContactModal" class="modal-mask">
                <div class="modal-shell">
                    <h3 class="modal-shell-title" id="modalTemplateTitle">Create Directory Entry</h3>
                    <input type="hidden" id="editingContactId" value="">
                    
                    <label class="form-field-label">Full Name</label>
                    <input type="text" id="manualContactName" class="form-field-input">

                    <label class="form-field-label">Job Title / Role</label>
                    <input type="text" id="manualContactRole" class="form-field-input">

                    <label class="form-field-label">Phone Number</label>
                    <input type="text" id="manualContactPhone" class="form-field-input">

                    <label class="form-field-label">Email Address</label>
                    <input type="email" id="manualContactEmail" class="form-field-input">

                    <label class="form-field-label">Contact Profile Picture</label>
                    <div class="camera-action-row">
                        <input type="file" id="manualContactFile" accept="image/*" capture="user" style="display:none;">
                        <button id="triggerCameraBtn" class="contacts-view-btn btn-emerald" style="margin:
