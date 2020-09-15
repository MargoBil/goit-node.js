const {Router} = require('express');
const {getContacts, findContactById, postContact, deleteContactById, updateContactById, validateId, validatePostNewContact, validatePatchNewContact, } = require('./contacts.controller');

const contactsRouter = Router();

//get all contacts:
contactsRouter.get("/", getContacts);

//post contact:
contactsRouter.post("/", validatePostNewContact, postContact);

//get contact by id:
contactsRouter.get("/:contactId", validateId, findContactById);

//update contact by id:
contactsRouter.patch("/:contactId", validateId, validatePatchNewContact, updateContactById);

//delete contact by id:
contactsRouter.delete("/:contactId", validateId, deleteContactById);


module.exports = contactsRouter;