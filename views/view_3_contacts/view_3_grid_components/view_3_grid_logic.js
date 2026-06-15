import { supabase } from '../supabaseClient.js';

let activeContact = null;

/********************************************************************
INIT
********************************************************************/
export function initializeGridLogic(data) {

    const gridView = document.getElementById('gridView');
    const detailView = document.getElementById('detailView');

    const grid = document.getElementById('contactsGrid');

    const modal = document.getElementById('addModal');

    const nameEl = document.getElementById('contactName');
    const infoEl = document.getElementById('contactInfo');
    const historyBox = document.getElementById('historyBox');

    const openAdd = document.getElementById('openAddContact');
    const saveBtn = document.getElementById('saveContact');
    const cancelBtn = document.getElementById('cancelModal');

    const backBtn = document.getElementById('backBtn');

    const editBtn = document.getElementById('editBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const issueBtn = document.getElementById('addIssueBtn');

    /****************************************************************
    LOAD CONTACTS
    ****************************************************************/
    async function loadContacts() {

        const { data: contacts, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        grid.innerHTML = '';

        contacts.forEach(c => {
            const div = document.createElement('div');
            div.className = 'card';
            div.textContent = c.name;

            div.onclick = () => openContact(c);

            grid.appendChild(div);
        });
    }

    /****************************************************************
    OPEN CONTACT
    ****************************************************************/
    function openContact(contact) {

        activeContact = contact;

        gridView.style.display = 'none';
        detailView.style.display = 'block';

        nameEl.textContent = contact.name;
        infoEl.textContent = contact.role || '';

        loadHistory(contact.id);
    }

    /****************************************************************
    LOAD MAINTENANCE HISTORY
    ****************************************************************/
    async function loadHistory(contactId) {

        const { data, error } = await supabase
            .from('facility_issues')
            .select('*')
            .eq('reported_by', contactId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        historyBox.innerHTML = '';

        data.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <b>${item.issue_title || 'Issue'}</b><br>
                <small>${item.status || 'open'}</small>
            `;
            historyBox.appendChild(div);
        });
    }

    /****************************************************************
    CREATE CONTACT (WITH IMAGE UPLOAD)
    ****************************************************************/
    saveBtn.onclick = async () => {

        const name = document.getElementById('nameInput').value;
        const role = document.getElementById('roleInput').value;
        const phone = document.getElementById('phoneInput').value;
        const email = document.getElementById('emailInput').value;
        const file = document.getElementById('imageInput').files[0];

        let image_url = null;

        /***********************
        IMAGE UPLOAD
        ***********************/
        if (file) {

            const fileName = `${Date.now()}_${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from('contact-images')
                .upload(fileName, file);

            if (!uploadError) {
                const { data } = supabase.storage
                    .from('contact-images')
                    .getPublicUrl(fileName);

                image_url = data.publicUrl;
            }
        }

        /***********************
        INSERT CONTACT
        ***********************/
        const { error } = await supabase
            .from('contacts')
            .insert([{
                name,
                role,
                phone,
                email,
                image_url,
                created_at: new Date()
            }]);

        if (error) {
            console.error(error);
            return;
        }

        modal.style.display = 'none';
        loadContacts();
    };

    /****************************************************************
    ADD ISSUE (MAINTENANCE REQUEST)
    ****************************************************************/
    issueBtn.onclick = async () => {

        if (!activeContact) return;

        const title = prompt("Issue title?");
        if (!title) return;

        const { error } = await supabase
            .from('facility_issues')
            .insert([{
                issue_title: title,
                reported_by: activeContact.id,
                open_issue: true,
                created_at: new Date()
            }]);

        if (error) {
            console.error(error);
            return;
        }

        loadHistory(activeContact.id);
    };

    /****************************************************************
    NAV + UI EVENTS
    ****************************************************************/
    openAdd.onclick = () => modal.style.display = 'flex';
    cancelBtn.onclick = () => modal.style.display = 'none';

    backBtn.onclick = () => {
        detailView.style.display = 'none';
        gridView.style.display = 'block';
    };

    /****************************************************************
    INIT
    ****************************************************************/
    loadContacts();
}
