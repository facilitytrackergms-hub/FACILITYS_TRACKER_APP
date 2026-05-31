export const GridView = {
    render(containerId, facilities, onCardClick) {
        const container = document.getElementById(containerId);
        container.innerHTML = facilities.map(f => `
            <div class="facility-card bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 cursor-pointer transition-all shadow-sm hover:shadow-md" data-id="${f.id}">
                <h3 class="font-black text-slate-800 text-lg">${f.name}</h3>
                <p class="text-slate-400 text-sm mb-4">${f.address || 'Location Pending'}</p>
                <div class="flex gap-3">
                    <span class="text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-600 rounded-md uppercase">${f.facility_issues.length} Issues</span>
                    <span class="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-600 rounded-md uppercase">${f.facility_projects.length} Projects</span>
                </div>
            </div>
        `).join('');

        // Add click events to cards
        document.querySelectorAll('.facility-card').forEach(card => {
            card.onclick = () => onCardClick(card.dataset.id);
        });
    }
};
