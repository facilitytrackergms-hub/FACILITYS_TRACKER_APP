/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_grid.js
SUPABASE TBL : facility_projects
VIEW NAME    : Project Assessment Report
POP-UP TITLE : Project Assessment Entry
LAST UPDATED : 2026-06-08 @ 09:20 PM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_4_grid.js';

import { fetchFacilityProjects, loadLocalProjectReport } from './view_4_data.js';
import { setupProjectsEvents } from './view_4_modal.js';

export async function renderPendingProjects(data) {
    const facility = data?.facility ? data.facility : data;

    if (!facility || !facility.id) {
        console.error('[view_4_grid.js] Facility context missing inside project assessment view.');
        const appMissing = document.getElementById('app');
        if (appMissing) {
            appMissing.innerHTML = '<p style="color:red; text-align:center; padding:20px;">[view_4_grid.js] Missing facility context.</p>';
        }
        return;
    }

    const app = document.getElementById('app');
    const facilityName = escapeHtml(facility.name || facility.Name || 'Facility');
    const localReport = loadLocalProjectReport(facility.id);

    const styles = `
        <style>
            .project-report-container { position:relative; padding:18px; font-family:Arial, sans-serif; background:#f3f4f6; min-height:100vh; box-sizing:border-box; padding-bottom:70px; }
            .project-report-card { max-width:760px; margin:0 auto; background:white; border-radius:14px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
            .project-report-title { color:#00264d; font-size:22px; text-align:center; margin:0 0 4px 0; text-transform:uppercase; }
            .project-report-facility { color:#4b5563; text-align:center; font-size:14px; margin:0 0 18px 0; }
            .project-report-label { display:block; font-size:12px; font-weight:bold; color:#374151; margin-top:12px; text-transform:uppercase; }
            .project-report-input { width:100%; padding:11px; margin-top:5px; border:1px solid #d1d5db; border-radius:8px; box-sizing:border-box; font-size:14px; }
            .project-report-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px; }
            .project-report-btn { border:none; border-radius:8px; padding:13px; font-weight:bold; cursor:pointer; color:white; background:#00264d; font-size:13px; text-transform:uppercase; }
            .project-report-btn-green { background:#28a745; }
            .project-report-btn-gray { background:#6b7280; }
            .project-report-btn-red { background:#b91c1c; }
            .project-report-btn-full { grid-column:1 / -1; }
            .project-report-section-list { margin-top:18px; display:flex; flex-direction:column; gap:12px; }
            .assessment-card { border:1px solid #d1d5db; border-left:5px solid #00264d; border-radius:10px; padding:14px; background:#ffffff; }
            .assessment-title { color:#00264d; font-size:17px; font-weight:bold; margin-bottom:8px; }
            .assessment-line { font-size:13px; color:#374151; margin:5px 0; line-height:1.4; }
            .assessment-line strong { color:#111827; }
            .assessment-images { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
            .assessment-images img { width:90px; height:90px; object-fit:cover; border-radius:8px; border:1px solid #d1d5db; }
            .assessment-small-btn { margin-top:10px; padding:8px 10px; border:none; border-radius:7px; background:#b91c1c; color:white; font-size:12px; font-weight:bold; cursor:pointer; }
            .project-empty-state { text-align:center; color:#6b7280; background:#f9fafb; padding:15px; border-radius:10px; font-size:13px; border:1px dashed #d1d5db; }
            .project-history-box { margin-top:18px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:12px; }
            .project-history-title { font-size:13px; font-weight:bold; color:#00264d; margin-bottom:8px; text-transform:uppercase; }
            .project-history-row { font-size:12px; color:#4b5563; padding:6px 0; border-top:1px solid #e5e7eb; }
            .project-modal-backdrop { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.45); justify-content:center; align-items:flex-start; z-index:40; padding:18px; overflow:auto; }
            .project-modal-body { background:white; padding:18px; border-radius:12px; width:100%; max-width:440px; text-align:left; box-shadow:0 4px 16px rgba(0,0,0,0.18); box-sizing:border-box; margin-top:20px; }
            .project-modal-heading { color:#00264d; font-size:18px; text-transform:uppercase; margin:0 0 12px 0; }
            .project-form-label { display:block; font-size:12px; font-weight:bold; color:#374151; margin-top:12px; text-transform:uppercase; }
            .project-form-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:7px; box-sizing:border-box; font-size:14px; }
            .project-form-textarea { min-height:70px; resize:vertical; }
            .project-form-actions { display:flex; flex-direction:column; gap:8px; margin-top:16px; }
            .ui-metadata-tag-view4 { margin-top:18px; font-size:10px; color:#9ca3af; font-family:monospace; text-align:center; }
            @media print {
                .project-report-actions, .assessment-small-btn, .project-modal-backdrop, .ui-metadata-tag-view4 { display:none !important; }
                .project-report-container { background:white; padding:0; }
                .project-report-card { box-shadow:none; border-radius:0; max-width:100%; }
            }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="project-report-container">
            <div class="project-report-card">
                <h1 class="project-report-title">Project Assessment Report</h1>
                <p class="project-report-facility">Facility: ${facilityName}</p>

                <label class="project-report-label">Project Name</label>
                <input id="projectReportNameInput" class="project-report-input" value="${escapeAttr(localReport.projectName || '')}" placeholder="Example: AC Assessment">

                <div class="project-report-actions">
                    <button id="projectAddAssessmentBtn" class="project-report-btn project-report-btn-green">➕ Add Assessment</button>
                    <button id="projectSaveHeaderBtn" class="project-report-btn">💾 Save Project</button>
                    <button id="projectPrintBtn" class="project-report-btn">🖨️ Print Report</button>
                    <button id="projectEmailBtn" class="project-report-btn">✉️ Email Report</button>
                    <button id="projectBackBtn" class="project-report-btn project-report-btn-gray project-report-btn-full">⬅️ Back to Controls</button>
                </div>

                <div id="projectAssessmentList" class="project-report-section-list"></div>

                <div class="project-history-box">
                    <div class="project-history-title">Saved Project Rows From Supabase</div>
                    <div id="projectHistoryList">Loading...</div>
                </div>

                <div id="projectAssessmentModal" class="project-modal-backdrop">
                    <div class="project-modal-body">
                        <h3 class="project-modal-heading">Project Assessment Entry</h3>

                        <label class="project-form-label">Unit / Area Name</label>
                        <input id="assessmentAreaInput" class="project-form-input" placeholder="Example: AC Unit 1 / Room 203">

                        <label class="project-form-label">Condition</label>
                        <textarea id="assessmentConditionInput" class="project-form-input project-form-textarea" placeholder="Current condition"></textarea>

                        <label class="project-form-label">Recommended Fix</label>
                        <textarea id="assessmentFixInput" class="project-form-input project-form-textarea" placeholder="Recommended repair or replacement"></textarea>

                        <label class="project-form-label">Notes</label>
                        <textarea id="assessmentNotesInput" class="project-form-input project-form-textarea" placeholder="Extra notes"></textarea>

                        <label class="project-form-label">Image URLs</label>
                        <textarea id="assessmentImagesInput" class="project-form-input project-form-textarea" placeholder="Paste image links, one per line"></textarea>

                        <label class="project-form-label">Vendor Quote / Attachment Notes</label>
                        <textarea id="assessmentQuotesInput" class="project-form-input project-form-textarea" placeholder="Example: Tomorrow AC - $1,250 - quote attached manually"></textarea>

                        <div class="project-form-actions">
                            <button id="assessmentSaveBtn" class="project-report-btn project-report-btn-green">Save Assessment</button>
                            <button id="assessmentCloseBtn" class="project-report-btn project-report-btn-gray">Cancel</button>
                        </div>
                    </div>
                </div>

                <div id="uiTag_view_4_grid" class="ui-metadata-tag-view4">
                    Source: view_4_grid.js | Updated: 2026-06-08 09:20 PM
                </div>
            </div>
        </div>
    `;

    renderAssessmentCards(facility.id);
    await renderSupabaseProjectHistory(facility.id);
    setupProjectsEvents(facility, renderPendingProjects);
}

