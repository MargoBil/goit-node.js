const fs = require('fs');
const path = require('path');
const contactModel = require('./contacts.model.js');


const contactsPath = path.join(
  path.dirname('./db/contacts.json'),
  path.basename('./db/contacts.json'),
);

function listContacts() {
  const result = fs.readFileSync(contactsPath, 'utf-8', err => {
    if (err) {
      return console.log(err);
    }
  });
  return JSON.parse(result);
}

function getContactById(contactId) {
  const findedContact = fs.readFileSync(contactsPath, 'utf-8', err => {
    if (err) {
      return console.log(err);
    }
  });
  const data = JSON.parse(findedContact);
  const requiredContact = data.filter(
    contact => contact.id === Number(contactId),
  );
  return requiredContact[0];
}

function removeContact(contactId) {
  const contacts = fs.readFileSync(contactsPath, err => {
    if (err) {
      console.log(err);
    }
  });
  const data = JSON.parse(contacts);
  const idForDelete = data.find(contact => contact.id === Number(contactId));
  const filteredData = data.filter(contact => contact.id !== Number(contactId));
  const filteredContactsJson = JSON.stringify(filteredData);
  fs.writeFileSync(contactsPath, filteredContactsJson, err => {
    if (err) {
      console.log(err);
    }
  });
  return idForDelete;
}

async function addContact(bodyChunk) {
  try {
    const newContact = await contactModel.create(bodyChunk);
    return newContact;
  } catch (error) {
    console.log(error);
  }

  // const contacts = fs.readFileSync(contactsPath, err => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // const parseData = JSON.parse(contacts);
  // const newId = Math.max(...parseData.map(contact => contact.id)) + 1;
  // const newContact = [{id: newId, name, email, phone}];
  // const updatedContacts = [...parseData, ...newContact];
  // const updatedContactJson = JSON.stringify(updatedContacts);
  // fs.writeFileSync(contactsPath, updatedContactJson, err => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // return newContact[0];
}

function updateContact(contactId, bodyChunk) {
  const contacts = fs.readFileSync(contactsPath, err => {
    if (err) {
      console.log(err);
    }
  });
  const data = JSON.parse(contacts);
  const findIdxById = data.findIndex(
    contact => contact.id === Number(contactId),
  );
  if (findIdxById !== -1) {
    data[findIdxById] = {
      ...data[findIdxById],
      ...bodyChunk,
    };
    const dataJson = JSON.stringify(data);
    fs.writeFileSync(contactsPath, dataJson, err => {
      if (err) {
        console.log(err);
      }
    });
    return data[findIdxById];
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
