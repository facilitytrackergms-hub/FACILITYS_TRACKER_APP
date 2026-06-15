/*================================================================
FILE NAME    : modal.js
PURPOSE      : Create New Project Modal
================================================================*/
export function renderModal() {
    return `
        <div id="projectModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5);">
            <div style="background:#fff; margin:10% auto; padding:20px; width:300px;">
                <input type="text" id="projTitle" placeholder="Project Name">
                <button id="saveProjBtn">Save Project</button>
            </div>
        </div>
    `;
}
