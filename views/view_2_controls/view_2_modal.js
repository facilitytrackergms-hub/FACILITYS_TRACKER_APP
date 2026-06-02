/* =================================================
FILE: view_2_modal.js
UPDATED: 2026-06-01
================================================= */
import { insertControl, updateControl } from './view_2_data.js';

export function openControlModal(control, isEdit) {
    let existing = document.getElementById('controlModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'controlModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; justify-content:center; align-items:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;

    modal.innerHTML = `
        <div style="background:white; padding:24px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>${isEdit ? 'Edit Control' : 'Add Control'}</h2>
            <input id="controlName" placeholder="Control Name" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${control?.control_name_text || ''}">
            <input id="controlDescription" placeholder="Description" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${control?.description_text || ''}">
            <input id="controlAssigned" placeholder="Assigned To" style="width:100%; padding:10px; margin:6px 0; border-radius:6px; border:1px solid #ccc;" value="${control?.assigned_to_text || ''}">
            <div style="margin-top:12px;">
                <button id="saveControlBtn" style="padding:12px 20px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer; margin-right:8px;">
                    ${isEdit ? 'Update' : 'Save'}
                </button>
                <button id="closeControlBtn" style="padding:12px 20px; background:#6b7280; color:white; border:none; border-radius:8px; cursor:pointer;">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('closeControlBtn').onclick = () => modal.remove();

    document.getElementById('saveControlBtn').onclick = async () => {
        const name = document.getElementById('controlName').value.trim();
        const description = document.getElementById('controlDescription').value.trim();
        const assigned = document.getElementById('controlAssigned').value.trim();

        if (!name) return alert('Control name is required.');

        if (isEdit && control?.id) {
            await updateControl(control.id, { name, description, assigned });
        } else {
            await insertControl({ name, description, assigned });
        }

        modal.remove();
        const { renderControls } = await import('./view_2_grid.js');
        renderControls();
    };
}
