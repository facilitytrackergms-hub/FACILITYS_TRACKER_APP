export const ModalView = {
    show(facility) {
        const container = document.getElementById('modal-container');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = `
            <div class="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 class="text-xl font-bold text-gray-800 uppercase">${facility.name}</h2>
                <button id="close-modal" class="text-gray-400 hover:text-gray-900 text-2xl transition-colors">&times;</button>
            </div>
            <div class="p-6 space-y-6">
                <div>
                    <h4 class="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Location Details</h4>
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p class="text-sm text-gray-600 font-medium">${facility.address || 'No address registered'}</p>
                        <p class="text-sm text-blue-600 mt-1 font-bold">${facility.phone || 'No phone number'}</p>
                    </div>
                </div>
                <div>
                    <h4 class="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Administrative Notes</h4>
                    <p class="text-sm text-gray-500 italic">${facility.notes || 'No notes for this facility.'}</p>
                </div>
            </div>
        `;

        container.classList.remove('hidden');
        document.getElementById('close-modal').onclick = () => container.classList.add('hidden');
        
        // Also close if clicking outside the white box
        container.onclick = (e) => {
            if (e.target === container) container.classList.add('hidden');
        };
    }
};
