/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid.js
SUPABASE TBL : contacts
VIEW NAME    : Facility Directory
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-14 @ FIX
================================================================*/

import { initializeGridLogic } from './view_3_grid_logic.js';

/* =========================
 FIX: MAIN ENTRY EXPORT
 (prevents main.js import failure)
========================= */

export async function renderFacilityContacts(data = {}) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;

    await initializeGridLogic({
        ...data,
        facility
    });
}

/* =========================
 COMPATIBILITY EXPORT
========================= */

export default renderFacilityContacts;
