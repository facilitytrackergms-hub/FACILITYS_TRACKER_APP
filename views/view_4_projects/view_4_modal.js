/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_modal.js
SUPABASE TBL : facility_projects
VIEW NAME    : Project Assessment Report
POP-UP TITLE : Project Assessment Entry
LAST UPDATED : 2026-06-08 @ 09:20 PM
================================================================
AI CODING RULES & CONSTRAINTS (Read before making any changes)
================================================================
1. STRICT ADHERENCE: Always follow these rules without exception.

2. MISSING METADATA HANDLING: If any fields in the FILE METADATA 
   section above are generic placeholders or missing, the AI must 
   immediately read the provided source code below to determine the 
   correct tables/views/titles. CRITICAL FOR FILE NAME: Look strictly 
   at the user's prompt text or comments for the exact sequential 
   filename (e.g., view_2_data.js). NEVER invent, guess, or substitute 
   a descriptive semantic name (like facility_data_service.js) based 
   on the code context. If the exact filename cannot be verified, 
   leave the placeholder intact or ask the user.

3. NO UNSANCTIONED CHANGES: Never change, remove, or modify any rules 
   in this header unless explicitly asked by the user.

4. SCOPE OF WORK: Only modify the specific functions, lines, or 
   features requested in the prompt.

5. PRESERVATION: Do NOT refactor, rename, or optimize any other 
   part of the code. Leave all working logic exactly as it is.

6. LOGGING CHANGES: If a variable name or structure must change to 
   make a fix work, explicitly state *why* in the text response 
   before showing the code.

7. CODE COMPLETENESS: Provide the full updated function or file so 
   nothing gets accidentally lost in translation.

8. VIEW IDENTIFIERS: Ensure the view/pop-up has a visible UI tag 
   identifying its source file, last update date, and time. If missing, 
   add it to the UI layout. Update this tag on every modification.

9. NO BLIND CODE: Never create a new file or assume the contents of 
   an existing file unless the current code is fully pasted into 
   the prompt. If missing, stop and ask for it.

10. UNIQUE ALERTS: Never use generic default message boxes for custom 
    notifications. Always add a distinct, visible ID or tag to the 
    message box UI referencing its specific component/file.

11. CODE BLOCK DELIVERY: Always deliver the entire updated file, 
     including this header and all rules, wrapped completely inside 
     a single markdown code block to allow for easy copying.

12. METADATA AUTO-UPDATE: On every code delivery, ensure all fields 
     in this header (File Name, Table, View, Title, Date, Time) are 
     fully updated and preserved at the top of the file.
================================================================*/
const __FILENAME = 'view_4_modal.js';

import { insertFacilityProject, loadLocalProjectReport, saveLocalProjectReport } from './view_4_data.js';
import { renderAssessmentCards } from './view_4_grid.js';

