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
            box-sizing:border-box;
        }

        .contacts-card-wrapper {
            max-width:520px;
            margin:0 auto;
            background:white;
            border-radius:12px;
            padding:20px;
            box-shadow:0 4px 10px rgba(0,0,0,0.05);
        }

        .header {
            text-align:center;
            margin-bottom:15px;
        }

        .btn {
            width:100%;
            padding:12px;
            margin-top:8px;
            border:none;
            border-radius:8px;
            cursor:pointer;
            font-weight:600;
        }

        .primary { background:#00264d; color:#fff; }
        .green { background:#10b981; color:#fff; }
        .red { background:#dc2626; color:#fff; }
        .gray { background:#9ca3af; color:#fff; }

        .grid {
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:10px;
            margin-top:15px;
        }

        .card {
            border:1px solid #e5e7eb;
            border-radius:8px;
            padding:10px;
            cursor:pointer;
            background:#fff;
        }

        .detail {
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
            max-height:160px;
            overflow-y:auto;
            background:#fafafa;
        }
    </style>
    `;

    app.innerHTML = `
        ${styles}

        <div class="contacts-view-container">
            <div class="contacts-card-wrapper">

                <div class="header">
                    <h2>${facility?.name || 'Facility Contacts'}</h2>
                </div>

                <div id="gridView">
                    <button id="addContactBtn" class="btn green">Add Contact</button>
                    <div id="contactsGrid" class="grid">Loading...</div>
                </div>

                <div id="detailView" class="detail">
                    <h3 id="name"></h3>

                    <button id="editBtn" class="btn primary">Edit</button>
                    <button id="deleteBtn" class="btn red">Delete</button>
                    <button id="issueBtn" class="btn green">Add Issue</button>

                    <div id="info"></div>

                    <div class="history" id="history">Loading...</div>

                    <button id="backBtn" class="btn gray">Back</button>
                </div>

            </div>
        </div>
    `;

    await initializeGridLogic(data);
}
