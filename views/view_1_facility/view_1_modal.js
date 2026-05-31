// views/view_1_facility/view_1_modal.js
export const ModalView = {
    show(facility) {
        const container = document.getElementById('modal-container');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = `
            <div class="p-6 border-b flex justify-between items-center">
                <h2 class="text-xl font-bold">${facility.name}</h2>
                <button id="close-modal" class="text-gray-400 text-2xl">&times;</button>
            </div>
            <div class="p-6">
                <p class="text-sm text-gray-600"><strong>Address:</strong> ${facility.address || 'N/A'}</p>
                <p class="text-sm mt-4 italic">${facility.notes || 'No notes.'}</p>
            </div>
        `;
        container.classList.remove('hidden');
        document.getElementById('close-modal').onclick = () => container.classList.add('hidden');
    }
};
