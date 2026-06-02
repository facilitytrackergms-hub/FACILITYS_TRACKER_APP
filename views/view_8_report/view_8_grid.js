/* =================================================
FILE: view_8_grid.js
UPDATED: 2026-06-01
================================================= */
import { fetchOperationalReport, fetchDailyReport } from './view_8_data.js';
import { openReportModal } from './view_8_modal.js';

export async function renderReports() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div style="text-align:center; margin-bottom:12px;">
            <button id="operationalReportBtn" style="padding:10px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer; margin-right:8px;">
                Operational Report
            </button>
            <button id="dailyReportBtn" style="padding:10px 16px; background:#3b82f6; color:white; border:none; border-radius:6px; cursor:pointer;">
                Daily Report
            </button>
        </div>
        <div id="reportContainer" style="margin-top:12px;"></div>
    `;

    document.getElementById('operationalReportBtn').onclick = () => openReportModal('operational');
    document.getElementById('dailyReportBtn').onclick = () => openReportModal('daily');
}
