/* =================================================
FILE: views/view_7_followups/view_7_grid.js
UPDATED: 2026-06-04 10:15:00 PM

STRICT HEADER RULE:
Do not ever remove or change this header section.
Always keep the header at the top of current files and new files.
================================================= */
import { fetchIssueFollowups, deleteIssueFollowup } from './view_7_data.js';
import { setupFollowupsEvents } from './view_7_modal.js';

export async function renderIssueFollowups(data, issueContext = null) {
    const app = document.getElementById('app');
    if (!app) return;

    const facility = data?.facility ? data.facility : data;
    const issue = data?.issue ? data.issue : issueContext;

    // Pull the original creator's name cleanly from any available issue fields
    const issueCreatorName = issue?.reported_by || issue?.initiated_by || issue?.reported_by_text || 'Staff Member';

    // Extract the dynamic problem/issue title cleanly instead of a fallback string
    const dynamicIssueTitle = issue?.issue_title || issue?.title || 'Maintenance Request';

    const styles = `
        <style>
            .followups-container { padding:20px; font-family:Arial; background:#f3f4f6; min-height:100vh; text-align:center; box-sizing:border-box; }
            .followups-title { color:#00264d; font-size:22px; text-transform:uppercase; margin:0 0 5px 0; }
            .followups-subtitle { color:#4b5563; margin:0 0 5px 0; font-size:14px; }
            .followups-creator-badge { color:#0369a1; font-size:13px; font-weight:bold; margin:0 0 25px 0; display:block; }
            .followups-stack { display:flex; flex-direction:column; gap:12px; max-width:400px; margin:0 auto; }
            .followup-btn { background:#00264d; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; width:100%; box-shadow:0 2px 4px rgba(0,0,0,0.1); }
            .followup-btn:hover { background:#001a33; }
            .followup-btn-secondary { background:#4b5563; color:white; margin-top:0px; }
            .followup-btn-secondary:hover { background:#374151; }
            .followup-btn-danger { background:#dc2626; color:white; margin-top:4px; }
            .followup-btn-danger:hover { background:#b91c1c; }
            .followup-feed { margin-top:25px; text-align:left; display:flex; flex-direction:column; gap:10px; max-width:400px; margin-left:auto; margin-right:auto; }
            .followup-card { background:white; padding:15px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); border-left:4px solid #00264d; cursor:pointer; transition:transform 0.1s ease; }
            .followup-card:hover { transform:translateY(-1px); box-shadow:0 3px 6px rgba(0,0,0,0.12); }
            .followup-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px dashed #e5e7eb; padding-bottom:4px; gap:8px; }
            .followup-type-badge { background:#e0f2fe; color:#0369a1; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; text-transform:uppercase; }
            .followup-meta-text { font-size:11px; color:#6b7280; flex-grow:1; text-align:right; }
            .followup-body-desc { font-size:13px; color:#1f2937; line-height:1.4; word-break:break-word; }
            .followup-thumb-img { width:100%; max-height:180px; object-fit:cover; border-radius:6px; margin-top:10px; border:1px solid #e5e7eb; }
            
            /* Custom Prompt overlay sheets */
            .custom-overlay-panel { position:fixed; z-index:20000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:none; align-items:center; justify-content:center; font-family:Arial, sans-serif; box-sizing:border-box; padding:15px; }
            .custom-overlay-card { background:white; padding:24px; border-radius:12px; max-width:360px; width:100%; box-shadow:0 10px 25px rgba(0,0,0,0.2); text-align:left; box-sizing:border-box; }
            .overlay-headline { font-size:16px; font-weight:bold; color:#00264d; text-transform:uppercase; margin:0 0 12px 0; text-align:center; }
            .overlay-bodytext { font-size:13px; color:#4b5563; margin:0 0 20px 0; line-height:1.4; }
            .overlay-message-box { background:#f3f4f6; padding:12px; border-radius:6px; font-size:12px; font-family:monospace; color:#1f2937; border:1px solid #e5e7eb; margin-bottom:15px; word-break:break-word; max-height:120px; overflow-y:auto; }
            .overlay-action-btn { width:100%; padding:12px; border-radius:6px; border:none; font-weight:bold; font-size:12px; text-transform:uppercase; cursor:pointer; margin-bottom:8px; text-align:center; }
            
            /* Inline Log Deletion Button Element Styles */
            .inline-log-delete-trigger { background:none; border:none; color:#dc2626; font-size:14px; cursor:pointer; padding:2px 6px; font-weight:bold; border-radius:4px; display:inline-flex; align-items:center; justify-content:center; transition: background 0.2s ease; }
            .inline-log-delete-trigger:hover { background:#fee2e2; }
        </style>
    `;

    app.innerHTML = `
        ${styles}
        <div class="followups-container">
            <div style="background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 20px; display: inline-block;">
                📍 Base View: VIEW_7_FOLLOWUPS (Logs Dashboard)
            </div>

            <h2 class="followups-title">Issue Logs</h2>
            <p class="followups-subtitle">Thread ID: #${issue?.id || 'N/A'} - ${dynamicIssueTitle}</p>
            <span class="followups-creator-badge">👤 Created By: ${issueCreatorName}</span>
            
            <div class="followups-stack">
                <button id="addNewFollowupBtn" class="followup-btn">➕ Add Activity Log</button>
                <button id="backToIssuesBtn" class="followup-btn-secondary followup-btn">⬅️ Back To Facility Issues</button>
                <button id="deleteMainIssueBtn" class="followup-btn-danger followup-btn">🔴 Delete Issue Request</button>
            </div>

            <div id="followupsFeedDisplay" class="followup-feed">
                <span style="color:#6b7280; font-size:13px; font-style:italic; text-align:center;">Loading historical logs...</span>
            </div>
        </div>

        <div id="followupModal" style="display:none; position:fixed; z-index:10000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); box-sizing:border-box;">
            <div style="background:white; max-width:380px; margin:10% auto; padding:20px; border-radius:10px; position:relative; font-family:Arial; box-sizing:border-box;">
                <span id="closeFollowupModal" style="position:absolute; right:15px; top:10px; font-size:22px; cursor:pointer; color:#9ca3af; font-weight:bold;">&times;</span>
                <h3 id="followupModalTitle" style="margin:0 0 5px 0; color:#00264d; font-size:16px; text-transform:uppercase;">Log Action Event</h3>
                
                <input type="hidden" id="followupId" />
                <input type="hidden" id="followupImageUrl" value="" />
                
                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-top:12px; margin-bottom:4px; text-transform:uppercase;">Action Category</label>
                <select id="actionTypeInput" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; background:#f9fafb;">
                    <option value="Comment">Comment / Note</option>
                    <option value="Inspection">Site Inspection</option>
                    <option value="Repair Step">Repair Action Item</option>
                    <option value="Resolution">Final Resolution Code</option>
                </select>

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Executed By / Reporter</label>
                <input type="text" id="actionByInput" value="${issueCreatorName}" placeholder="Enter full identity name" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; box-sizing:border-box;" />

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Detailed Description Summary</label>
                <textarea id="descriptionInput" rows="4" placeholder="Describe findings, progress updates, or changes made..." style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #d1d5db; border-radius:6px; font-size:13px; font-family:Arial; resize:vertical; box-sizing:border-box;"></textarea>

                <label style="display:block; font-size:11px; font-weight:bold; color:#374151; margin-bottom:4px; text-transform:uppercase;">Follow-up Media Capture</label>
                <div id="followup-image-section" style="margin-bottom:15px; padding:10px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px;">
                    <div id="followup-image-container"></div>
                </div>

                <button id="saveFollowupBtn" style="width:100%; background:#28a745; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:13px; text-transform:uppercase;">Save Activity Entry</button>
            </div>
        </div>

        <div id="customConfirmPopup" class="custom-overlay-panel">
            <div class="custom-overlay-card" style="text-align:center;">
                <div class="overlay-headline">🎉 Activity Log Saved</div>
                <div id="customConfirmText" class="overlay-bodytext">Would you like to inform the creator of this issue right now?</div>
                <button id="customConfirmYesBtn" class="overlay-action-btn" style="background:#00264d; color:white;">📢 Yes, Notify Creator</button>
                <button id="customConfirmNoBtn" class="overlay-action-btn" style="background:#e5e7eb; color:#1f2937;">❌ No, Skip</button>
            </div>
        </div>

        <div id="customMethodPopup" class="custom-overlay-panel">
            <div class="custom-overlay-card">
                <div class="overlay-headline">📢 Delivery Pipeline Preview</div>
                <div id="customMethodIntroText" class="overlay-bodytext" style="font-weight:bold; color:#1f2937; margin-bottom:10px;"></div>
                <div class="overlay-bodytext" style="margin-bottom:6px; font-size:12px; font-weight:bold; text-transform:uppercase; color:#4b5563;">Outbound Message Content:</div>
                <div id="customMessagePreviewBox" class="overlay-message-box"></div>
                
                <button id="methodSmsBtn" class="overlay-action-btn" style="background:#28a745; color:white;">📱 Send Text Message (SMS)</button>
                <button id="methodEmailBtn" class="overlay-action-btn" style="background:#0369a1; color:white;">📧 Send Email Update</button>
                <button id="methodCallBtn" class="overlay-action-btn" style="background:#4b5563; color:white;">📞 Place Phone Call</button>
                <button id="methodCancelBtn" class="overlay-action-btn" style="background:#f3f4f6; color:#6b7280; font-size:11px; margin-top:5px;">⬅️ Go Back</button>
            </div>
        </div>
    `;

    document.getElementById('backToIssuesBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view_5_issues', { facility: facility });
    };

    // FIXED DELETION logic + view clearing router mechanics
    document.getElementById('deleteMainIssueBtn').onclick = async () => {
        if (!issue || !issue.id) {
            alert("Unable to locate a valid issue identifier reference.");
            return;
        }

        const confirmDelete = confirm('Are you completely sure you want to permanently delete this issue? This will clear all recorded progress records.');
        if (!confirmDelete) return;

        try {
            let success = false;
            
            // Look for your database CRUD engine first
            if (window.crudEngine && window.crudEngine.deleteRow) {
                await window.crudEngine.deleteRow('facility_issues_table', issue.id);
                success = true;
            } else if (window.deleteFacilityIssueRecord) {
                await window.deleteFacilityIssueRecord(issue.id);
                success = true;
            } else {
                // Dynamic fallback loader to view_5's data modules
                const dataMod = await import('../view_5_issues/view_5_data.js').catch(() => null);
                if (dataMod && typeof dataMod.deleteFacilityIssue === 'function') {
                    success = await dataMod.deleteFacilityIssue(issue.id);
                }
            }

            // Fallback back-end endpoint request check if modules didn't intercept
            if (!success) {
                const response = await fetch(`/api/issues/${issue.id}`, { method: 'DELETE' });
                success = response.ok;
            }

            if (success) {
                alert('Issue Request successfully removed.');
                
                // Clear state row configurations from parent data stores if present
                if (window.facilityIssuesData) {
                    window.facilityIssuesData = window.facilityIssuesData.filter(item => item.id !== issue.id);
                }

                if (window.navigateTo) {
                    // Navigate back and force complete re-render context payload execution
                    window.navigateTo('view_5_issues', { facility: facility, forceRefresh: true, reload: true });
                    
                    // Safe timeout window fallback to clear layout DOM if view caching engine is used
                    setTimeout(() => {
                        const badRow = document.querySelector(`[data-id="${issue.id}"], tr[id="${issue.id}"]`);
                        if (badRow) badRow.remove();
                    }, 150);
                } else {
                    window.location.hash = '#view_5_issues';
                    window.location.reload();
                }
            } else {
                alert("Database synchronization error removing the selected issue tracking record row.");
            }
        } catch (error) {
            console.error('Deletion operation error:', error);
            alert('An application exception occurred while attempting to delete this request.');
        }
    };

    setupFollowupsEvents(facility, issue, renderIssueFollowups);

    async function loadFollowupsDisplayFeed() {
        const feed = document.getElementById('followupsFeedDisplay');
        if (!feed || !issue?.id) return;

        const followups = await fetchIssueFollowups(issue.id);
        feed.innerHTML = '';

        if (!followups || followups.length === 0) {
            feed.innerHTML = '<div style="text-align:center; padding:20px; background:white; border-radius:8px; color:#6b7280; font-size:13px;">No historic activity logs documented for this issue thread.</div>';
            return;
        }

        followups.forEach(f => {
            const card = document.createElement('div');
            card.className = 'followup-card';
            
            const imageMarkup = f.followup_image_url ? `<img src="${f.followup_image_url}" class="followup-thumb-img" alt="Attached evidence">` : '';
            
            card.innerHTML = `
                <div class="followup-card-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="followup-type-badge">${f.followup_title || 'Comment'}</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="followup-meta-text">By: <strong>${f.reported_by_text || f.initiated_by_text || issueCreatorName}</strong></span>
                        <button class="inline-log-delete-trigger" title="Delete Log Entry">🗑️</button>
                    </div>
                </div>
                <div class="followup-body-desc">${f.followup_notes_text || ''}</div>
                ${imageMarkup}
            `;
            
            card.onclick = () => {
                if (window.openSelectedFollowupInModal) window.openSelectedFollowupInModal(f);
            };

            const deleteTrigger = card.querySelector('.inline-log-delete-trigger');
            if (deleteTrigger) {
                deleteTrigger.onclick = async (e) => {
                    e.stopPropagation();
                    
                    if (confirm(`Are you completely sure you want to permanently erase this specific log update entry? This action cannot be reversed.`)) {
                        deleteTrigger.innerText = "⏳";
                        deleteTrigger.style.pointerEvents = "none";
                        
                        const success = await deleteIssueFollowup(f.id);
                        if (success) {
                            await loadFollowupsDisplayFeed();
                        } else {
                            alert("Database layer synchronization exception error removing selected activity entry log row.");
                            deleteTrigger.innerText = "🗑️";
                            deleteTrigger.style.pointerEvents = "auto";
                        }
                    }
                };
            }

            feed.appendChild(card);
        });
    }

    window.triggerNotificationPipelinePrompt = function(savedLog, currentIssue) {
        const creator = savedLog.reported_by_text || currentIssue.reported_by || currentIssue.initiated_by || issueCreatorName;
        const phone = currentIssue.contact_phone || currentIssue.phone || '';
        const email = currentIssue.contact_email || currentIssue.email || '';
        const issueTitle = currentIssue.title || 'Reported Issue';
        
        const confirmPopup = document.getElementById('customConfirmPopup');
        const methodPopup = document.getElementById('customMethodPopup');
        
        document.getElementById('customConfirmText').innerText = `Activity Log Successfully Saved!\n\nWould you like to inform the creator of this issue (${creator}) right now?`;
        confirmPopup.style.display = 'flex';

        document.getElementById('customConfirmNoBtn').onclick = () => { confirmPopup.style.display = 'none'; };
        
        document.getElementById('customConfirmYesBtn').onclick = () => {
            confirmPopup.style.display = 'none';
            document.getElementById('customMethodIntroText').innerText = `You are about to notify ${creator} regarding the issue: "${issueTitle}".`;
            
            let msgText = `Hi ${creator}, progress update on your issue (#${currentIssue.id || 'Log'}): "${savedLog.followup_title} - ${savedLog.followup_notes_text}".`;
            if (savedLog.followup_image_url) {
                msgText += ` View Attached Photo Proof: ${savedLog.followup_image_url}`;
            }
            
            document.getElementById('customMessagePreviewBox').innerText = msgText;
            methodPopup.style.display = 'flex';
        };

        document.getElementById('methodCancelBtn').onclick = () => { methodPopup.style.display = 'none'; };

        document.getElementById('methodSmsBtn').onclick = () => {
            methodPopup.style.display = 'none';
            let msgText = document.getElementById('customMessagePreviewBox').innerText;
            window.location.href = `sms:${phone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(msgText)}`;
        };

        document.getElementById('methodEmailBtn').onclick = () => {
            methodPopup.style.display = 'none';
            let msgText = document.getElementById('customMessagePreviewBox').innerText;
            window.location.href = `mailto:${email}?subject=${encodeURIComponent('Maintenance Progress Update')}&body=${encodeURIComponent(msgText)}`;
        };

        document.getElementById('methodCallBtn').onclick = () => {
            methodPopup.style.display = 'none';
            window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
        };
    };

    await loadFollowupsDisplayFeed();
}
