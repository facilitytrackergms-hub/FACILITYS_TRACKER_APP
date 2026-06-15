/*================================================================
FILE: view_3_grid.js (REBUILT)
PURPOSE: Clean UI layer only (NO logic, NO pointer hacks)
================================================================*/

import { initializeGridLogic } from './view_3_grid_logic.js';

export async function renderFacilityContacts(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility || {};

    const styles = `
    <style>
        .contacts-view-container {
            padding:20px;
            font-family:Arial;
            min-height:100vh;
            background:#f3f4f6;
            box-sizing:border-box;
        }

        .contacts-card-wrapper {
            max-width:520px;
            margin:0 auto;
            background:white;
            border-radius:12px;
            padding:20px;
            box-shadow:0 4px 10px rgba(0,0,0,0.08);
        }

        .contacts-view-title {
            font-size:22px;
            font-weight:bold;
            color:#00264d;
            text-transform:uppercase;
            margin-bottom:5px;
        }

        .contacts-view-subtitle {
            font-size:13px;
            color:#6b7280;
            margin-bottom:15px;
        }

        .btn {
            width:100%;
            padding:12px;
            border:none;
            border-radius:8px;
            cursor:pointer;
            font-weight:bold;
            margin-bottom:10px;
        }

        .btn-primary { background:#00264d; color:white; }
        .btn-green { background:#10b981; color:white; }
        .btn-red { background:#dc2626; color:white; }
        .btn-gray { background:#9ca3af; color:white; }

        .grid {
            display:grid;
            grid-template-columns:repeat(auto-fill, minmax(120px,1fr));
            gap:10px;
        }

        .card {
            padding:10px;
            border:1px solid #e5e7eb;
            border-radius:8px;
            text-align:center;
            cursor:pointer;
        }

        .detail-pane {
            display:none;
            margin-top:15px;
            padding:15px;
            border:1px solid #e5e7eb;
            border-radius:8px;
        }

        .actions {
            display:flex;
            gap:8px;
            margin-bottom:10px;
        }

        .actions button {
            flex:1;
        }

        .history {
            margin-top:10px;
            padding:10px;
            border:1px solid #e5e7eb;
            border-radius:6px;
            max-height:160px;
            overflow:auto;
        }
    </style>
    `;

    app.innerHTML = `
        ${styles}

        <div class="contacts-view-container">
            <div class="contacts-card-wrapper">

                <div class="contacts-view-title">Facility Directory</div>
                <div class="contacts-view-subtitle">${facility.name || ''}</div>

                <!-- GRID -->
                <div id="directorySelectionLayout">
                    <button id="addContactBtn" class="btn btn-green">Add Contact</button>
                    <div id="contactsGridElement" class="grid"></div>
                </div>

                <!-- DETAIL -->
                <div id="contactDetailPane" class="detail-pane">

                    <div id="detailName" style="font-weight:bold; margin-bottom:10px;"></div>

                    <div class="actions">
                        <button id="editBtn" class="btn btn-gray">Edit</button>
                        <button id="deleteBtn" class="btn btn-red">Delete</button>
                        <button id="addIssueBtn" class="btn btn-green">Add Issue</button>
                    </div>

                    <div>Role: <span id="detailRole"></span></div>
                    <div>Phone: <span id="detailPhone"></span></div>
                    <div>Email: <span id="detailEmail"></span></div>

                    <div class="history" id="historyBox">
                        Loading history...
                    </div>

                    <button id="closeBtn" class="btn btn-primary">Back</button>

                </div>

                <button id="backBtn" class="btn btn-primary">Back to Controls</button>

            </div>
        </div>
    `;

    // initialize logic AFTER DOM is clean
    await initializeGridLogic({ facility });
}
