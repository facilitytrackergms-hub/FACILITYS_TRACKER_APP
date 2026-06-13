/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_report_builder.js
PATH         : FACILITYS_TRACKER_APP/views/view_4_projects/view_4_action_dashboards/view_4_report_builder.js
VIEW NAME    : Project Report Builder
POP-UP TITLE : Report Builder
LAST UPDATED : 2026-06-13 @ 12:00 PM
================================================================*/
const __FILENAME = 'view_4_report_builder.js';

export function renderProjectReportBuilderView({ facility, project }, nav) {
    const app = document.getElementById('app');
    if (!app) return;

    const projectName =
        project?.project_title_text ||
        project?.project_name_text ||
        project?.project_name ||
        project?.title ||
        'Untitled Project';

    const facilityName =
        facility?.name ||
        facility?.Name ||
        'Facility';

    app.innerHTML = `
        <div style="padding:20px;max-width:720px;margin:0 auto;text-align:center;">

            <h1 style="font-size:36px;color:#003366;margin-bottom:22px;">
                Report Builder
            </h1>

            <div style="
                background:#f8f9fa;
                border:1px solid #d6dbe1;
                border-radius:14px;
                padding:20px;
                margin-bottom:28px;
                font-size:20px;
                line-height:1.5;
                box-shadow:0 2px 6px rgba(0,0,0,0.08);
            ">
                <div><strong>Project:</strong> ${projectName}</div>
                <div><strong>Facility:</strong> ${facilityName}</div>
            </div>

            <h2 style="font-size:28px;color:#003366;margin-bottom:20px;">
                Select Report Type
            </h2>

            <div style="display:grid;gap:16px;margin-top:20px;">

                <button id="btnStartReport" class="report-builder-btn">
                    1. PROJECT START REPORT
                </button>

                <button id="btnFollowupReport" class="report-builder-btn">
                    2. FOLLOW-UP REPORT
                </button>

                <button id="btnCompletionReport" class="report-builder-btn">
                    3. PROJECT COMPLETION REPORT
                </button>

            </div>

            <div style="margin-top:34px;">
                <button id="btnBackProjectDashboard" class="report-builder-back-btn">
                    ← BACK TO PROJECT DASHBOARD
                </button>
            </div>

            <style>
                .report-builder-btn {
                    width: 100%;
                    min-height: 82px;
                    border: none;
                    border-radius: 14px;
                    background: #003366;
                    color: #ffffff;
                    font-size: 22px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    box-shadow: 0 6px 0 #001f3f;
                    transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.12s ease;
                }

                .report-builder-btn:hover {
                    background: #004b8d;
                    box-shadow: 0 0 18px rgba(0, 75, 141, 0.45), 0 6px 0 #001f3f;
                }

                .report-builder-btn:active {
                    transform: translateY(5px);
                    box-shadow: 0 1px 0 #001f3f;
                    background: #0057a8;
                }

                .report-builder-back-btn {
                    width: 100%;
                    max-width: 520px;
                    min-height: 70px;
                    border: none;
                    border-radius: 14px;
                    background: #6b7280;
                    color: #ffffff;
                    font-size: 20px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 5px 0 #4b5563;
                    transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.12s ease;
                }

                .report-builder-back-btn:hover {
                    background: #7b8492;
                    box-shadow: 0 0 16px rgba(107, 114, 128, 0.45), 0 5px 0 #4b5563;
                }

                .report-builder-back-btn:active {
                    transform: translateY(4px);
                    box-shadow: 0 1px 0 #4b5563;
                }
            </style>

            <div style="
                margin-top:28px;
                font-size:12px;
                color:#999;
                text-align:center;
            ">
                Source: view_4_report_builder.js | Updated: 2026-06-13 @ 12:00 PM
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
                dashboardTitle: 'BEFORE Pictures',
                isFromReport: true
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
                dashboardTitle: 'DURING Pictures',
                isFromReport: true
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
                dashboardTitle: 'AFTER Pictures',
                isFromReport: true
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
