import { initializeGridLogic } from './view_3_grid_logic.js';

export async function renderFacilityContacts(data) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    const styles = `
    <style>
        .contacts-view-container {
            padding:20px;
            font-family:Arial;
            min-height:100vh;
            background:#f3f4f6;
        }

        .contacts-card-wrapper {
            max-width:500px;
            margin:0 auto;
            background:white;
            border-radius:12px;
            padding:20px;
            box-shadow:0 4px 10px rgba(0,0,0,0.05);
        }

        .header {
            text-align:center;
            margin-bottom:20px;
        }

        .contacts-view-btn {
            width:100%;
            padding:12px;
            margin-top:8px;
            border:none;
            border-radius:8px;
            cursor:pointer;
            font-weight:bold;
        }

        .btn-primary { background:#00264d; color:white; }
        .btn-green { background:#10b981; color:white; }
        .btn-red { background:#dc2626; color:white; }
        .btn-gray { background:#9ca3af; color:white; }

        .grid {
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:10px;
            margin-top:15px;
        }

        .card {
            padding:10px;
            border:1px solid #e5e7eb;
            border-radius:8px;
            cursor:pointer;
        }

        .detail-pane {
            display:none;
            margin-top:15px;
            padding:15px;
            border:1px solid #e5e7eb;
            border-radius:8px;
        }

        .history {
            margin-top:15px;
            padding:10px;
            border:1px solid #e5e7eb;
            border-radius:8px;
            max-height:150px;
            overflow-y:auto;
        }
    </style>
    `;

    app.innerHTML = `
        ${styles}

        <div class="contacts-view-container">
            <div class="contacts-card-wrapper">

                <div class="header">
                    <h2>${facility?.name || 'Facility'}</h2>
                </div>

                <div id="gridView">
                    <button id="addContactBtn" class="contacts-view-btn btn-green">Add Contact</button>

                    <div id="contactsGrid" class="grid">
                        Loading...
                    </div>
                </div>

                <div id="detailView" class="detail-pane">
                    <h3 id="contactName"></h3>

                    <button id="editBtn" class="contacts-view-btn btn-primary">Edit</button>
                    <button id="deleteBtn" class="contacts-view-btn btn-red">Delete</button>
                    <button id="addIssueBtn" class="contacts-view-btn btn-green">Add Issue</button>

                    <div id="contactInfo"></div>

                    <div class="history" id="historyBox">
                        Loading history...
                    </div>

                    <button id="closeDetailBtn" class="contacts-view-btn btn-gray">
                        Back
                    </button>
                </div>

            </div>
        </div>
    `;

    await initializeGridLogic(data);
}
