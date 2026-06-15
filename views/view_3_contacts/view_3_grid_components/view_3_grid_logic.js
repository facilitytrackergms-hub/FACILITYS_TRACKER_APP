let activeContact = null;

export function initializeGridLogic(data) {

    const gridView = document.getElementById('gridView');
    const detailView = document.getElementById('detailView');

    const contactsGrid = document.getElementById('contactsGrid');

    const addContactBtn = document.getElementById('addContactBtn');
    const backBtn = document.getElementById('backBtn');

    const nameEl = document.getElementById('name');
    const infoEl = document.getElementById('info');
    const historyEl = document.getElementById('history');

    function showGrid() {
        detailView.style.display = 'none';
        gridView.style.display = 'block';
    }

    function showDetail(contact) {
        activeContact = contact;

        gridView.style.display = 'none';
        detailView.style.display = 'block';

        nameEl.textContent = contact.name;
        infoEl.textContent = contact.role;

        historyEl.textContent = 'No history yet';
    }

    function loadContacts() {

        // replace with real API later
        const contacts = [
            { id:1, name:'John Smith', role:'Manager' },
            { id:2, name:'Sarah Lee', role:'Maintenance' }
        ];

        contactsGrid.innerHTML = '';

        contacts.forEach(c => {
            const div = document.createElement('div');
            div.className = 'card';
            div.textContent = c.name;

            div.onclick = () => showDetail(c);

            contactsGrid.appendChild(div);
        });
    }

    addContactBtn.onclick = () => {
        alert('Add Contact Form Here');
    };

    backBtn.onclick = () => {
        showGrid();
    };

    loadContacts();
}
