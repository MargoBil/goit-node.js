const {Router} = require('express');
const {getContacts, findContactById, postContact, validatePostNewContact, validatePatchNewContact, deleteContactById, updateContactById} = require('./contacts.controller');

const contactsRouter = Router();

//get all contacts:
contactsRouter.get("/", getContacts);

//post contact:
contactsRouter.post("/", validatePostNewContact, postContact);

//get contact by id:
contactsRouter.get("/:contactId", findContactById);

//update contact by id:
contactsRouter.patch("/:contactId", validatePatchNewContact, updateContactById);

//delete contact by id:
contactsRouter.delete("/:contactId", deleteContactById);


module.exports = contactsRouter;