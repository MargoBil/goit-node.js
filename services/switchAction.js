const contacts = require('../src/contacts');
const {listContacts, getContactById, addContact, removeContact} = contacts;

const switchAction = (action, id, name, email, phone) => {
  switch (action) {
    case 'list':
      listContacts();
      break;

    case 'get':
      getContactById(id);
      break;

    case 'add':
      addContact(name, email, phone);
      break;

    case 'remove':
      removeContact(id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
};

module.exports = switchAction;
