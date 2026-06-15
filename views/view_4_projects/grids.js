
/*================================================================
FILE NAME : grid.js
================================================================*/
export function renderGrid(projects) {
    if (!projects || projects.length === 0) return '<p>No projects found.</p>';
    return projects.map(p => `
        <div class="project-card" data-id="${p.id}">
            <h4>${p.project_name}</h4>
        </div>
    `).join('');
}
/*================================================================
END FILE: grid.js
================================================================*/
