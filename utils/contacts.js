const fs = require('fs');


// Check Directory
const dirPath = './data';
if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
} 

// Check Data File
const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath,'[]','utf-8');
}

// Load Data
const loadData = () => {
    const data = fs.readFileSync(dataPath,'utf-8');
    const contacts = JSON.parse(data);
    return contacts;
}

// find contact
const findContact = (nama) => {
    const contacts = loadData();
    const contact = contacts.find( (contact) => 
        contact.nama.toLowerCase() === nama.toLowerCase()
    );
    return contact;
}

// Add contact
const addContact = (contact) => {
    const contacts = loadData();
    contacts.push(contact);
    saveContact(contacts);
}

//Save Contacts
const saveContact = (contacts) => {
    fs.writeFileSync('data/contacts.json',JSON.stringify(contacts))
}

//check duplicate
const duplicateCheck = (value) => {
    const contacts = loadData();
    const duplicate = contacts.find((c) => c.nama === value);
    return duplicate;
}

//delete contact
const deleteContact = (nama) => {
    const contacts = loadData();
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
    saveContact(filteredContacts);
}

//update edit contact

const updateContact = (newContact) => {
    const contacts = loadData();
    const filteredContacts = contacts.filter((contact) => contact.nama !== newContact.oldName);
    delete newContact.oldName;
    filteredContacts.push(newContact);
    saveContact(filteredContacts);
}

module.exports= {loadData,findContact,addContact,duplicateCheck,deleteContact,updateContact};