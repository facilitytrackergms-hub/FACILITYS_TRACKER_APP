export async function renderImages(relatedType, relatedId) {
    if (!relatedType || !relatedId) return console.error("relatedType and relatedId required");
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = '<p>Loading images...</p>';
    const images = await fetchImages(relatedType, relatedId);

    app.innerHTML = '<div id="imagesContainer" style="display:flex; flex-wrap:wrap; gap:12px;"></div>';
    const container = document.getElementById('imagesContainer');

    if (!images || images.length === 0) {
        container.innerHTML = '<p>No images found.</p>';
    } else {
        images.forEach(img => {
            const card = document.createElement('div');
            card.style.cssText = 'border:1px solid #ccc; padding:8px; border-radius:8px; width:180px; cursor:pointer; text-align:center;';
            card.innerHTML = `
                <img src="${img.image_url}" alt="${img.caption || ''}" style="width:100%; border-radius:6px;"/>
                <p style="margin:4px 0; font-size:0.9em;">${img.caption || ''}</p>
            `;
            card.onclick = () => openImageModal(img, relatedType, relatedId);
            container.appendChild(card);
        });
    }

    const addBtn = document.createElement('button');
    addBtn.innerText = "Add Image";
    addBtn.style.cssText = "margin-top:12px; padding:10px 16px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;";
    addBtn.onclick = () => openImageModal(null, relatedType, relatedId);
    app.appendChild(addBtn);
}
