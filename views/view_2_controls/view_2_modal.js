export function openControlModal({ title, contentHTML }) {
    const existing = document.getElementById('controlModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'controlModal';
    modal.style.cssText = `
        position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.5); z-index:1000;
    `;
    modal.innerHTML = `
        <div style="background:white; padding:25px; border-radius:12px; width:100%; max-width:400px; text-align:center;">
            <h2>${title}</h2>
            <div>${contentHTML}</div>
            <button id="closeControlModal" style="margin-top:15px; padding:10px 20px; border:none; border-radius:8px; background:#6b7280; color:white; cursor:pointer;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeControlModal').onclick = () => modal.remove();
}
