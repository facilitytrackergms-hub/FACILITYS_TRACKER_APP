export async function renderProjectsHome(data, nav) {
    const facility = data?.facility ? data.facility : data;

    if (!facility || !facility.id) {
        console.error('[view_4_home.js] Facility context missing inside Facility Projects Dashboard.');
        const appMissing = document.getElementById('app');
        if (appMissing) {
            appMissing.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_home.js] Missing facility context.</p>';
        }
        return;
    }

    const app = document.getElementById('app');
    const facilityName = escapeHtml(facility.name || facility.Name || 'Facility');

    const [projects, vendors] = await Promise.all([
        fetchFacilityProjects(facility.id),
        fetchVendors()
    ]);

    app.innerHTML = `
        ${renderStyles()}
        <div class="vendor-cabinet-shell">
            <div class="vendor-cabinet-card">
                <h1 class="vendor-cabinet-title">${facilityName} Projects Dashboard</h1>
                <p class="vendor-cabinet-sub">Facility Projects</p>

                <div class="cabinet-action-grid single-action-grid">
                    <button id="cabinetAddProjectBtn" class="cabinet-btn cabinet-btn-green">➕ Create New Project</button>
                    <button id="cabinetBackBtn" class="cabinet-btn cabinet-btn-gray">⬅️ Back</button>
                </div>

                <div style="display:none;">
                    <button id="cabinetAddVendorBtn" type="button">Hidden Add Vendor</button>
                    <button id="cabinetStartVendorJobBtn" type="button">Hidden Start Vendor Job</button>
                </div>

                <div class="cabinet-section">
                    <h2 class="cabinet-section-title">Facility Projects</h2>
                    <div id="facilityProjectButtonGrid" class="project-button-grid">
                        ${renderProjectButtons(projects)}
                    </div>
                </div>

                ${renderHomeModals(projects, vendors)}
                ${renderDeleteProjectModal()}

                <div id="uiTag_view_4_home" class="ui-metadata-tag-view4">
                    Source: view_4_home.js | Facility Projects Dashboard | Updated: 2026-06-15 05:34 PM
                </div>
            </div>
        </div>
    `;

    // Global Event Delegation on 'app' to ensure dynamic buttons work
    app.onclick = (e) => {
        // Create Project Trigger
        if (e.target.id === 'cabinetAddProjectBtn') {
            const projectModal = document.getElementById('cabinetProjectModal');
            if (projectModal) {
                const titleInput = document.getElementById('cabinetProjectTitleInput');
                const notesInput = document.getElementById('cabinetProjectNotesInput');
                const noticeDiv = document.getElementById('cabinetProjectModalNotice');
                if (titleInput) titleInput.value = '';
                if (notesInput) notesInput.value = '';
                if (noticeDiv) noticeDiv.style.display = 'none';
                projectModal.style.display = 'block';
            }
        }

        // Back Button
        if (e.target.id === 'cabinetBackBtn') {
            if (window.navigateTo) window.navigateTo('view_1_facility');
        }

        // Project Tile Clicks
        const projectBtn = e.target.closest('[data-open-project]');
        if (projectBtn) {
            const projectId = projectBtn.dataset.openProject;
            const selectedProject = projects.find(p => String(p.id) === String(projectId));
            if (selectedProject) {
                if (nav && typeof nav.renderProjectDashboard === 'function') {
                    nav.renderProjectDashboard({ facility, project: selectedProject });
                }
            }
        }
    };

    // Initialize core modal events and delete buttons
    setupCabinetHomeEvents({
        facility,
        projects,
        vendors,
        refreshHome: () => nav?.renderPendingProjects ? nav.renderPendingProjects({ facility }) : window.location.reload(),
        openVendor: vendorId => nav.renderVendorDashboard({ facility, vendorId }),
        openVendorJob: vendorJobId => nav.renderVendorJobDashboard({ facility, vendorJobId })
    });

    bindProjectDeleteButtons(projects, facility, nav);
}
