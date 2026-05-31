/* =================================================
FILE: controls_v2_modal.js
UPDATED: 2026-05-30 12:50:00 PM
STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { getContacts, getProjects, getFacilityIssues, subscribeFacilityIssues } from './controls_v2_data.js';
import { supabase } from '../js/supabaseClient.js';

export async function loadBadges(facility) {
    if (!facility?.id) return;

    const [standardIssuesResp, projectIssuesResp] = await Promise.all([
        getFacilityIssues(facility.id),
        getProjects(facility.id)
    ]);

    const standardIssues = standardIssuesResp.data || standardIssuesResp || [];
    const projectIssues = projectIssuesResp.data || projectIssuesResp || [];

    const issuesBadge = document.getElementById('issuesBadge');
    const projectBadge = document.getElementById('projectBadge');

    if (issuesBadge) {
        issuesBadge.style.display = standardIssues.length > 0 ? 'inline-block' : 'none';
        issuesBadge.textContent = standardIssues.length;
    }

    if (projectBadge) {
        projectBadge.style.display = projectIssues.length > 0 ? 'inline-block' : 'none';
        projectBadge.textContent = projectIssues.length;
    }
}

// Setup navigation and realtime
export function setupNavigation(facility) {
    let controlsChannel = subscribeFacilityIssues(facility.id, () => loadBadges(facility));

    const navigateWithCleanup = (target) => {
        if (controlsChannel) supabase.removeChannel(controlsChannel);
        window.navigateTo(target, { facility });
    };

    document.getElementById('toIndividualIssues').onclick = () => navigateWithCleanup('facilityIssues');
    document.getElementById('toContacts').onclick = () => navigateWithCleanup('facilityContacts');
    document.getElementById('toProjects').onclick = () => navigateWithCleanup('pendingProjects');
    document.getElementById('toGallery').onclick = () => navigateWithCleanup('facilityImages');
    document.getElementById('backDash').onclick = () => navigateWithCleanup('dashboard');
}
