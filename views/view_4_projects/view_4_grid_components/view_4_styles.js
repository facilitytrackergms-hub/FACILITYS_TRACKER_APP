/*================================================================
FILE METADATA
================================================================
FILE NAME    : view_4_styles.js
SUPABASE TBL : none
VIEW NAME    : View 4 Shared Styles
POP-UP TITLE : Shared Styles
LAST UPDATED : 2026-06-09 @ 01:45 AM
================================================================*/
const __FILENAME = 'view_4_styles.js';

export function renderStyles() {
    return `
        <style>
            .vendor-cabinet-shell { padding:18px; background:#f3f4f6; min-height:100vh; box-sizing:border-box; font-family:Arial, sans-serif; }
            .vendor-cabinet-card { max-width:850px; margin:0 auto; background:white; border-radius:14px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
            .vendor-cabinet-title { color:#00264d; font-size:22px; text-align:center; margin:0 0 5px 0; text-transform:uppercase; }
            .vendor-cabinet-sub { text-align:center; color:#4b5563; font-size:14px; margin:0 0 15px 0; }
            .cabinet-action-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:14px 0; }
            .single-action-grid { grid-template-columns:1fr 1fr; }
            .cabinet-btn { border:none; background:#00264d; color:white; border-radius:8px; padding:13px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:13px; }
            .cabinet-btn-green { background:#28a745; }
            .cabinet-btn-gray { background:#6b7280; }
            .cabinet-section { margin-top:18px; }
            .cabinet-section-title { color:#00264d; font-size:15px; margin:0 0 8px 0; text-transform:uppercase; border-bottom:2px solid #00264d; padding-bottom:5px; }
            .cabinet-card-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:10px; }
            .cabinet-stack { display:flex; flex-direction:column; gap:8px; }
            .project-button-grid { display:grid; grid-template-columns:1fr; gap:10px; }
            .project-button { border:none; background:#00264d; color:white; border-radius:10px; padding:16px; text-align:center; cursor:pointer; display:flex; flex-direction:column; gap:5px; text-transform:uppercase; }
            .project-button:hover { filter:brightness(1.08); }
            .project-button-title { font-weight:bold; font-size:15px; }
            .project-button-sub { font-size:12px; color:#dbeafe; text-transform:none; font-weight:normal; }
            .project-detail-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:12px; font-size:13px; color:#374151; line-height:1.6; margin:12px 0; }
            .project-action-row { border:1px solid #d1d5db; border-left:5px solid #28a745; border-radius:10px; padding:12px; background:#fff; }
            .project-action-title { color:#00264d; font-weight:bold; font-size:14px; }
            .project-action-note { color:#374151; margin-top:5px; font-size:13px; white-space:pre-wrap; }
            .project-action-meta { color:#6b7280; margin-top:6px; font-size:11px; text-transform:uppercase; }
            .vendor-card-btn, .job-row-btn { text-align:left; border:1px solid #d1d5db; background:#ffffff; border-radius:10px; padding:13px; cursor:pointer; display:flex; flex-direction:column; gap:4px; }
            .vendor-card-btn:hover, .job-row-btn:hover { border-color:#00264d; }
            .vendor-card-title, .job-row-title { color:#00264d; font-weight:bold; font-size:14px; }
            .vendor-card-sub, .job-row-sub { color:#6b7280; font-size:12px; }
            .vendor-card-image { width:100%; height:95px; object-fit:cover; border-radius:8px; border:1px solid #d1d5db; margin-bottom:6px; }
            .vendor-card-placeholder { width:100%; height:95px; border-radius:8px; border:1px dashed #d1d5db; display:flex; align-items:center; justify-content:center; font-size:32px; background:#f9fafb; margin-bottom:6px; }
            .vendor-card-website { color:#2563eb; font-size:11px; word-break:break-word; }
            .vendor-main-image { width:100%; max-height:240px; object-fit:cover; border-radius:10px; border:1px solid #d1d5db; margin-bottom:12px; }
            .cabinet-empty { color:#6b7280; font-size:13px; text-align:center; padding:14px; border:1px dashed #d1d5db; border-radius:10px; background:#f9fafb; }
            .cabinet-modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:50; padding:20px; overflow:auto; align-items:flex-start; justify-content:center; }
            .cabinet-modal-body { background:white; width:100%; max-width:430px; border-radius:12px; padding:18px; box-sizing:border-box; margin-top:20px; box-shadow:0 4px 16px rgba(0,0,0,0.2); }
            .cabinet-modal-body h3 { color:#00264d; margin:0 0 12px 0; text-transform:uppercase; }
            .cabinet-modal-body label { display:block; font-size:12px; font-weight:bold; color:#374151; margin-top:10px; text-transform:uppercase; }
            .cabinet-input { width:100%; box-sizing:border-box; padding:10px; border:1px solid #d1d5db; border-radius:7px; margin-top:4px; font-size:14px; }
            .cabinet-textarea { min-height:70px; resize:vertical; }
            .custom-modal-notice { background:#fff7ed; border:1px solid #fed7aa; color:#9a3412; border-radius:8px; padding:10px; margin:12px 0; font-size:13px; text-align:center; }
            .vendor-info-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:12px; font-size:13px; color:#374151; line-height:1.6; }
            .file-card { border:1px solid #d1d5db; border-radius:10px; padding:10px; color:#00264d; text-decoration:none; display:flex; flex-direction:column; gap:6px; min-height:90px; justify-content:center; align-items:center; text-align:center; }
            .file-card img { max-width:100%; width:110px; height:90px; object-fit:cover; border-radius:8px; }
            .file-icon { font-size:30px; }
            .file-card small { color:#6b7280; }
            .job-main-image { width:100%; max-height:260px; object-fit:cover; border-radius:10px; border:1px solid #d1d5db; margin-bottom:12px; }
            .followup-row { border:1px solid #d1d5db; border-left:5px solid #00264d; border-radius:10px; padding:12px; background:#fff; }
            .followup-title { color:#00264d; font-weight:bold; text-transform:uppercase; font-size:12px; }
            .followup-note { color:#374151; margin-top:5px; font-size:14px; white-space:pre-wrap; }
            .followup-meta { color:#6b7280; margin-top:6px; font-size:12px; }
            .ui-metadata-tag-view4 { margin-top:20px; font-size:10px; color:#9ca3af; font-family:monospace; text-align:center; }
        </style>
    `;
}

/*================================================================
END FILE: view_4_styles.js
UPDATED: 2026-06-09 @ 01:45 AM
================================================================*/
