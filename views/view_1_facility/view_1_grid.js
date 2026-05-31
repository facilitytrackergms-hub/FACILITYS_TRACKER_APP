// views/view_1_facility/view_1_grid.js
import { ModalView } from './view_1_modal.js';

export const GridView = {
    render(containerId, facilities) {
        const container = document.getElementById(containerId);
        
        container.innerHTML = facilities.map(f => `
            <div class="fac-card bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-lg cursor-pointer transition shadow-sm" 
                 id="card-${f.id}">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-gray-800 uppercase">${f.name}</h3>
                    <span class="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">${f.status || 'ACTIVE'}</span>
                </div>
                <p class="text-gray-500 text-xs mt-2">${f.address || 'No Address'}</p>
            </div>
        `).join('');

        // Add click events to cards
        facilities.forEach(f => {
            document.getElementById(`card-${f.id}`).onclick = () => ModalView.show(f);
        });
    }
};
