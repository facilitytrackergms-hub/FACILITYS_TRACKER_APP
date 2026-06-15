/********************************************************************
FILE: view_3_grid_logic.js
LAYER: BUSINESS LOGIC ONLY
PURPOSE: Clicks, DB, actions, maintenance requests
********************************************************************/

let activeContact = null;

/********************************************************************
INITIALIZE LOGIC
********************************************************************/
export function initializeGridLogic(data) {

    /***********************
    ELEMENTS
    ***********************/
    const gridView = document.getElementById('gridView');
    const detailView = document.getElementById('detailView');

    const grid = document.getElementById('contactsGrid');

    const modal = document.getElementById('addModal');

    const nameEl = document.getElementById('contactName');
    const infoEl = document.getElementById('contactInfo');
    const historyBox = document.getElementById('historyBox');

    /***********************
    MODAL CONTROLS
    ***********************/
    document.getElementById('openAddContact').onclick = () => {
        modal.style.display = 'flex';
    };

    document.getElementById('cancelModal').onclick = () => {
        modal.style.display = 'none';
    };

    /***********************
    SAVE CONTACT (DB READY)
    ***********************/
    document.getElementById('saveContact').onclick = async () => {

        const name = document.getElementById('nameInput').value;
        const role = document.getElementById('roleInput').value;
        const phone = document.getElementById('phoneInput').value;
        const email = document.getElementById('emailInput').value;
        const imageFile = document.getElementById('imageInput').files[0];

        let imageUrl = null;

        /****************************************************
        IMAGE HANDLING HOOK (READY FOR SUPABASE STORAGE)
        ****************************************************/
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);

            // PLACEHOLDER: replace with your storage upload function
            // imageUrl = await uploadToSupabase(formData);
        }

        const newContact = {
            name,
            role,
            phone,
            email,
            image: imageUrl,
            created_at: new Date()
        };

        console.log("SAVE CONTACT:", newContact);

        modal.style.display = 'none';

        renderContacts(); // refresh UI
    };

    /***********************
    LOAD CONTACTS (DB READY HOOK)
    ***********************/
    async function renderContacts() {

        // PLACEHOLDER DATA (replace with Supabase fetch)
        const contacts = [
            { id: 1, name: "John Smith", role: "Manager" },
            { id: 2, name: "Sarah Lee", role: "Tech" }
        ];

        grid.innerHTML = '';

        contacts.forEach(c => {
            const div = document.createElement('div');
            div.className = 'card';
            div.textContent = c.name;

            div.onclick = () => openContact(c);

            grid.appendChild(div);
        });
    }

    /***********************
    OPEN CONTACT DETAIL
    ***********************/
    function openContact(contact) {
        activeContact = contact;

        gridView.style.display = 'none';
        detailView.style.display = 'block';

        nameEl.textContent = contact.name;
        infoEl.textContent = contact.role;

        loadHistory(contact.id);
    }

    /***********************
    LOAD MAINTENANCE HISTORY (DB READY)
    ***********************/
    async function loadHistory(contactId) {

        // PLACEHOLDER: replace with DB call
        const fakeHistory = [
            { title: "AC Issue", status: "Open" },
            { title: "Door Repair", status: "Closed" }
        ];

        historyBox.innerHTML = '';

        fakeHistory.forEach(h => {
            const div = document.createElement('div');
            div.innerHTML = `<b>${h.title}</b> - ${h.status}`;
            historyBox.appendChild(div);
        });
    }

    /***********************
    ADD MAINTENANCE REQUEST
    ***********************/
    document.getElementById('addIssueBtn').onclick = () => {

        if (!activeContact) return;

        console.log("Create issue for:", activeContact);

        // PLACEHOLDER: connect to issue system
        alert("Create Maintenance Request for " + activeContact.name);
    };

    /***********************
    CLOSE DETAIL
    ***********************/
    document.getElementById('closeDetail').onclick = () => {
        detailView.style.display = 'none';
        gridView.style.display = 'block';
    };

    /***********************
    INIT
    ***********************/
    renderContacts();
}
