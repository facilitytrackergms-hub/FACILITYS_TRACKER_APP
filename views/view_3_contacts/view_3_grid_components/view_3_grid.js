/********************************************************************
FILE: view_3_grid.js
LAYER: UI / RENDER ONLY
PURPOSE: Contacts Directory UI (NO BUSINESS LOGIC)
********************************************************************/

import { initializeGridLogic } from './view_3_grid_logic.js';

export async function renderFacilityContacts(data) {

    /****************************************************************
    INIT APP CONTAINER
    ****************************************************************/
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    /****************************************************************
    UI STYLES (DO NOT PUT LOGIC HERE)
    ****************************************************************/
    const styles = `
    <style>

        /* ================= ROOT LAYOUT ================= */
        .contacts-view-container {
            padding:20px;
            font-family:Arial;
            background:#f3f4f6;
            min-height:100vh;
        }

        .contacts-card-wrapper {
            max-width:520px;
            margin:0 auto;
            background:white;
            border-radius:12px;
            padding:20px;
            box-shadow:0 4px 10px rgba(0,0,0,0.08);
        }

        /* ================= HEADER ================= */
        .view-header {
            text-align:center;
            margin-bottom:15px;
        }

        /* ================= BUTTON SYSTEM ================= */
        .btn {
            width:100%;
            padding:12px;
            border:none;
            border-radius:8px;
            cursor:pointer;
            font-weight:600;
            margin-top:8px;
        }

        .primary { background:#00264d; color:white; }
        .green { background:#10b981; color:white; }
        .red { background:#dc2626; color:white; }
        .gray { background:#9ca3af; color:white; }

        /* ================= CONTACT GRID ================= */
        .grid {
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:10px;
            margin-top:15px;
        }

        .card {
            border:1px solid #e5e7eb;
            padding:10px;
            border-radius:8px;
            cursor:pointer;
            background:white;
        }

        /* ================= DETAIL VIEW ================= */
        .detail-pane {
            display:none;
            margin-top:15px;
            border:1px solid #e5e7eb;
            border-radius:8px;
            padding:15px;
        }

        /* ================= HISTORY BOX ================= */
        .history-box {
            margin-top:15px;
            max-height:180px;
            overflow-y:auto;
            border:1px solid #e5e7eb;
            border-radius:8px;
            padding:10px;
        }

        /* ================= MODAL ================= */
        .modal {
            display:none;
            position:fixed;
            top:0;
            left:0;
            right:0;
            bottom:0;
            background:rgba(0,0,0,0.4);
            justify-content:center;
            align-items:center;
        }

        .modal-content {
            background:white;
            padding:20px;
            border-radius:10px;
            width:90%;
            max-width:400px;
        }

        .input {
            width:100%;
            padding:10px;
            margin-top:8px;
            border:1px solid #ddd;
            border-radius:6px;
        }

    </style>
    `;

    /****************************************************************
    UI STRUCTURE
    ****************************************************************/
    app.innerHTML = `
        ${styles}

        <div class="contacts-view-container">
            <div class="contacts-card-wrapper">

                <!-- ================= HEADER ================= -->
                <div class="view-header">
                    <h2>${facility?.name || 'Contacts'}</h2>
                </div>

                <!-- ================= GRID VIEW ================= -->
                <div id="gridView">
                    <button id="openAddContact" class="btn green">+ Add Contact</button>
                    <div id="contactsGrid" class="grid">Loading...</div>
                </div>

                <!-- ================= DETAIL VIEW ================= -->
                <div id="detailView" class="detail-pane">

                    <h3 id="contactName"></h3>

                    <button id="editBtn" class="btn primary">Edit</button>
                    <button id="deleteBtn" class="btn red">Delete</button>
                    <button id="addIssueBtn" class="btn green">Add Maintenance Request</button>

                    <div id="contactInfo"></div>

                    <div class="history-box" id="historyBox"></div>

                    <button id="closeDetail" class="btn gray">Back</button>
                </div>

            </div>
        </div>

        <!-- ================= ADD CONTACT MODAL ================= -->
        <div id="addModal" class="modal">
            <div class="modal-content">

                <h3>Add Contact</h3>

                <input id="nameInput" class="input" placeholder="Full Name">
                <input id="roleInput" class="input" placeholder="Role">
                <input id="phoneInput" class="input" placeholder="Phone">
                <input id="emailInput" class="input" placeholder="Email">

                <!-- IMAGE UPLOAD -->
                <input id="imageInput" type="file" accept="image/*" class="input">

                <button id="saveContact" class="btn green">Save Contact</button>
                <button id="cancelModal" class="btn gray">Cancel</button>

            </div>
        </div>
    `;

    /****************************************************************
    INIT LOGIC LAYER
    ****************************************************************/
    initializeGridLogic(data);
}