export function renderAssessmentCards(facilityId) {
    const list = document.getElementById('projectAssessmentList');
    if (!list) return;

    const report = loadLocalProjectReport(facilityId);
    list.innerHTML = '';

    if (!report.sections || report.sections.length === 0) {
        list.innerHTML = '<div class="project-empty-state">No assessment sections yet. Add one section for each AC unit, area, repair, or project item.</div>';
        return;
    }

    report.sections.forEach((section, index) => {
        const images = Array.isArray(section.images) ? section.images : [];

        const imageHtml = images
            .filter(src => src)
            .map(src => `<img src="${escapeAttr(src)}" alt="Assessment image">`)
            .join('');

        const card = document.createElement('div');
        card.className = 'assessment-card';
        card.innerHTML = `
            <div class="assessment-title">${escapeHtml(section.area || `Assessment ${index + 1}`)}</div>
            <div class="assessment-line"><strong>Condition:</strong> ${escapeHtml(section.condition || '')}</div>
            <div class="assessment-line"><strong>Recommended Fix:</strong> ${escapeHtml(section.fix || '')}</div>
            <div class="assessment-line"><strong>Notes:</strong> ${escapeHtml(section.notes || '')}</div>
            <div class="assessment-line"><strong>Vendor Quotes:</strong> ${escapeHtml(section.quotes || '')}</div>
            <div class="assessment-images">${imageHtml}</div>
            <button class="assessment-small-btn" data-delete-assessment="${index}">Delete Section</button>
        `;
        list.appendChild(card);
    });
}

async function renderSupabaseProjectHistory(facilityId) {
    const history = document.getElementById('projectHistoryList');
    if (!history) return;

    const projects = await fetchFacilityProjects(facilityId);

    if (!projects || projects.length === 0) {
        history.innerHTML = '<div class="project-history-row">No saved project rows found yet.</div>';
        return;
    }

    history.innerHTML = projects.map(project => {
        const title = project.title || project.project_title || project.project_name || 'Untitled Project';
        const notes = project.description || project.notes || '';
        return `
            <div class="project-history-row">
                <strong>${escapeHtml(title)}</strong><br>
                ${escapeHtml(notes)}
            </div>
        `;
    }).join('');
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
    return escapeHtml(value).replaceAll('\n', ' ');
}

/*================================================================
END FILE: view_4_grid.js
UPDATED: 2026-06-08 @ 09:20 PM
================================================================*/
