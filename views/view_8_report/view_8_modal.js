/* =================================================
FILE: view_8_modal.js
UPDATED: 2026-06-01
================================================= */
import { fetchOperationalReport, fetchDailyReport } from './view_8_data.js';

export function openReportModal(reportType) {
    let existing = document.getElementById('reportModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; justify-content:center; align-items:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:24px; border-radius:12px; width:90%; max-width:700px; max-height:90%; overflow:auto;">
            <h2>${reportType === 'operational' ? 'Operational Report' : 'Daily Report'}</h2>
            <input type="date" id="reportDate" style="padding:8px; margin:12px 0; width:200px;">
            <button id="loadReportBtn" style="padding:8px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer; margin-left:8px;">Load</button>
            <button id="closeReportBtn" style="padding:8px 16px; background:#6b7280; color:white; border:none; border-radius:6px; cursor:pointer; float:right;">Close</button>
            <div id="reportContent" style="margin-top:12px;"></div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeReportBtn').onclick = () => modal.remove();

    document.getElementById('loadReportBtn').onclick = async () => {
        const date = document.getElementById('reportDate').value;
        if (!date) return alert('Please select a date.');

        const container = document.getElementById('reportContent');
        container.innerHTML = '<p>Loading report...</p>';

        let data = [];
        if (reportType === 'operational') {
            data = await fetchOperationalReport(date);
        } else {
            data = await fetchDailyReport(date);
        }

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No records found for this date.</p>';
            return;
        }

        container.innerHTML = '<ul style="list-style:none; padding-left:0;"></ul>';
        const ul = container.querySelector('ul');

        data.forEach(item => {
            const li = document.createElement('li');
            li.style.cssText = 'border-bottom:1px solid #ccc; padding:6px 0;';
            li.innerHTML = reportType === 'operational'
                ? `<strong>${item.issue_title}</strong> | Facility: ${item.related_facility} | Open: ${item.open_issue}`
                : `<strong>${item.issue_title}</strong> | Facility: ${item.related_facility} | Status: ${item.open_issue ? 'Open' : 'Closed'}`;
            ul.appendChild(li);
        });
    };
}
