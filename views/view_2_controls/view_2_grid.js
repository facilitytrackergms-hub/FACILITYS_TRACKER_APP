/* =================================================
FILE: view_2_grid.js
UPDATED: 2026-06-01
================================================= */
export async function renderControls(context = {}) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '';

    // Create mode for new facility
    if (context.createNew) {
        app.innerHTML = `
            <h2 style="text-align:center;">Create Facility</h2>
            <input id="facilityName" placeholder="Name" style="width:100%; margin:6px 0; padding:10px; border-radius:6px; border:1px solid #ccc;" />
            <input id="facilityAddress" placeholder="Address" style="width:100%; margin:6px 0; padding:10px; border-radius:6px; border:1px solid #ccc;" />
            <input id="facilityPhone" placeholder="Phone" style="width:100%; margin:6px 0; padding:10px; border-radius:6px; border:1px solid #ccc;" />
            <button id="saveFacilityBtn" style="margin-top:12px; padding:12px; background:#16a34a; color:white; border:none; border-radius:6px; font-weight:bold;">Save Facility</button>
        `;

        document.getElementById('saveFacilityBtn').onclick = async () => {
            const name = document.getElementById('facilityName').value.trim();
            const address = document.getElementById('facilityAddress').value.trim();
            const phone = document.getElementById('facilityPhone').value.trim();

            if (!name) return alert('Facility name required.');

            const { data, error } = await supabase
                .from('facilities')
                .insert([{ name, address, phone }])
                .select();

            if (error) return alert('Error creating facility.');

            window.navigateTo('controls', { facilityId: data[0].id, facilityName: data[0].name });
        };
        return;
    }

    // Normal controls view
    app.innerHTML = `
        <h2 style="text-align:center;">${context.facilityName || 'FACILITY'} CONTROLS</h2>
        <div id="controlsContainer" style="display:flex; flex-direction:column; gap:12px; padding:12px;">
            <button style="background:#16a34a; color:white; padding:12px; border:none; border-radius:6px; font-weight:bold;">Individual Concerns</button>
            <button style="background:#facc15; color:black; padding:12px; border:none; border-radius:6px; font-weight:bold;">Manage Contacts</button>
            <button style="background:#0c4a6e; color:white; padding:12px; border:none; border-radius:6px; font-weight:bold;">Pending Projects</button>
            <button style="background:#16a34a; color:white; padding:12px; border:none; border-radius:6px; font-weight:bold;">Image Gallery</button>
            <button style="background:#6b7280; color:white; padding:12px; border:none; border-radius:6px; font-weight:bold;">Back to Dashboard</button>
        </div>
    `;

    // Back to dashboard button
    const buttons = app.querySelectorAll('button');
    buttons[buttons.length - 1].onclick = () => window.navigateTo('facility');
}
