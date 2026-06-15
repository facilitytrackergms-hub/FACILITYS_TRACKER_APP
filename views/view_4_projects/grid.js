/*================================================================
FILE NAME    : grid.js
PURPOSE      : Beautiful Data Table for facility_projects
================================================================*/
export function renderGrid(projects) {
    if (!Array.isArray(projects) || projects.length === 0) {
        return '<p style="text-align:center; padding:20px; color:#666;">No projects found for this facility.</p>';
    }

    return `
    <style>
        .proj-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .proj-table th { background-color: #2563eb; color: white; padding: 12px; text-align: left; }
        .proj-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .proj-table tr:nth-child(even) { background-color: #f9fafb; }
        .status-pill { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .status-true { background: #dcfce7; color: #166534; }
        .status-false { background: #fee2e2; color: #991b1b; }
    </style>
    <table class="proj-table">
        <thead>
            <tr>
                <th>Project Name</th>
                <th>Title</th>
                <th>Notes</th>
                <th>Active</th>
            </tr>
        </thead>
        <tbody>
            ${projects.map(p => `
                <tr>
                    <td><strong>${p.project_name_text || 'N/A'}</strong></td>
                    <td>${p.project_title_text || '---'}</td>
                    <td>${p.notes || ''}</td>
                    <td>
                        <span class="status-pill status-${p.active_status}">
                            ${p.active_status ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}
