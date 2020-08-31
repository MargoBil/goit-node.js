const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(
  path.dirname("./db/contacts.json"),
  path.basename("./db/contacts.json")
);

function listContacts() {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) {
      return console.log(err);
    }
   console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    let filteredContacts;
    const arrayWithFilteredContact = JSON.parse(data).filter(
      (contact) => contact.id === contactId
    );
    return console.log((filteredContacts = arrayWithFilteredContact[0]));
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) {
      console.log(err);
    }
    const filteredData = JSON.parse(data).filter(
      (contact) => contact.id !== contactId
    );
    const filteredContactsJson = JSON.stringify(filteredData);

    fs.writeFile(contactsPath, filteredContactsJson, (err, data) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) {
      console.log(err);
    }
    const parseData = JSON.parse(data);
    const updatedContacts = [...parseData, ...[{id: uuidv4(), name, email, phone}]];
    const updatedContactJson = JSON.stringify(updatedContacts);
    fs.writeFile(contactsPath, updatedContactJson, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

module.exports = {listContacts, getContactById, removeContact, addContact};