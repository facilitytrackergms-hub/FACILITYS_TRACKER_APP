/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_vendor.js
SUPABASE TBL : report_attachments
VIEW NAME    : Report Development Vendor Files
POP-UP TITLE : Vendor Quotes / Files
LAST UPDATED : 2026-06-13 @ 02:50 PM
================================================================*/

import { saveAttachment, loadAttachments } from './view_4_report_dev_photos.js';

export function renderVendorSection() {
    return `
        <div class="v4-report-dev-panel">
            <h3>Vendor Quotes / Files</h3>
            <div id="v4ReportDevMessage" class="v4-report-dev-message"></div>

            <label class="v4-report-dev-label">Vendor File Title</label>
            <input id="v4ReportDevVendorTitle" class="v4-report-dev-input" type="text" placeholder="Vendor quote or file title">

            <label class="v4-report-dev-label">File URL</label>
            <input id="v4ReportDevVendorUrl" class="v4-report-dev-input" type="text" placeholder="Paste vendor file URL here">

            <label class="v4-report-dev-label">Description</label>
            <textarea id="v4ReportDevVendorDescription" class="v4-report-dev-textarea" placeholder="Vendor quote or file description"></textarea>

            <button id="v4ReportDevSaveVendorAttachment" class="v4-report-dev-main-btn">
                Save Vendor Quote / File
            </button>

            <div id="v4ReportDevAttachmentList" class="v4-report-dev-list-box">Loading...</div>

            <button id="v4ReportDevBackEditFromVendor" class="v4-report-dev-main-btn secondary">
                Back To Edit Report Sections
            </button>
        </div>
    `;
}

export async function saveVendorAttachment(context) {
    await saveAttachment(
        context,
        'vendor_quote_file',
        document.getElementById('v4ReportDevVendorTitle')?.value || 'Vendor Quote / File',
        document.getElementById('v4ReportDevVendorUrl')?.value || '',
        document.getElementById('v4ReportDevVendorDescription')?.value || '',
        null
    );
}

export async function loadVendorAttachments(context) {
    await loadAttachments(context);
}

/*================================================================
END FILE: view_4_report_dev_vendor.js
================================================================*/
