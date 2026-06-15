let activeContact = null;

export function initializeGridLogic(data) {
    const gridView = document.getElementById('gridView');
    const detailView = document.getElementById('detailView');

    const contactsGrid = document.getElementById('contactsGrid');

    const addContactBtn = document.getElementById('addContactBtn');
    const closeDetailBtn = document.getElementById('closeDetailBtn');

    const contactName = document.getElementById('contactName');
    const contactInfo = document.getElementById('contactInfo');
    const historyBox = document.getElementById('historyBox');

    function showGrid() {
        detailView.style.display = 'none';
        gridView.style.display = 'block';
    }

    function showDetail(contact) {
        activeContact = contact;

        gridView.style.display = 'none';
        detailView.style.display = 'block';

        contactName.textContent = contact.name || 'Contact';
        contactInfo.textContent = contact.role || '';

        historyBox.textContent = 'No history loaded';
    }

    function renderContacts() {
        const fakeData = [
            { id:1, name:'John Smith', role:'Manager' },
            { id:2, name:'Sarah Lee', role:'Tech' }
        ];

        contactsGrid.innerHTML = '';

        fakeData.forEach(c => {
            const div = document.createElement('div');
            div.className = 'card';
            div.textContent = c.name;

            div.onclick = () => showDetail(c);

            contactsGrid.appendChild(div);
        });
    }

    addContactBtn.onclick = () => {
        alert('Add Contact');
    };

    closeDetailBtn.onclick = () => {
        showGrid();
    };

    renderContacts();
}
