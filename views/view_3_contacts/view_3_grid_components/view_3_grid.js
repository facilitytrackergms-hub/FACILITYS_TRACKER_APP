/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid.js
SUPABASE TBL : contacts
VIEW NAME    : Directory Layout Shell
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-07 @ 05:28 AM
================================================================*/

import { initializeGridLogic } from '/FACILITYS_TRACKER_APP/views/view_3_contacts/view_3_grid_components/view_3_grid_logic.js';

export async function renderFacilityContacts(context = {}) {
    const { facility, returnToView = null, cachedIssueForm = null } = context;
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="contacts-view-container">
            <div class="contacts-view-header">
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <div class="contacts-view-tag">Source: view_3_grid.js | Updated: 2026-06-07</div>
                    <h1 class="contacts-view-title">${facility?.name || 'Facility'} Directory</h1>
                </div>
                <div style="display:flex; gap:12px;">
                    <button id="addNewContactBtn" class="contacts-view-btn btn-navy">+ ADD NEW CONTACT</button>
                    <button id="backToControlsBtn" class="contacts-view-btn btn-gray">BACK TO CONTROLS</button>
                </div>
            </div>

            <div class="contacts-view-workspace">
                <div class="contacts-grid-panel">
                    <table class="contacts-data-table">
                        <thead>
                            <tr>
                                <th>Name Context</th>
                                <th>Operational Role</th>
                                <th>Phone Reference</th>
                                <th>Email Base</th>
                            </tr>
                        </thead>
                        <tbody id="contactsGridBody">
                            <tr><td colspan="4" style="text-align:center; padding:30px; color:#9ca3af;">Loading directory entries...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="contacts-detail-sidebar">
                    <div id="contactPanelPlaceholder" class="sidebar-placeholder">
                        <p>Select a contact row matrix path to investigate extended profile definitions.</p>
                    </div>
                    <div id="contactDetailPanel" class="sidebar-real-data" style="display:none;">
                        <div style="text-align:center; margin-bottom:20px;">
                            <img id="detailAvatar" class="profile-large-avatar" src="https://via.placeholder.com/90" alt="Avatar">
                            <h2 id="detailName" class="profile-detail-name">Contact Profile</h2>
                            <span id="detailRole" class="contact-role-pill">General Staff</span>
                        </div>
                        <div class="profile-meta-row">
                            <strong>Phone Number:</strong>
                            <p id="detailPhone">N/A</p>
                        </div>
                        <div class="profile-meta-row">
                            <strong>Email Address:</strong>
                            <p id="detailEmail">N/A</p>
                        </div>
                        <div class="profile-meta-row">
                            <strong>Extended Operational Metrics:</strong>
                            <p id="detailNotes">No extended internal operational summaries submitted.</p>
                        </div>
                        <div style="margin-top:24px; padding-top:20px; border-top:1px solid #e5e7eb;">
                            <button id="profileAddIssueBtn" class="contacts-view-btn btn-navy" style="width:100%;">REPORT MAINTENANCE REQUEST</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="contactFormModal" class="contacts-modal-overlay" style="display:none;">
                <div class="contacts-modal-window">
                    <h3 class="contacts-modal-title">Create Directory Entry</h3>
                    
                    <div style="text-align:center; margin-bottom:15px;">
                        <button id="cameraTriggerBtn" class="contacts-view-btn btn-gray" style="font-size:12px; padding:6px 12px;">📷 Activate Device Camera Capture Stream</button>
                        <input type="file" id="cameraFileInput" accept="image/*" capture="environment" style="display:none;">
                        <p id="cameraStatusText" style="font-size:11px; color:#9ca3af; margin-top:4px;">No capture stream active</p>
                        <input type="hidden" id="manualContactImageBase64">
                    </div>

                    <label class="form-field-label">Full Profile Tracker Name</label>
                    <input type="text" id="manualContactName" class="form-field-input" placeholder="e.g. John Doe">

                    <label class="form-field-label">Assigned Operational Role Title</label>
                    <input type="text" id="manualContactRole" class="form-field-input" placeholder="e.g. Chief Engineer">

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

    await initializeGridLogic({ facility, returnToView, cachedIssueForm });
}
