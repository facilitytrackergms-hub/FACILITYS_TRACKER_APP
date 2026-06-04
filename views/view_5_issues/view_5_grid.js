/* =================================================
FILE: views/view_5_issues/view_5_grid.js
UPDATED: 2026-06-04 07:42:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchFacilityIssues } from './view_5_data.js';
import { setupIssuesEvents } from './view_5_modal.js';

export async function renderFacilityIssues(data) {
    const facility = data?.facility ? data.facility : data;
    
    // Check if we arrived here via a preselected contact request or a specific issue link
    let autoOpen = data?.autoOpenModal || false;
    let prefillData = data?.prefill || null;
    let autoOpenIssueId = data?.autoOpenIssue || null;
    const targetIssue = data?.targetIssue || null;

    if (data?.preselectedContact) {
        autoOpen = true;
        prefillData = {
            initiated_by: data.preselectedContact.name || ''
        };
    }

    // Attach cached workflow form properties if passing backward from an intercepted contact creation wizard context
    if (data?.cachedIssueForm) {
        facility.cachedIssueForm = data.cachedIssueForm;
    }

    // If an issue was explicitly clicked from the contact view, open it automatically
    if (targetIssue) {
        autoOpenIssueId = targetIssue.id || targetIssue.issue_id || null;
    }

    if (!facility || !facility.id) {
        console.error("Facility object is missing or invalid inside issue tracker view.");
        return;
    }

    const app = document.getElementById('app');

    const styles = `
        <style>
            .issues-container { padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing:border-box; }
            .issues-title { color:#00264d; font-size:22px; text-transform:uppercase; margin:0 0 5px 0; }
            .issues-subtitle { color:#4b5563; margin:0 0 25px 0; }
            .issues-stack { display:flex; flex-direction:column; gap:15px; max-width:400px; margin:0 auto; }
            .issue-btn { padding:15px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px; text-transform:uppercase; box-sizing:border-box; width:100%; }
            .issue-btn-navy { background:#00264d; }
            .issue-list { display:flex; flex-direction:column; gap:12px; margin-top:10px; text-align:left; }
            .issue-item-card { background:white; padding:15px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.04); position:relative; cursor:pointer; }
            .issue-item-title { font-weight:bold; color:#00264d; font-size:15px; padding-right:60px; }
            .issue-item-meta { font-size:12px; color:#6b7280; margin-top:4px; }
            .issue-item-status { position:absolute; top:15px; right:15px; font-size:11px; padding:3px 8px; border-radius:12px; font-weight:bold; text-transform:uppercase; }
            .status-open { background:#fef3c7; color:#d97706; }
            .status-closed { background:#d1fae5; color:#059669; }
            .status-pending { background:#e0f2fe; color:#0284c7; }
            
            /* Dialog Modal Overlay Sheets */
            .issue-modal-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; overflow-y:auto; padding:10px; box-sizing:border-box; }
            .issue-modal-shell { position:relative; background:white; padding:20px; border-radius:12px; width:100%; max-width:450px; margin:20px auto; text-align:left; box-shadow:0 10px 25px rgba(0,0,0,0.2); box-sizing:border-box; }
            .issue-modal-title { margin-top:0; color:#00264d; font-size:18px; font-weight:bold; border-bottom:2px solid #e5e7eb; padding-bottom:10px; }
            .issue-form-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; text-transform:uppercase; }
            .issue-form-field { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; font-family:Arial; font-size:14px; }
            
            /* Custom Alert Modal Window */
            .alert-mask { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:200; justify-content:center; align-items:center; }
            .alert-box { background:white; padding:25px; border-radius:10px; text-align:center; max-width:300px; width:90%; box-shadow:0 4px 15px rgba(0,0,0,0.2); }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="issues-container">
            
            <div style="background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 20px; display: inline-block; font-family: Arial, sans-serif;">
