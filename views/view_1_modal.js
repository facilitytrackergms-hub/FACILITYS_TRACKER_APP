export const ModalView = {
    show(facility) {
        const modal = document.getElementById('modal-container');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = `
            <div class="p-6 bg-slate-50 border-b flex justify-between items-center">
                <h2 class="text-xl font-black text-slate-800">${facility.name}</h2>
                <button id="close-modal" class="text-slate-400 hover:text-slate-900 text-2xl">&times;</button>
            </div>
            <div class="p-6 space-y-4">
                <p class="text-sm text-slate-500 font-bold uppercase tracking-tighter">Current Issues</p>
                ${facility.facility_issues.map(i => `
                    <div class="p-3 bg-white border border-slate-100 rounded-xl text-sm shadow-sm">${i.issue}</div>
                `).join('') || '<p class="text-slate-300">No issues found.</p>'}
            </div>
        `;

        modal.classList.remove('hidden');
        document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');
    }
};
