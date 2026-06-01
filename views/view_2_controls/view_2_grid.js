import { fetchFacilityContacts, fetchFacilityProjects } from './view_2_data.js';
import { renderContactsDashboard } from '../view_3_contacts/view_3_grid.js';
import { renderPendingProjects } from '../view_4_projects/view_4_grid.js';
import { renderFacilityImages } from '../view_6_images/view_6_grid.js';
import { renderIndividualConcerns } from '../view_5_issues/view_5_grid.js';


export function renderFacilityControls(facility) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div style="padding:20px; font-family:Arial; text-align:center;">
            <h1 style="margin-bottom:20px; font-size:22px;">${facility.name} Controls</h1>

            <div style="display:flex; flex-direction:column; gap:12px; max-width:400px; margin:0 auto;">
                <button id="individualConcernsBtn" style="padding:14px; background:#28a745; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                    INDIVIDUAL CONCERNS
                </button>
                <button id="manageContactsBtn" style="padding:14px; background:#f5c400; color:black; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                    MANAGE CONTACTS
                </button>
                <button id="pendingProjectsBtn" style="padding:14px; background:#00264d; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                    PENDING PROJECTS
                </button>
                <button id="imageGalleryBtn" style="padding:14px; background:#10b981; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                    IMAGE GALLERY
                </button>
                <button id="backBtn" style="padding:14px; background:#6b7280; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                    BACK TO DASHBOARD
                </button>
            </div>
        </div>
    `;

    document.getElementById('individualConcernsBtn').onclick = async () => {
        if (window.navigateTo) window.navigateTo('view5_issues', { facility });
        else renderIndividualConcerns({ facility });
    };

    document.getElementById('manageContactsBtn').onclick = async () => {
        if (window.navigateTo) window.navigateTo('view3_contacts', { facility });
        else renderContactsDashboard({ facility });
    };

    document.getElementById('pendingProjectsBtn').onclick = async () => {
        if (window.navigateTo) window.navigateTo('view4_projects', { facility });
        else renderPendingProjects({ facility });
    };

    document.getElementById('imageGalleryBtn').onclick = async () => {
        if (window.navigateTo) window.navigateTo('view6_images', { facility });
        else renderFacilityImages({ facility });
    };

    document.getElementById('backBtn').onclick = () => {
        if (window.navigateTo) window.navigateTo('view1_facilities');
    };
}
