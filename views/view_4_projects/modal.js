/*================================================================
FILE NAME : modal.js
================================================================*/
export function renderModal() {
    return `
        <div id="newProjectModal" style="display:none; position:fixed; z-index:1000; inset:0; background:rgba(0,0,0,0.5);">
            <div style="background:#fff; margin:10% auto; padding:20px; width:300px;">
                <input type="text" id="projTitle" placeholder="Project Name">
                <button id="saveProjBtn">Save Project</button>
            </div>
        </div>
    `;
}

// Event Delegation: Listens to the whole body so buttons never "break"
export function setupModalEvents(onSave) {
    document.body.addEventListener('click', (e) => {
        const modal = document.getElementById('newProjectModal');
        
        if (e.target.id === 'openModalBtn') modal.style.display = 'block';
        if (e.target.id === 'saveProjBtn') {
            const title = document.getElementById('projTitle').value;
            onSave({ project_name: title });
            modal.style.display = 'none';
        }
    });
}
/*================================================================
END FILE: modal.js
================================================================*/
