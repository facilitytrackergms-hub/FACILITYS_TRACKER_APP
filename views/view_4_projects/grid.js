/*================================================================
FILE NAME    : grid.js
PURPOSE      : Renders the project list
================================================================*/
export function renderGrid(projects) {
    // Safety Check
    if (!Array.isArray(projects)) return '<p>Error loading data.</p>';
    
    // Empty State
    if (projects.length === 0) return '<p>No projects found.</p>';
    
    // Success State
    return projects.map(p => `
        <div class="project-card" style="border:1px solid #ccc; padding:10px; margin:5px;">
            <h4>${p.project_name || 'Untitled Project'}</h4>
        </div>
    `).join('');
}
