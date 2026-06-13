/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_report_builder.js
PATH         : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_action_dashboards/view_4_report_builder.js
VIEW NAME    : Project Report Builder
POP-UP TITLE : Report Builder
LAST UPDATED : 2026-06-13
================================================================*/
const __FILENAME = 'view_4_report_builder.js';

export function renderProjectReportBuilderView({ facility, project }, nav) {
    const app = document.getElementById('app');
    if (!app) return;

    const projectName =
        project?.project_title_text ||
        project?.project_name_text ||
        project?.title ||
        'Untitled Project';

    app.innerHTML = `
        <div style="padding:20px;max-width:700px;margin:0 auto;">

            <h2 style="margin-bottom:20px;">
                Report Builder
            </h2>

            <div style="
                background:#f8f9fa;
                border:1px solid #ddd;
                border-radius:8px;
                padding:15px;
                margin-bottom:20px;
            ">
                <div><strong>Project:</strong> ${projectName}</div>
                <div><strong>Facility:</strong> ${facility?.name || ''}</div>
            </div>

            <h3>Select Report Type</h3>

            <div style="display:grid;gap:12px;margin-top:20px;">

                <button id="btnStartReport"
                    class="cabinet-btn cabinet-btn-blue"
                    style="padding:16px;">
                    1. PROJECT START REPORT
                </button>

                <button id="btnFollowupReport"
                    class="cabinet-btn cabinet-btn-blue"
                    style="padding:16px;">
                    2. FOLLOW-UP REPORT
                </button>

                <button id="btnCompletionReport"
                    class="cabinet-btn cabinet-btn-blue"
                    style="padding:16px;">
                    3. PROJECT COMPLETION REPORT
                </button>

            </div>

            <div style="margin-top:30px;">
                <button id="btnBackProjectDashboard"
                    class="cabinet-btn cabinet-btn-gray"
                    style="padding:14px;">
                    ← Back To Project Dashboard
                </button>
            </div>

            <div style="
                margin-top:25px;
                font-size:10px;
                color:#999;
                text-align:center;
            ">
                Source: view_4_report_builder.js
            </div>

        </div>
    `;

    document.getElementById('btnStartReport').onclick = () => {
        if (nav?.renderPhotoDashboard) {
            nav.renderPhotoDashboard({
                facility,
                project,
                reportType: 'start',
                photoType: 'Before',
                dashboardTitle: 'BEFORE Pictures'
            });
        }
    };

    document.getElementById('btnFollowupReport').onclick = () => {
        if (nav?.renderPhotoDashboard) {
            nav.renderPhotoDashboard({
                facility,
                project,
                reportType: 'followup',
                photoType: 'During',
                dashboardTitle: 'DURING Pictures'
            });
        }
    };

    document.getElementById('btnCompletionReport').onclick = () => {
        if (nav?.renderPhotoDashboard) {
            nav.renderPhotoDashboard({
                facility,
                project,
                reportType: 'completion',
                photoType: 'After',
                dashboardTitle: 'AFTER Pictures'
            });
        }
    };

    document.getElementById('btnBackProjectDashboard').onclick = () => {
        if (nav?.renderProjectDashboard) {
            nav.renderProjectDashboard({
                facility,
                project
            });
        }
    };
}

/*================================================================
END FILE: view_4_report_builder.js
================================================================*/
