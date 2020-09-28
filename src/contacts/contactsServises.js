const contactModel = require('./contacts.model');

async function listContacts() {
  try {
    const contactsList = await contactModel.find();
    return contactsList;
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contact = await contactModel.findOne(contactId);
    return contact;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const deletedContact = await contactModel.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    console.log(error);
  }
}

async function addContact(bodyChunk) {
  try {
    const newContact = await contactModel.create(bodyChunk);
    return newContact;
  } catch (error) {
    console.log(error);
  }
}

async function updateContact(contactId, bodyChunk) {
  try {
    const udatedContact = await contactModel.findOneAndUpdate(contactId, {$set: bodyChunk}, {new: true});
    return udatedContact;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
