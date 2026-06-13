/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_report_builder.js
PATH         : /FACILITYS_TRACKER_APP/views/view_4_projects/view_4_grid_components/view_4_report_builder.js
SUPABASE TBL : facility_projects, project_actions
VIEW NAME    : Project Execution Report Builder
POP-UP TITLE : None (Full-Screen View View Component)
LAST UPDATED : 2026-06-12 @ 08:20 PM
================================================================*/
const __FILENAME = 'view_4_report_builder.js';

import { getProjectTitle } from '../view_4_data.js';
import { escapeHtml } from './view_4_render_helpers.js';

/**
 * Renders the full Report Builder View for Button Number 8
 * @param {Object} context - Object containing the current active facility and project data model context.
 * @param {Object} nav - Navigation router object containing application dashboard redirect hook functions.
 */
export function renderProjectReportBuilderView({ facility, project }, nav) {
    const app = document.getElementById('app');
    if (!app) return;

    // Pull property information fields dynamically from the context framework
    const facilityName = escapeHtml(facility?.name || facility?.Name || 'Facility Name');
    const facilityAddress = escapeHtml(facility?.address || facility?.Address || 'No Address Data Provided');
    const facilityPhone = escapeHtml(facility?.phone || facility?.Phone || 'No Phone Data Provided');
    const projectTitle = escapeHtml(getProjectTitle(project || {}));
    
    // Automatically capture the current date string
    const currentDateString = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    app.innerHTML = `
        <div class="vendor-cabinet-shell" style="padding: 20px;">
            <div class="vendor-cabinet-card" style="background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto;">
                
                <div style="display: flex; justify-content: space-between; gap: 15px; margin-bottom: 25px;">
                    <button id="rptTextBtn" class="cabinet-btn cabinet-btn-blue" style="flex: 1; padding: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase; margin: 0;">
                        💬 Text Report
                    </button>
                    <button id="rptEmailBtn" class="cabinet-btn cabinet-btn-blue" style="flex: 1; padding: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase; margin: 0;">
                        ✉️ Email Report
                    </button>
                </div>

                <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 8px; margin-top: 0; font-size: 22px;">Project Report Builder</h2>
                
                <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 15px; margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
                    <h4 style="margin: 0 0 8px 0; color: #495057; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">Property & Context Information</h4>
                    <div><strong>Facility Name:</strong> ${facilityName}</div>
                    <div><strong>Address:</strong> ${facilityAddress}</div>
                    <div><strong>Phone Number:</strong> ${facilityPhone}</div>
                    <div><strong>Project Name:</strong> ${projectTitle}</div>
                    <div><strong>Date Created:</strong> ${currentDateString}</div>
                </div>

                <div style="margin-bottom: 25px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 6px; color: #333; font-size: 14px;">Type of Report</label>
                    <select id="rptTypeSelector" class="cabinet-input" style="width: 100%; padding: 10px; margin-bottom: 18px; border: 1px solid #ccc; border-radius: 4px; background: white; font-size: 14px; height: 40px;">
                        <option value="Project Start Report">Project Start Report</option>
                        <option value="Update Report" selected>Update Report</option>
                        <option value="Project Finish Report">Project Finish Report</option>
                    </select>

                    <label style="display: block; font-weight: bold; margin-bottom: 6px; color: #333; font-size: 14px;">Discussion of the Project</label>
                    <textarea id="rptDiscussionInput" class="cabinet-textarea" style="width: 100%; padding: 10px; height: 110px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; resize: vertical;" placeholder="Provide report discussion notes here (e.g., The door is broken, we are going to have to buy a new door...)"></textarea>
                </div>

                <h3 style="color: #003366; font-size: 16px; margin: 25px 0 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Linked Project Dashboards</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 25px;">
                    <button id="rptGoBeforeBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 12px 5px; margin: 0;">1. 📸 BEFORE PICTURES</button>
                    <button id="rptGoDuringBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 12px 5px; margin: 0;">2. 📸 DURING PICTURES</button>
                    <button id="rptGoAfterBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 12px 5px; margin: 0;">3. 📸 AFTER PICTURES</button>
                    <button id="rptGoStatusBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 12px 5px; margin: 0;">4. 📌 PROJECT STATUS</button>
                    <button id="rptGoNotesBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 12px 5px; margin: 0;">5. ⭐ SPECIAL NOTES</button>
                    <button id="rptGoSuppliesBtn" class="cabinet-btn cabinet-btn-blue" style="font-size: 12px; padding: 12px 5px; margin: 0;">6. 🧰 SUPPLIES & PARTS</button>
                    <button id="rptGoQuotesBtn" class="cabinet-btn cabinet-btn-green" style="grid-column: span 2; font-size: 12px; padding: 12px 5px; margin: 0;">7. 📄 VENDOR CODE FILES / QUOTES</button>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                    <button id="rptBackToDashboardBtn" class="cabinet-btn cabinet-btn-gray" style="padding: 10px 20px; font-size: 14px; margin: 0;">
                        ⬅️ 10. Back to Project Dashboard
                    </button>
                </div>

                <div id="uiTag_view_4_report_builder" class="ui-metadata-tag-view4" style="margin-top: 20px; font-size: 10px; color: #bbb; text-align: center;">
                    Source: view_4_report_builder.js | Report Context Module | Updated: 2026-06-12 08:20 PM
                </div>
            </div>
        </div>
    `;

    // --- Core Action Transmission Dispatchers ---
    document.getElementById('rptTextBtn').onclick = () => {
        const type = document.getElementById('rptTypeSelector').value;
        const discussion = document.getElementById('rptDiscussionInput').value;
        alert(`[Text Dispatch Outbound]\nType: ${type}\nTo Phone: ${facilityPhone}\n\nDiscussion:\n${discussion || '(No content)'}`);
    };

    document.getElementById('rptEmailBtn').onclick = () => {
        const type = document.getElementById('rptTypeSelector').value;
        const discussion = document.getElementById('rptDiscussionInput').value;
        alert(`[Email Dispatch Outbound]\nType: ${type}\nProperty: ${facilityName}\n\nDiscussion:\n${discussion || '(No content)'}`);
    };

    // --- Back Navigation Link ---
    document.getElementById('rptBackToDashboardBtn').onclick = () => {
        if (window.renderSingleProjectDashboard) {
            window.renderSingleProjectDashboard({ facility, project }, nav);
        } else {
            alert('Navigation routing failed: window.renderSingleProjectDashboard is not active.');
        }
    };

    // --- Cross Navigation Functional Deep Routing Links ---
    const routeSafely = (navMethod, debugLabel) => {
        if (nav && nav[navMethod]) {
            nav[navMethod]({ facility, project });
        } else {
            alert(`Navigation route configuration for "${debugLabel}" is missing on global app router object wrapper context.`);
        }
    };

    document.getElementById('rptGoBeforeBtn').onclick = () => {
        if (nav && nav.renderPhotoDashboard) {
            nav.renderPhotoDashboard({ facility, project, photoType: 'Before', dashboardTitle: 'BEFORE Photo Dashboard' });
        } else {
            alert('Photo Dashboard Navigation state mapping is missing.');
        }
    };

    document.getElementById('rptGoDuringBtn').onclick = () => {
        if (nav && nav.renderPhotoDashboard) {
            nav.renderPhotoDashboard({ facility, project, photoType: 'During', dashboardTitle: 'DURING Photo Dashboard' });
        } else {
            alert('Photo Dashboard Navigation state mapping is missing.');
        }
    };

    document.getElementById('rptGoAfterBtn').onclick = () => {
        if (nav && nav.renderPhotoDashboard) {
            nav.renderPhotoDashboard({ facility, project, photoType: 'After', dashboardTitle: 'AFTER Photo Dashboard' });
        } else {
            alert('Photo Dashboard Navigation state mapping is missing.');
        }
    };

    document.getElementById('rptGoStatusBtn').onclick = () => routeSafely('renderProjectStatus', '4. Project Status');
    document.getElementById('rptGoNotesBtn').onclick = () => routeSafely('renderSpecialNotes', '5. Project Special Notes');
    document.getElementById('rptGoSuppliesBtn').onclick = () => routeSafely('renderSuppliesDashboard', '6. Supplies Needed');
    document.getElementById('rptGoQuotesBtn').onclick = () => routeSafely('renderVendorDashboard', '7. Vendor Quotes/Files');
}
