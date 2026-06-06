/*================================================================
FILE METADATA
================================================================
FILE NAME    : [Insert File Name - e.g., view_1_data.js]
SUPABASE TBL : [Insert Table Name - e.g., facilities]
VIEW NAME    : [Insert View Name - e.g., Add New Facility]
POP-UP TITLE : [Insert Pop-Up Title - e.g., Create Directory Entry]
LAST UPDATED : 2026-06-06 @ 05:09 AM
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
const __FILENAME = 'view_8_grid.js';

import { fetchReportIssues, fetchIssueFollowups, fetchFacilityImages } from './view_8_data.js';

export async function renderReports(data) {
    const app = document.getElementById('app');
    if (!app) return;

    // Unpack unified payload container or fallback safely
    const facility = data?.facility ? data.facility : data;

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center;">
            <h1 style="color:#00264d; font-size:22px;">Facility Report</h1>
            <p style="color:#4b5563; margin-bottom:25px;">Facility: <strong>${facility?.name || facility?.Name || ''}</strong></p>

            <div style="display:flex; flex-direction:column; gap:12px; max-width:700px; margin:0 auto;">
                <button id="backBtn" style="padding:12px; background:#00264d; color:white; border:none; border-radius:8px; cursor:pointer; margin-bottom:20px;">BACK TO DASHBOARD</button>
                <div id="reportContent" style="background:white; padding:15px; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.05); text-align:left;">
                    <div style="text-align:center; color:#94a3b8; font-style:italic;">Compiling summary data...</div>
                </div>
            </div>

            <div style="margin-top:40px; font-size:10px; color:#94a3b8; border-top:1px solid #e5e7eb; padding-top:10px;">
                File: views/view_8_reports/view_8_grid.js | Updated: 2026-06-03 07:10:00 PM
            </div>
        </div>
    `;

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) {
            // Context payload wrapped within object structure matching updated router configurations
            window.navigateTo('view_2_controls', { facility: facility });
        }
    };

    const generateReportHTML = async () => {
        const contentDiv = document.getElementById('reportContent');
        if (!facility?.id) {
            contentDiv.innerHTML = '<p style="color:red; text-align:center;">Missing facility reference.</p>';
            return;
        }

        const issues = await fetchReportIssues(facility.id);

        if (!issues || issues.length === 0) {
            contentDiv.innerHTML = '<p style="color:#64748b; text-align:center; font-style:italic;">No logged issues found for this facility.</p>';
            return;
        }

        let html = '<h3 style="color:#00264d; margin-top:0;">Active & Historic Tracker Overview</h3>';
        html += '<ul style="padding-left:20px; line-height:1.6; color:#333;">';

        for (const issue of issues) {
            const isClosed = issue.status && issue.status.toLowerCase() === 'closed';
            // FIXED: Swapped issue.initiated_by to use the real database column issue.reported_by
            html += `<li style="margin-bottom:20px;"><strong>${issue.description || 'No description logged'}</strong> (Initiated by: ${issue.reported_by || 'Staff'}) - Status: <span style="color:${isClosed ? '#28a745' : '#dc2625'}; font-weight:bold;">${issue.status || 'Open'}</span>`;

            const followups = await fetchIssueFollowups(issue.id);

            if (followups && followups.length > 0) {
                html += '<ul style="padding-left:15px; margin-top:5px; color:#4b5563; font-size:13px; list-style-type:circle;">';
                for (const f of followups) {
                    html += `<li><strong>${f.action_type || 'Action'}</strong> by ${f.action_by || 'N/A'} on ${new Date(f.timestamp).toLocaleDateString()}: ${f.description}</li>`;
                }
                html += '</ul>';
            }

            const images = await fetchFacilityImages(issue.id);

            if (images && images.length > 0) {
                html += '<div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; padding-left:15px;">';
                for (const img of images) {
                    if (img.image_url || img.url) {
                        html += `<img src="${img.image_url || img.url}" style="width:80px; height:60px; object-fit:cover; border-radius:6px; border:1px solid #e5e7eb;">`;
                    }
                }
                html += '</div>';
            }
            html += '</li>';
        }

        html += '</ul>';
        contentDiv.innerHTML = html;
    };

    await generateReportHTML();
}
