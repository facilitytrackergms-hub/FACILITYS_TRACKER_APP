/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_3_grid.js
SUPABASE TBL : contacts
VIEW NAME    : Facility Directory
POP-UP TITLE : Create Directory Entry
LAST UPDATED : 2026-06-14 @ UPDATED FIX
================================================================*/

import { initializeGridLogic } from './view_3_grid_logic.js';

/* =========================
   FIX: MAIN EXPORT ENTRY
   This ensures main.js can always call:
   module.renderFacilityContacts
========================= */

export async function renderFacilityContacts(data = {}) {
    const app = document.getElementById('app');
    if (!app) return;

    // normalize facility object
    const facility = data?.facility ? data.facility : data;

    // safety pass-through context (do not break existing logic)
    const context = {
        ...data,
        facility
    };

    // render shell is handled inside logic layer
    await initializeGridLogic(context);
}

/* =========================
   BACKWARD COMPATIBILITY
========================= */

export default renderFacilityContacts;