export function setupProjectsEvents(facility, renderPendingProjectsFn) {
    const modal = document.getElementById('projectAssessmentModal');
    const projectNameInput = document.getElementById('projectReportNameInput');

    document.getElementById('projectAddAssessmentBtn').onclick = () => {
        clearAssessmentInputs();
        modal.style.display = 'flex';
    };

    document.getElementById('assessmentCloseBtn').onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('assessmentSaveBtn').onclick = () => {
        const area = document.getElementById('assessmentAreaInput').value.trim();
        const condition = document.getElementById('assessmentConditionInput').value.trim();
        const fix = document.getElementById('assessmentFixInput').value.trim();
        const notes = document.getElementById('assessmentNotesInput').value.trim();
        const imageLines = document.getElementById('assessmentImagesInput').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line);
        const quotes = document.getElementById('assessmentQuotesInput').value.trim();

        if (!area) {
            alert('[view_4_modal.js] Notification: Add the unit or area name first.');
            return;
        }

        const report = loadLocalProjectReport(facility.id);
        report.projectName = projectNameInput.value.trim();
        report.sections.push({
            area,
            condition,
            fix,
            notes,
            images: imageLines,
            quotes,
            created_at: new Date().toISOString()
        });

        saveLocalProjectReport(facility.id, report);
        modal.style.display = 'none';
        renderAssessmentCards(facility.id);
    };

    document.getElementById('projectSaveHeaderBtn').onclick = async () => {
        const projectName = projectNameInput.value.trim();

        if (!projectName) {
            alert('[view_4_modal.js] Notification: Add the project name first. Example: AC Assessment.');
            return;
        }

        const report = loadLocalProjectReport(facility.id);
        report.projectName = projectName;
        saveLocalProjectReport(facility.id, report);

        const description = buildPlainTextReport(facility, report);

        const result = await insertFacilityProject({
            facility_id: facility.id,
            title: projectName,
            description,
            status: 'open'
        });

        if (result.error) {
            alert(`[view_4_modal.js] Database Error: Project was saved locally, but Supabase save failed. ${result.error.message}`);
            return;
        }

        alert('[view_4_modal.js] Saved: Project report header saved.');
        await renderPendingProjectsFn(facility);
    };

    document.getElementById('projectPrintBtn').onclick = () => {
        const report = loadLocalProjectReport(facility.id);
        report.projectName = projectNameInput.value.trim();
        saveLocalProjectReport(facility.id, report);
        window.print();
    };

    document.getElementById('projectEmailBtn').onclick = () => {
        const report = loadLocalProjectReport(facility.id);
        report.projectName = projectNameInput.value.trim();
        saveLocalProjectReport(facility.id, report);

        const subject = encodeURIComponent(`${report.projectName || 'Project Assessment'} - ${facility.name || facility.Name || 'Facility'}`);
        const body = encodeURIComponent(buildPlainTextReport(facility, report));

        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    document.getElementById('projectBackBtn').onclick = () => {
        if (window.navigateTo) {
            window.navigateTo('view_2_controls', facility);
        }
    };

    document.getElementById('projectAssessmentList').onclick = event => {
        const deleteIndex = event.target?.dataset?.deleteAssessment;

        if (deleteIndex === undefined) return;

        const index = Number(deleteIndex);
        const report = loadLocalProjectReport(facility.id);
        report.sections.splice(index, 1);
        saveLocalProjectReport(facility.id, report);
        renderAssessmentCards(facility.id);
    };
}

function clearAssessmentInputs() {
    document.getElementById('assessmentAreaInput').value = '';
    document.getElementById('assessmentConditionInput').value = '';
    document.getElementById('assessmentFixInput').value = '';
    document.getElementById('assessmentNotesInput').value = '';
    document.getElementById('assessmentImagesInput').value = '';
    document.getElementById('assessmentQuotesInput').value = '';
}

function buildPlainTextReport(facility, report) {
    const facilityName = facility.name || facility.Name || 'Facility';
    const projectName = report.projectName || 'Project Assessment';

    let text = '';
    text += `PROJECT REPORT\n`;
    text += `Facility: ${facilityName}\n`;
    text += `Project: ${projectName}\n`;
    text += `Date: ${new Date().toLocaleString()}\n\n`;

    if (!report.sections || report.sections.length === 0) {
        text += 'No assessment sections added yet.\n';
        return text;
    }

    report.sections.forEach((section, index) => {
        text += `SECTION ${index + 1}: ${section.area || 'Assessment'}\n`;
        text += `Condition: ${section.condition || ''}\n`;
        text += `Recommended Fix: ${section.fix || ''}\n`;
        text += `Notes: ${section.notes || ''}\n`;
        text += `Vendor Quotes / Attachments: ${section.quotes || ''}\n`;

        if (section.images && section.images.length > 0) {
            text += `Images:\n`;
            section.images.forEach(image => {
                text += `- ${image}\n`;
            });
        }

        text += `\n`;
    });

    return text;
}

/*================================================================
END FILE: view_4_modal.js
UPDATED: 2026-06-08 @ 09:20 PM
================================================================*/
