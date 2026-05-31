export const ModalView = {
    show(facility) {
        const container = document.getElementById('modal-container');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = `
            <div class="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 class="text-xl font-bold text-gray-800">${facility.name}</h2>
                <button id="close-modal" class="text-gray-400 hover:text-gray-900 text-2xl">&times;</button>
            </div>
            <div class="p-6 space-y-6">
                <div>
                    <h4 class="text-[10px] font-bold text-gray-400 uppercase mb-2">Location Details</h4>
                    <p class="text-sm text-gray-600">${facility.address || 'Not set'}</p>
                    <p class="text-sm text-gray-600">Phone: ${facility.phone || 'Not set'}</p>
                </div>
                <div>
                    <h4 class="text-[10px] font-bold text-gray-400 uppercase mb-2 text-red-500">Active Issues</h4>
                    ${facility.facility_issues?.length ? 
                        facility.facility_issues.map(i => `<div class="text-xs p-2 bg-red-50 rounded mb-1 border border-red-100">${i.issue}</div>`).join('') 
                        : '<p class="text-xs text-gray-300">No issues reported.</p>'}
                </div>
            </div>
        `;

        container.classList.remove('hidden');
        document.getElementById('close-modal').onclick = () => container.classList.add('hidden');
    }
};
