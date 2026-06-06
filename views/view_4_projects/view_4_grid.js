/*================================================================
FILE METADATA
================================================================
FILE NAME    : [Insert File Name - e.g., view_1_data.js]
SUPABASE TBL : [Insert Table Name - e.g., facilities]
VIEW NAME    : [Insert View Name - e.g., Add New Facility]
POP-UP TITLE : [Insert Pop-Up Title - e.g., Create Directory Entry]
LAST UPDATED : 2026-06-06 @ 05:09 AM
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


import { fetchFacilityProjects } from './view_4_data.js';
import { setupProjectsEvents } from './view_4_modal.js';

export async function renderPendingProjects(data) {
    const facility = data?.facility ? data.facility : data;

    if (!facility || !facility.id) {
        console.error("Facility context missing inside project viewer grid.");
        return;
    }

    const app = document.getElementById('app');

    const styles = `
        <style>
            .projects-container { padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing:border-box; }
            .projects-header-title { color:#00264d; font-size:22px; text-transform:uppercase; margin-bottom:5px; }
            .projects-header-sub { color:#4b5563; margin-bottom:25px; }
            .projects-layout-stack { display:flex; flex-direction:column; gap:15px; max-width:400px; margin:0 auto; }
            .project-action-btn { padding:15px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px; text-transform:uppercase; box-sizing:border-box; }
            .project-btn-navy { background:#00264d; }
            .project-btn-gray { background:#6b7280; }
            .project-list-feed { display:flex; flex-direction:column; gap:12px; margin-top:10px; text-align:left; }
            .project-row-item { background:white; padding:15px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.04); border-left:4px solid #28a745; }
            .project-row-title { font-weight:bold; color:#00264d; font-size:15px; }
            .project-row-budget { font-size:13px; color:#4b5563; margin-top:4px; font-family:monospace; }
            .project-row-notes { font-size:13px; color:#6b7280; margin-top:6px; font-style:italic; }
            .project-modal-backdrop { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; z-index:40; padding:15px; }
            .project-modal-body { background:white; padding:25px; border-radius:10px; width:100%; max-width:380px; text-align:left; box-shadow:0 4px 15px rgba(0,0,0,0.15); box-sizing:border-box; }
            .project-modal-heading { margin-top:0; color:#00264d; font-size:18px; text-transform:uppercase; margin-bottom:15px; }
            .project-form-label { display:block; font-size:12px; font-weight:bold; color:#4b5563; margin-top:12px; }
            .project-form-input { width:100%; padding:10px; margin-top:4px; border:1px solid #d1d5db; border-radius:6px; box-sizing:border-box; }
            .project-form-actions { display:flex; flex-direction:column; gap:8px; margin-top:20px; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="projects-container">
            <h1 class="projects-header-title">Active Projects Tracker</h1>
            <p class="projects-header-sub">Facility: ${facility.name || facility.Name}</p>

            <div class="projects-layout-stack">
                <button id="projectTrackCreateBtn" class="project-action-btn">➕ Create Capital Project</button>
                
                <div id="projectTrackFeed" class="project-list-feed">Loading projects...</div>

                <button id="projectTrackBackBtn" class="project-action-btn project-btn-navy">⬅️ Back to Controls</button>
            </div>

            <div id="projectTrackFormModal" class="project-modal-backdrop">
                <div class="project-modal-body">
                    <h3 class="project-modal-heading">New Project Entry</h3>
                    
                    <label class="project-form-label">Project Scope Descriptor</label>
                    <input type="text" id="projectTrackTitleInput" class="project-form-input" placeholder="e.g. Roof Replacement Phase 1">

                    <label class="project-form-label">Project Budget Cost ($)</label>
                    <input type="number" id="projectTrackBudgetInput" class="project-form-input" placeholder="e.g. 45000">

                    <label class="project-form-label">Project Scope Notes</label>
                    <textarea id="projectTrackNotesInput" class="project-form-input" style="height:60px; resize:none;" placeholder="Provide scope implementation constraints..."></textarea>

                    <div class="project-form-actions">
                        <button id="projectTrackSaveBtn" class="project-action-btn project-btn-navy">Save Project</button>
                        <button id="projectTrackCloseBtn" class="project-action-btn project-btn-gray">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    setupProjectsEvents(facility, renderPendingProjects);

    async function loadFacilityProjects() {
        const feed = document.getElementById('projectTrackFeed');
        if (!feed) return;

        const projects = await fetchFacilityProjects(facility.id);
        feed.innerHTML = '';

        if (!projects || projects.length === 0) {
            feed.innerHTML = '<div style="text-align:center; color:#6b7280; font-size:13px; padding:15px; background:white; border-radius:8px;">No current active projects listed.</div>';
            return;
        }

        projects.forEach(p => {
            const row = document.createElement('div');
            row.className = 'project-row-item';
            row.innerHTML = `
                <div class="project-row-title">${p.project_title || 'Untitled Project'}</div>
                <div class="project-row-budget">Budget: $${p.budget ? Number(p.budget).toLocaleString() : '0'}</div>
                <div class="project-row-notes">${p.notes || 'No project description logs found.'}</div>
            `;
            feed.appendChild(row);
        });
    }

    await loadFacilityProjects();
}
