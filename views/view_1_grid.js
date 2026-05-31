export const GridView = {
    render(containerId, facilities, onCardClick) {
        const container = document.getElementById(containerId);
        if (!facilities.length) {
            container.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">No facilities found. Add one above!</p>`;
            return;
        }

        container.innerHTML = facilities.map(f => `
            <div class="fac-card bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-500 cursor-pointer transition shadow-sm" data-id="${f.id}">
                <h3 class="font-bold text-gray-800 text-lg uppercase">${f.name}</h3>
                <p class="text-gray-400 text-xs mt-1 mb-4 italic">${f.address || 'No Address Provided'}</p>
                <div class="flex gap-2">
                    <span class="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-600 rounded">ISSUES: ${f.facility_issues?.length || 0}</span>
                    <span class="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-600 rounded">PROJECTS: ${f.facility_projects?.length || 0}</span>
                </div>
            </div>
        `).join('');

        // Attach click listeners to cards
        container.querySelectorAll('.fac-card').forEach(card => {
            card.onclick = () => onCardClick(card.dataset.id);
        });
    }
};
