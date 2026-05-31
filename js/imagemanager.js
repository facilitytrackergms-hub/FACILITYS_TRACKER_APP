/* =================================================
FILE: js/imagemanager.js
UPDATED: 2026-05-30
================================================= */

export function renderImageManagerSection(container, type, id, options = {}) {
    container.innerHTML = '';

    const title = options.title || 'Images';
    const section = document.createElement('div');
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.gap = '10px';

    // Title
    const heading = document.createElement('h4');
    heading.textContent = title;
    heading.style.marginBottom = '10px';
    section.appendChild(heading);

    // Image list container
    const list = document.createElement('div');
    list.id = `${type}-image-list-${id}`;
    list.style.display = 'flex';
    list.style.flexWrap = 'wrap';
    list.style.gap = '10px';
    section.appendChild(list);

    // Add Image button
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Image';
    addBtn.style.padding = '8px 12px';
    addBtn.style.cursor = 'pointer';
    addBtn.style.background = '#28a745';
    addBtn.style.color = '#fff';
    addBtn.style.border = 'none';
    addBtn.style.borderRadius = '5px';

    addBtn.onclick = () => {
        const url = prompt('Enter Image URL:');
        if (!url) return;

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Facility Image';
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        img.style.border = '1px solid #ccc';
        img.style.borderRadius = '5px';
        img.style.cursor = 'pointer';

        img.onclick = () => {
            if (confirm('Remove this image?')) img.remove();
        };

        list.appendChild(img);
    };

    section.appendChild(addBtn);
    container.appendChild(section);
}
