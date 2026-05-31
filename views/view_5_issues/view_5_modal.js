/* =================================================
FILE: controls_v5_modal.js
UPDATED: 2026-05-30 06:00 AM
================================================= */
import { insertFacilityIssue, updateFacilityIssue, getFacilityContacts, insertContact } from './controls_v5_data.js';
import { renderImageManagerSection } from '../js/imageManager.js';

export function setupIssueModals(facility) {
    document.getElementById('createNewIssueBtn').onclick = async () => {
        const contacts = await getFacilityContacts(facility.id);
        openBlankModal();
    };

    document.getElementById('saveIssueBtn').onclick = async () => {
        const id = document.getElementById('issueId').value;
        const payload = {
            issue: document.getElementById('issueInput').value,
            tool_required: document.getElementById('toolInput').value,
            initiated_by: document.getElementById('initiatedByInput').value.trim(),
            notes: document.getElementById('notesInput').value.trim(),
            facility_id: facility.id,
            open_issue: true
        };
        if (!payload.issue) return;

        let result = !id ? await insertFacilityIssue(payload) : await updateFacilityIssue(id, payload);
        const savedItem = result.data[0];
        if (savedItem) {
            document.getElementById('issueId').value = savedItem.id;
            renderImageManagerSection(document.getElementById('issue-image-container'), 'issue', savedItem.id, { facility, title:'Issue Photos' });
        }
    };

    document.getElementById('closeIssueModal').onclick = () => {
        document.getElementById('issueModal').style.display = 'none';
    };

    document.getElementById('backToControlsBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('facilityControls', facility);
    };
}

function openBlankModal(prefillName = '') {
    document.getElementById('issueId').value = '';
    document.getElementById('issueInput').value = '';
    document.getElementById('toolInput').value = '';
    document.getElementById('initiatedByInput').value = prefillName;
    document.getElementById('notesInput').value = '';
    document.getElementById('issue-image-section').style.display = 'none';
    document.getElementById('issue-image-container').innerHTML = '';
    document.getElementById('issueModal').style.display = 'flex';
}
