/*================================================================
FILE NAME    : view_3_grid.js
PURPOSE      : Contact Directory UI Shell
LOCATION     : /views/view_3_contacts/view_3_grid_components/
================================================================*/

import { initializeGridLogic } from './view_3_grid_logic.js';

export async function renderFacilityContacts(viewContext) {
    const app = document.getElementById('app');

    // 1. Set up the UI Structure required by view_3_grid_logic.js
    app.innerHTML = `
        <div id="directorySelectionLayout">
            <button id="backBtn" style="margin-bottom:10px;">Back</button>
            <button id="manualContactTriggerBtn" style="margin-bottom:10px;">Add New Contact</button>
            <div id="contactsGridElement" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap:15px;"></div>
        </div>

        <div id="contactDetailPane" style="display:none; padding:20px; border:1px solid #ccc; border-radius:8px;">
            <button id="closeDetailPaneBtn">Close</button>
            <img id="detailAvatar" style="width:100px; height:100px; border-radius:50%;" />
            <h2 id="detailName"></h2>
            <p id="detailRole"></p>
            <a id="detailPhoneLink" style="display:block;"></a>
            <a id="detailEmailLink" style="display:block;"></a>
            <p id="detailNotes"></p>
            <button id="profileEditBtn">Edit</button>
            <button id="profileDeleteBtn" style="color:red;">Delete</button>
            <div id="contactIssuesHistoryList" style="margin-top:20px;"></div>
        </div>

        <div id="manualContactModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); align-items:center; justify-content:center;">
            <div style="background:white; padding:20px; border-radius:8px; width:90%; max-width:400px;">
                <h2 id="modalTemplateTitle"></h2>
                <input type="hidden" id="editingContactId">
                <input type="hidden" id="manualContactImage">
                <input type="text" id="manualContactName" placeholder="Contact Name" style="width:100%; margin:5px 0;">
                <input type="text" id="manualContactRole" placeholder="Role" style="width:100%; margin:5px 0;">
                <input type="text" id="manualContactPhone" placeholder="Phone" style="width:100%; margin:5px 0;">
                <input type="email" id="manualContactEmail" placeholder="Email" style="width:100%; margin:5px 0;">
                <textarea id="manualContactNotes" placeholder="Operational Notes" style="width:100%; margin:5px 0;"></textarea>
                
                <button id="cameraTriggerBtn">Capture Photo</button>
                <input type="file" id="manualContactImageFile" style="display:none;">
                <p id="cameraStatusText" style="font-size:12px;">No photo captured</p>
                
                <div style="margin-top:20px;">
                    <button id="saveContactBtn">Save Contact</button>
                    <button id="cancelContactModalBtn">Cancel</button>
                </div>
            </div>
        </div>
    `;

    // 2. Initialize the Logic
    await initializeGridLogic(viewContext);
}
