/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_grid.js
SUPABASE TBL : projects
VIEW NAME    : Pending Projects Dashboard
POP-UP TITLE : Project Details
LAST UPDATED : 2026-06-12 @ 02:45 PM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

3. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

4. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

5. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

6. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

7. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

8. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

9. UNIQUE ALERTS: Never use generic default message boxes for custom 
   notifications. Always add a distinct, visible ID or tag to the 
   message box UI referencing its specific component/file.

10. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
    including this header and all rules, wrapped completely inside 
    a single markdown code block to allow for easy copying.

11. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
    in this header (File Name, Table, View, Title, Date, Time) are 
    fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_4_grid.js';

// FIXED: Converted relative paths (./) to absolute paths beginning with /FACILITYS_TRACKER_APP/ to prevent loading locks
import { fetchPendingProjects } from '/FACILITYS_TRACKER_APP/views/view_4_projects/view_4_data.js';
import { setupPendingProjectsEvents } from '/FACILITYS_TRACKER_APP/views/view_4_projects/view_4_modal.js';

export async function renderPendingProjects(context, navRuntime) {
    const app = document.getElementById('app');
    
    // Fallback context validation to match robust routing definitions
    if (!context || !context.facility) {
        context = { facility: context || { id: 1, name: "Default Facility Headquarter" } };
    }

    const styles = `
        <style>
            .projects-container { padding: 20px; text-align: center; font-family: Arial; background: #f4f6f9; min-height: 100vh; box-sizing: border-box; }
            .projects-card { background: #ffffff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; text-align: left; }
            .projects-title { font-size: 1.4em; font-weight: bold; color: #333; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid #003366; padding-bottom: 10px; }
            .facility-subtitle { font-size: 1.1em; color: #003366; font-weight: 600; margin-bottom: 20px; }
            .project-item { padding: 15px; background: #f8f9fa; border-left: 5px solid #28a745; margin-bottom: 15px; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
            .project-item:hover { background: #e9ecef; }
            .project-header { display: flex; justify-content: space-between; font-weight: bold; color: #495057; }
            .project-body { margin-top: 8px; color: #6c757d; font-size: 0.95em; }
            .back-btn { background-color: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 20px; }
            .back-btn:hover { background-color: #5a6268; }
            .no-projects { text-align: center; color: #6c757d; padding: 30px; font-style: italic; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="projects-container">
            <div style="max-width: 600px; margin: 0 auto; text-align: left;">
                <button id="backToControlsBtn" class="back-btn">← Back to Controls</button>
            </div>
            <div class="projects-card">
                <h1 class="projects-title">Pending Projects</h1>
                <div class="facility-subtitle">Facility: ${context.facility.name || 'Unknown'}</div>
                <div id="projects-list">Loading projects...</div>
            </div>

            <div style="margin-top: 50px; font-size: 0.8em; color: #666; text-align: center; border-top: 1px solid #ccc; padding-top: 10px;">
                File: views/view_4_projects/view_4_grid.js | Updated: 2026-06-12 @ 02:45 PM
            </div>
        </div>
    `;

    // Handle Back Navigation click
    document.getElementById('backToControlsBtn').onclick = () => {
        window.navigateTo('view_2_controls', context);
    };

    // Invoke view local operational business scripts
    setupPendingProjectsEvents(context, navRuntime);

    // Retrieve database payload instance asynchronously
    const projectsListContainer = document.getElementById('projects-list');
    const projects = await fetchPendingProjects(context.facility.id);
    projectsListContainer.innerHTML = '';

    if (!projects || projects.length === 0) {
        projectsListContainer.innerHTML = '<div class="no-projects">No pending projects recorded for this facility.</div>';
        return;
    }

    projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.innerHTML = `
            <div class="project-header">
                <span>${project.title || 'Untitled Project'}</span>
                <span style="color: #28a745;">${project.status || 'Pending'}</span>
            </div>
            <div class="project-body">
                ${project.description || 'No summary overview provided.'}
            </div>
        `;
        
        // Execute nested dynamic dashboard handoffs on row touch interactions
        item.onclick = () => {
            if (navRuntime && typeof navRuntime.renderSingleProjectDashboard === 'function') {
                navRuntime.renderSingleProjectDashboard({ ...context, project: project });
            } else {
                window.navigateTo('view_4_project_dashboard', { ...context, project: project });
            }
        };
        
        projectsListContainer.appendChild(item);
    });
}
