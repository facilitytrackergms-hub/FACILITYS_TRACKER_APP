export const GridView = {
    render(containerId, facilities, onCardClick) {
        const container = document.getElementById(containerId);
        
        container.innerHTML = facilities.map(f => `
            <div class="fac-card bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-lg cursor-pointer transition shadow-sm" data-id="${f.id}">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-gray-800 text-lg uppercase">${f.name}</h3>
                    <span class="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">${f.status || 'NEW'}</span>
                </div>
                <p class="text-gray-500 text-xs mt-2 italic">${f.address || 'No Address'}</p>
                <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span class="text-blue-600 font-bold text-xs">${f.phone || 'No Phone'}</span>
                    <button class="text-gray-400 hover:text-blue-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.fac-card').forEach(card => {
            card.onclick = () => onCardClick(card.dataset.id);
        });
    }
};
