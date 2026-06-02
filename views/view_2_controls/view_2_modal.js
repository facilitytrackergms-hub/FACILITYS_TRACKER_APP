/* =================================================
FILE: views/view_2_controls/view_2_modal.js
UPDATED: 2026-06-02 05:40:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { supabase } from '../../js/supabaseClient.js';

export function setupControlsEvents(facility) {
    let controlsChannel = null;

    if (facility?.id) {
        const channelName = `facility_controls_realtime_${facility.id}`;
        supabase.removeChannel(supabase.channel(channelName));

        controlsChannel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'facility_issues', 
                    filter: `facility_id=eq.${facility.id}` 
                },
                () => {
                    // Triggers dynamic content re-evaluation on realtime table broadcasts
                    const badge = document.getElementById('issuesTrackBadge');
                    if (badge && window.renderFacilityControls) {
                        window.renderFacilityControls(facility);
                    }
                }
            )
            .subscribe();
    }

    const navigateWithCleanup = (targetViewKey) => {
        if (controlsChannel) {
            supabase.removeChannel(controlsChannel);
        }
        if (window.navigateTo) {
            window.navigateTo(targetViewKey, { facility });
        }
    };

    document.getElementById('toIndividualIssues').onclick = () => navigateWithCleanup('view_5_issues');
    document.getElementById('toContacts').onclick = () => navigateWithCleanup('view_3_controls');
    document.getElementById('toProjects').onclick = () => navigateWithCleanup('view_4_projects');
    document.getElementById('toGallery').onclick = () => navigateWithCleanup('view_6_images');
    document.getElementById('backDash').onclick = () => navigateWithCleanup('view_1_facility');
}
