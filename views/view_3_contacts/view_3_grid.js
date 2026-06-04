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
                        <button id="triggerCameraBtn" class="contacts-view-btn btn-emerald" style="margin:0; width:auto; padding:10px 16px;">📸 Take Photo</button>
                        <span id="uploadStatusText" class="camera-status-text">No image captured</span>
                    </div>
                    <input type="hidden" id="manualContactImage" value="">

                    <label class="form-field-label">Internal Notes</label>
                    <textarea id="manualContactNotes" class="form-field-input" style="height:60px; resize:none;"></textarea>

                    <div class="form-action-group" style="display:flex; flex-direction:column; gap:8px; margin-top:20px;">
                        <button id="manualContactSaveBtn" class="contacts-view-btn btn-navy">Save Details</button>
                        <button id="manualContactCloseBtn" class="contacts-view-btn btn-gray">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupContactsEvents(facility, renderFacilityContacts);

    // SHORTCUT INTERCEPTOR: Automatically simulate the click if routed via validation check pipeline
    if (facility.openFormInstantly) {
        delete facility.openFormInstantly; // Clear the temporary intercept flag state context immediately
        const modalTrigger = document.getElementById('manualContactTriggerBtn');
        if (modalTrigger) {
            modalTrigger.click();
        }
    }

    async function loadContactsGridData() {
        if (!facility?.id) return;
        const grid = document.getElementById('contactsGridElement');
        if (!grid) return;
        
        const contacts = await fetchContacts(facility.id);
        grid.innerHTML = '';

        if (!contacts || contacts.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#9ca3af; font-size:13px; padding:10px;">No contacts found.</div>';
            return;
        }

        contacts.forEach(c => {
            const block = document.createElement('div');
            block.className = 'contact-thumbnail';
            
            const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || 'Staff')}&background=00264d&color=fff`;
            const avatarSrc = c.image_url || c.avatar_url || fallbackAvatar;
            
            // Filter dynamic issues belonging specifically to this individual by matching name fields
            const matchedIssues = rawIssues.filter(issue => 
                (issue.reported_by && String(issue.reported_by).toLowerCase().trim() === String(c.name).toLowerCase().trim()) ||
                (issue.initiated_by && String(issue.initiated_by).toLowerCase().trim() === String(c.name).toLowerCase().trim())
            );
            c.contact_issues = matchedIssues;
            const issueCount = matchedIssues.length;

            block.innerHTML = `
                ${issueCount > 0 ? `<span class="grid-issue-badge">⚠️ ${issueCount}</span>` : ''}
                <img src="${avatarSrc}" class="contact-avatar-frame" alt="avatar">
                <div class="thumbnail-name">${c.name || 'N/A'}</div>
                <div class="thumbnail-role">${c.role || 'Staff'}</div>
            `;
            block.onclick = () => showContactDetailPanel(c);
            grid.appendChild(block);
        });
    }

    function showContactDetailPanel(contact) {
        const panel = document.getElementById('activeContactDetailCard');
        const directoryLayout = document.getElementById('directorySelectionLayout');
        if (!panel) return;

        const phoneLink = contact.phone && contact.phone !== 'N/A'
            ? `<a href="tel:${contact.phone.replace(/[^0-9+]/g, '')}" style="color:#00264d; text-decoration:underline; font-weight:bold;">${contact.phone}</a>` 
            : 'N/A';
            
        const emailLink = contact.email 
            ? `<a href="mailto:${contact.email}" style="color:#00264d; text-decoration:underline; font-weight:bold;">${contact.email}</a>` 
            : 'N/A';

        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || 'Staff')}&background=00264d&color=fff`;
        const avatarSrc = contact.image_url || contact.avatar_url || fallbackAvatar;

        const issuesList = contact.contact_issues || [];
        let issuesMarkup = '';

        if (issuesList.length > 0) {
            issuesMarkup = `
                <div class="contacts-view-label" style="margin-top:15px; margin-bottom:6px;">Reported Issues</div>
                <div class="contact-issues-scrollbar-tray">
                    ${issuesList.map(issue => {
                        const statusClass = String(issue.status).toLowerCase() === 'open' || String(issue.status).toLowerCase() === 'active' ? 'tag-active' : 'tag-resolved';
                        const issueTitleText = issue.description || issue.title || `Issue #${issue.id || issue.issue_id}`;
                        return `
                            <button class="history-issue-nav-btn" data-issue-id="${issue.id || issue.issue_id || ''}">
                                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%;">${issueTitleText}</span>
                                <span class="status-indicator-tag ${statusClass}">${issue.status || 'OPEN'}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
        }

        panel.innerHTML = `
            <div style="display:flex; justify-content:center; width:100%;">
                <img src="${avatarSrc}" class="detail-avatar-frame" alt="Contact Photo">
            </div>
            
            <div class="contacts-view-label">Name</div>
            <div class="contacts-view-value">${contact.name || 'N/A'}</div>
            
            <div class="contacts-view-label">Role</div>
            <div class="contacts-view-value">${contact.role || 'N/A'}</div>
            
            <div class="contacts-view-label">Phone</div>
            <div class="contacts-view-value">${phoneLink}</div>
            
            <div class="contacts-view-label">Email</div>
            <div class="contacts-view-value">${emailLink}</div>
            
            <div class="contacts-view-label">Notes</div>
            <div class="contacts-view-value" style="font-size:13px; color:#4b5563; margin-bottom:12px;">${contact.notes || 'No notes added.'}</div>

            ${issuesMarkup}

            <div class="action-row">
                <button id="editContactBtn" class="contacts-view-btn btn-warning" style="width:23%; font-size:11px; padding:10px 2px;">✏️ Edit</button>
                <button id="newIssueContactBtn" class="contacts-view-btn btn-blue" style="width:29%; font-size:11px; padding:10px 2px;">➕ New Issue</button>
                <button id="closeContactDetailBtn" class="contacts-view-btn btn-gray" style="width:23%; font-size:11px; padding:10px 2px;">❌ Close</button>
                <button id="deleteContactBtn" class="contacts-view-btn btn-danger" style="width:23%; font-size:11px; padding:10px 2px;">🗑️ Delete</button>
            </div>
        `;
        
        if (directoryLayout) directoryLayout.style.display = 'none';
        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth' });

        panel.querySelectorAll('.history-issue-nav-btn').forEach(btn => {
            btn.onclick = () => {
                const targetIssueId = btn.getAttribute('data-issue-id');
                if (window.navigateTo) {
                    window.navigateTo('view_5_issues', { facility: facility, autoOpenIssue: targetIssueId });
                }
            };
        });

        document.getElementById('editContactBtn').onclick = () => openEditContactModal(contact);
        
        document.getElementById('newIssueContactBtn').onclick = () => {
            if (window.navigateTo) {
                window.navigateTo('view_5_issues', { facility: facility, preselectedContact: contact });
            }
        };

        document.getElementById('closeContactDetailBtn').onclick = () => {
            panel.style.display = 'none';
            if (directoryLayout) directoryLayout.style.display = 'block';
        };
        
        document.getElementById('deleteContactBtn').onclick = async () => {
            if (confirm(`Are you sure you want to remove ${contact.name}?`)) {
                const success = await deleteContact(contact.id);
                if (success) {
                    alert("Contact removed successfully.");
                    panel.style.display = 'none';
                    if (directoryLayout) directoryLayout.style.display = 'block';
                    renderFacilityContacts(facility);
                } else {
                    alert("Failed to delete contact.");
                }
            }
        };
    }

    await loadContactsGridData();
}
