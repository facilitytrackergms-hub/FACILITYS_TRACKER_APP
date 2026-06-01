/* =================================================
FILE: view_8_modal.js
UPDATED: 2026-06-01
================================================= */

export function openReportModal({ facility, type, data }) {
    const existing = document.getElementById('reportModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.5); z-index:1000; overflow:auto;
    `;

    let contentHTML = '';
    if (type === 'issues') {
        contentHTML = data.map(i => `<div style="margin-bottom:6px;">Issue: ${i.issue} | Tool: ${i.tool_required} | Notes: ${i.notes}</div>`).join('');
    } else if (type === 'projects') {
        contentHTML = data.map(p => `<div style="margin-bottom:6px;">Project: ${p.project_name} | Budget: ${p.budget} | Notes: ${p.notes}</div>`).join('');
    }

    modal.innerHTML = `
        <div style="background:white; padding:25px; border-radius:12px; width:90%; max-width:500px; text-align:left;">
            <h2>${facility.name} ${type.charAt(0).toUpperCase() + type.slice(1)} Report</h2>
            <div>${contentHTML}</div>
            <button id="closeReportModal" style="margin-top:12px; padding:10px 16px; border:none; border-radius:8px; background:#6b7280; color:white; cursor:pointer;">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeReportModal').onclick = () => modal.remove();
}
