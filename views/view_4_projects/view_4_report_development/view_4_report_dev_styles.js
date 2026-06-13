/*================================================================ 
FILE METADATA
================================================================
FILE NAME    : view_4_report_dev_styles.js
SUPABASE TBL : none
VIEW NAME    : Report Development Styles
POP-UP TITLE : None
LAST UPDATED : 2026-06-13 @ 03:10 PM
================================================================*/

export function renderStyles() {
    return `
        <style>
            .v4-report-dev-wrap {
                max-width: 680px;
                margin: 0 auto;
                padding: 14px;
                font-family: Arial, sans-serif;
                color: #17212b;
            }

            .v4-report-dev-header,
            .v4-report-dev-panel {
                background: #ffffff;
                border-radius: 14px;
                padding: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.10);
                margin-bottom: 14px;
            }

            .v4-report-dev-header {
                text-align: center;
            }

            .v4-report-dev-header h2 {
                margin: 8px 0 4px 0;
                font-size: 24px;
            }

            .v4-report-dev-subtitle {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 10px;
            }

            .v4-report-dev-meta,
            .v4-report-dev-note,
            .v4-report-dev-preview-box,
            .v4-report-dev-list-box,
            .v4-report-dev-selected-photo-box {
                text-align: left;
                background: #f7fafc;
                border-radius: 10px;
                padding: 10px;
                line-height: 1.5;
                font-size: 15px;
                margin-bottom: 12px;
            }

            .v4-report-dev-back-btn {
                float: left;
                border: 0;
                border-radius: 9px;
                padding: 8px 12px;
                font-size: 15px;
                cursor: pointer;
                background: #dfe7ef;
                color: #17212b;
            }

            .v4-report-dev-panel h3 {
                margin: 0 0 12px 0;
                font-size: 20px;
                text-align: center;
            }

            .v4-report-dev-main-btn {
                width: 100%;
                border: 0;
                border-radius: 12px;
                padding: 15px;
                margin: 7px 0;
                font-size: 17px;
                font-weight: 700;
                cursor: pointer;
                background: #f6c945;
                color: #17212b;
                text-align: left;
            }

            .v4-report-dev-main-btn.secondary {
                background: #dfe7ef;
            }

            .v4-report-dev-label {
                display: block;
                font-size: 14px;
                font-weight: 700;
                margin: 10px 0 4px 0;
            }

            .v4-report-dev-input,
            .v4-report-dev-textarea {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #d1d5db;
                border-radius: 10px;
                padding: 12px;
                font-size: 16px;
                font-family: Arial, sans-serif;
                margin-bottom: 8px;
            }

            .v4-report-dev-textarea {
                min-height: 110px;
                resize: vertical;
            }

            .v4-report-dev-message {
                display: none;
                border-radius: 10px;
                padding: 10px;
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 10px;
            }

            .v4-report-dev-list-item {
                background: #ffffff;
                border-radius: 9px;
                padding: 9px;
                margin-bottom: 8px;
                border: 1px solid #e5e7eb;
            }

            .v4-report-dev-list-title {
                font-weight: 700;
                margin-bottom: 4px;
            }

            .v4-report-dev-hidden-file {
                display: none;
            }

            .v4-report-dev-photo-preview {
                width: 100%;
                max-height: 280px;
                object-fit: contain;
                border-radius: 10px;
                margin-top: 8px;
                border: 1px solid #e5e7eb;
                background: #ffffff;
            }

            .v4-report-dev-photo-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 12px 0;
            }

            .v4-report-dev-photo-card {
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                padding: 6px;
                overflow: hidden;
            }

            .v4-report-dev-photo-thumb {
                width: 100%;
                height: 115px;
                object-fit: cover;
                border-radius: 8px;
                cursor: zoom-in;
                display: block;
            }

            .v4-report-dev-delete-photo-btn {
                width: 100%;
                border: 0;
                border-radius: 8px;
                padding: 8px;
                margin-top: 6px;
                background: #ef4444;
                color: #ffffff;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
            }

            .v4-report-dev-lightbox {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.92);
                z-index: 9999;
                align-items: center;
                justify-content: center;
            }

            .v4-report-dev-lightbox img {
                max-width: 92vw;
                max-height: 82vh;
                object-fit: contain;
                border-radius: 10px;
                background: #ffffff;
            }

            .v4-report-dev-lightbox-close {
                position: fixed;
                top: 14px;
                right: 18px;
                border: 0;
                background: transparent;
                color: #ffffff;
                font-size: 42px;
                cursor: pointer;
            }

            .v4-report-dev-lightbox-nav {
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                border: 0;
                background: rgba(255,255,255,0.18);
                color: #ffffff;
                font-size: 48px;
                width: 48px;
                height: 70px;
                border-radius: 10px;
                cursor: pointer;
            }

            .v4-report-dev-lightbox-nav.left {
                left: 12px;
            }

            .v4-report-dev-lightbox-nav.right {
                right: 12px;
            }

            .v4-report-dev-version {
                text-align: center;
                margin-top: 14px;
                font-size: 11px;
                color: #6b7280;
            }
        </style>
    `;
}

/*================================================================
END FILE: view_4_report_dev_styles.js
================================================================*/
