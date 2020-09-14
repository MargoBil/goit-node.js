const Joi = require('joi');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('./contacts');

class ContactsController {
  getContacts(req, res, next) {
    const data = listContacts();
    if (!data) {
      return res.status(404).json({message: 'Not Found'});
    }
    return res.status(200).json(data);
  }

  findContactById(req, res, next) {
    const data = getContactById(req.params.contactId);
    if (!data) {
      return res.status(404).json({message: 'Not Found'});
    }
    return res.status(200).json(data);
  }

 async postContact(req, res, next) {
   try {
    const data = await addContact(req.body);
    return res.status(201).json(data);
   } catch (error) {
     console.log(error);
   }
  }

  deleteContactById(req, res, next) {
    const data = removeContact(req.params.contactId);
    if (!data) {
      return res.status(404).json({message: 'Not Found'});
    }
    return res.status(200).json({message: 'contact deleted'});
  }

  updateContactById(req, res, next) {
    const data = updateContact(req.params.contactId, req.body);
    if (!data) {
      return res.status(404).json({message: 'Not Found'});
    }
    return res.status(200).json(data);
  }

  validatePostNewContact(req, res, next) {
    const postContactsRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string().allow('')
    });
    const validResult = postContactsRules.validate(req.body);
    if (validResult.error) {
      return res.status(400).json({message: 'missing required name field'});
    }
    next();
  }

  validatePatchNewContact(req, res, next) {
    const patchContactsRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const validResult = patchContactsRules.validate(req.body);
    const isResultEmpty = Object.keys(validResult.value).length === 0;
    if (isResultEmpty) {
      return res.status(400).json({message: 'missing fields'});
    }
    next();
  }
}

module.exports = new ContactsController();
