/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_project_dashboard.js
SUPABASE TBL : facility_projects, project_actions
VIEW NAME    : Single Project Dashboard
POP-UP TITLE : Project Action Dashboard
LAST UPDATED : 2026-06-12 @ 06:45 AM
================================================================*/
const __FILENAME = 'view_4_project_dashboard.js';

import {
    fetchProjectActions,
    getProjectTitle
} from '../view_4_data.js';

import {
    setupProjectDashboardEvents
} from '../view_4_modal.js';

import {
    escapeHtml,
    renderProjectActionModal,
    renderProjectActions
} from './view_4_render_helpers.js';

import {
    renderStyles
} from './view_4_styles.js';

// Import supabase client if available globally, or look for it on the window object
const supabaseClient = window.supabase;

export async function renderSingleProjectDashboard({ facility, project }, nav) {
    const app = document.getElementById('app');

    if (!facility || !facility.id || !project || !project.id) {
        app.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_project_dashboard.js] Missing project dashboard context.</p>';
        return;
    }

    const actions = await fetchProjectActions(project.id);
    const facilityName = escapeHtml(facility.name || facility.Name || 'Facility');
    const projectTitle = escapeHtml(getProjectTitle(project));

    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">${projectTitle}</h1>
                <p class="vendor-cabinet-sub">${facilityName} · Project Dashboard</p>

                <div class="project-detail-box">
                    <div><strong>Project:</strong> ${projectTitle}</div>
                    <div><strong>Notes:</strong> ${escapeHtml(project.notes || '')}</div>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Project Action Dashboard</h2>

                    <input type="file" id="dashboardCameraInput" accept="image/*" capture="environment" style="display: none;" />

                    <div class="photo-buttons-row" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px; width: 100%;">
                        <button id="projectBeforePicBtn" class="cabinet-btn cabinet-btn-blue" style="margin: 0; padding: 12px 5px; font-size: 13px;">
                            1. 📸 BEFORE
                        </button>

                        <button id="projectDuringPicBtn" class="cabinet-btn cabinet-btn-blue" style="margin: 0; padding: 12px 5px; font-size: 13px;">
                            2. 📸 DURING
                        </button>

                        <button id="projectAfterPicBtn" class="cabinet-btn cabinet-btn-blue" style="margin: 0; padding: 12px 5px; font-size: 13px;">
                            3. 📸 AFTER
                        </button>
                    </div>

                    <div class="cabinet-action-grid">
                        <button id="projectStatusBtn" class="cabinet-btn cabinet-btn-blue">
                            4. 📌 Project Status
                        </button>

                        <button id="projectSpecialNotesBtn" class="cabinet-btn cabinet-btn-blue">
                            5. ⭐ Project Special Notes
                        </button>

                        <button id="projectSuppliesNeededBtn" class="cabinet-btn cabinet-btn-blue">
                            6. 🧰 Supplies / Parts Needed
                        </button>

                        <button id="projectVendorQuotesFilesBtn" class="cabinet-btn cabinet-btn-green">
                            7. 📄 Vendor Quotes / Files
                        </button>

                        <button id="projectCreateReportBtn" class="cabinet-btn cabinet-btn-blue">
                            8. 📋 Create Report
                        </button>

                        <button id="projectAddActionBtn" class="cabinet-btn cabinet-btn-green">
                            9. ➕ Create New Action Button
                        </button>

                        <button id="projectBackBtn" class="cabinet-btn cabinet-btn-gray">
                            10. ⬅️ Back to Projects
                        </button>
                    </div>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Project Actions</h2>
                    <div class="cabinet-stack">
                        ${renderProjectActions(actions)}
                    </div>
                </div>

                ${renderProjectActionModal()}

                <div id="uiTag_view_4_project_dashboard" class="ui-metadata-tag-view4">
                    Source: view_4_project_dashboard.js | Project Action Dashboard | Updated: 2026-06-12 06:45 AM
                </div>
            </div>
        </div>
    `;

    // --- Unified Camera & Database Upload Logic ---
    const cameraInput = document.getElementById('dashboardCameraInput');
    let activePhotoType = '';

    const handlePhotoSelection = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const targetBtnId = `project${activePhotoType}PicBtn`;
        const targetBtn = document.getElementById(targetBtnId);
        if (targetBtn) targetBtn.innerText = '⏳ UPLOADING...';

        try {
            let publicUrl = '';

            if (supabaseClient && supabaseClient.storage) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${project.id}/${activePhotoType.toLowerCase()}_${Date.now()}.${fileExt}`;
                const filePath = `project_images/${fileName}`;

                const { data: uploadData, error: uploadError } = await supabaseClient
                    .storage
                    .from('facility-assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabaseClient
                    .storage
                    .from('facility-assets')
                    .getPublicUrl(filePath);
                
                publicUrl = urlData?.publicUrl || '';
            } else {
                publicUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            }

            if (supabaseClient && supabaseClient.from) {
                const { error: dbError } = await supabaseClient
                    .from('project_actions')
                    .insert([{
                        project_id: project.id,
                        action_title: `${activePhotoType.toUpperCase()} Photo Captured`,
                        action_notes: `Captured snapshot from dashboard camera hardware.`,
                        file_url: publicUrl,
                        created_at: new Date().toISOString()
                    }]);

                if (dbError) throw dbError;
            }

            await renderSingleProjectDashboard({ facility, project }, nav);

        } catch (error) {
            console.error("Camera processing error:", error);
            alert(`Failed to store photo asset: ${error.message || error}`);
            await renderSingleProjectDashboard({ facility, project }, nav);
        }
    };

    if (cameraInput) {
        cameraInput.onchange = handlePhotoSelection;
    }

    const openCameraForType = (type) => {
        activePhotoType = type;
        if (cameraInput) {
            cameraInput.value = '';
            cameraInput.click();
        }
    };

    // --- Button Click Linkings ---
    const beforePicBtn = document.getElementById('projectBeforePicBtn');
    if (beforePicBtn) beforePicBtn.onclick = () => openCameraForType('Before');

    const duringPicBtn = document.getElementById('projectDuringPicBtn');
    if (duringPicBtn) duringPicBtn.onclick = () => openCameraForType('During');

    const afterPicBtn = document.getElementById('projectAfterPicBtn');
    if (afterPicBtn) afterPicBtn.onclick = () => openCameraForType('After');

    // Remaining Dashboard Navigation Links
    const backBtn = document.getElementById('projectBackBtn');
    if (backBtn) backBtn.onclick = () => nav.renderPendingProjects({ facility });

    const vendorBtn = document.getElementById('projectVendorQuotesFilesBtn');
    if (vendorBtn) vendorBtn.onclick = () => nav.renderVendorDashboard ? nav.renderVendorDashboard({ facility, project }) : alert('Vendor Quotes / Files clicked');

    const suppliesBtn = document.getElementById('projectSuppliesNeededBtn');
    if (suppliesBtn) suppliesBtn.onclick = () => nav.renderSuppliesDashboard ? nav.renderSuppliesDashboard({ facility, project }) : alert('Supplies / Parts Needed clicked');

    const statusBtn = document.getElementById('projectStatusBtn');
    if (statusBtn) statusBtn.onclick = () => nav.renderProjectStatus ? nav.renderProjectStatus({ facility, project }) : alert('Project Status clicked');

    const reportBtn = document.getElementById('projectCreateReportBtn');
    if (reportBtn) reportBtn.onclick = () => nav.renderCreateReport ? nav.renderCreateReport({ facility, project }) : alert('Create Report clicked');

    const specialNotesBtn = document.getElementById('projectSpecialNotesBtn');
    if (specialNotesBtn) specialNotesBtn.onclick = () => nav.renderSpecialNotes ? nav.renderSpecialNotes({ facility, project }) : alert('Project Special Notes clicked');

    const addActionBtn = document.getElementById('projectAddActionBtn');
    if (addActionBtn) addActionBtn.onclick = () => nav.renderAddAction ? nav.renderAddAction({ facility, project }) : alert('Create New Action clicked');

    setupProjectDashboardEvents({
        facility,
        project,
        refreshProject: () => renderSingleProjectDashboard({ facility, project }, nav)
    });
}
