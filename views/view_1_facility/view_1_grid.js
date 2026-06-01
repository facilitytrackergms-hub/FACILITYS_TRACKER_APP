/* =================================================
            .dash-card { background: rgba(255,255,255,0.88); border-radius: 18px; padding: 18px 12px 24px; box-shadow: 0 10px 24px rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.8); max-width: 380px; margin: 0 auto; }
            .button-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 10px; max-width: 400px; margin: 0 auto; }
            .facility-btn { width: 100%; height: 60px; border-radius: 10px; background-color: #003366; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 1.1em; }
            .new-btn { background-color: #28a745; margin-bottom: 20px; width: 200px; }
            .dash-title { font-size: 1.25em; font-weight: 900; color: #003366; margin-bottom: 10px; text-transform: uppercase; border-bottom: 4px solid #003366; padding-bottom: 15px; display: inline-block; width: 90%; white-space: nowrap; }
            .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10; overflow-y: auto; padding: 10px; }
            .modal-content { position: relative; top: 5%; left: 50%; transform: translateX(-50%); width: 100%; max-width: 400px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); box-sizing: border-box; }
            input { display: block; width: 100%; margin: 10px auto; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="dash-container">
            <div class="dash-card">
                <h1 class="dash-title">FACILITIES DASHBOARD</h1>
                <br>
                <button id="openModal" class="facility-btn new-btn">Create New Facility</button>
                <div id="list" class="button-container">Loading...</div>
            </div>
        </div>
    `;

    const gridContainer = app.querySelector('.button-container');
    const facilities = await fetchFacilities();
    gridContainer.innerHTML = '';

    if (facilities && facilities.length > 0) {
        facilities.forEach(facility => {
            const btn = document.createElement('button');
            btn.className = 'facility-btn';
            btn.textContent = facility.name;
            btn.onclick = () => window.navigateTo('facilityControls', facility);
            gridContainer.appendChild(btn);
        });
    } else {
        gridContainer.innerHTML = '<div style="color:#666; font-style:italic;">No facilities found.</div>';
    }

    renderImageManagerSection && renderImageManagerSection(app);
}
