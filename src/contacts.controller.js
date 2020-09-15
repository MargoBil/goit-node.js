const Joi = require('joi');
const {
  Types: {ObjectId},
} = require('mongoose');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('./contacts');
const contactModel = require('./contacts.model');

class ContactsController {
  async getContacts(req, res, next) {
    try {
      const data = await listContacts();
      if (!data) {
        return res.status(404).json({message: 'Not Found'});
      }
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async findContactById(req, res, next) {
    try {
      const id = ObjectId(req.params.contactId);
      const data = await getContactById(id);
      if (!data) {
        return res.status(404).json({message: 'Not Found'});
      }
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async postContact(req, res, next) {
    try {
      const data = await addContact(req.body);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteContactById(req, res, next) {
    try {
      const id = ObjectId(req.params.contactId);
      const data = await removeContact(id);
      if (!data) {
        return res.status(404).json({message: 'Not Found'});
      }
      return res.status(200).json({message: 'contact deleted'});
    } catch (error) {
      next(error);
    }
  }

  async updateContactById(req, res, next) {
   try {
    const id = ObjectId(req.params.contactId);
    const data = await updateContact({_id: id}, req.body);
    if (!data) {
      return res.status(404).json({message: 'Not Found'});
    }
    return res.status(200).json(data);
   } catch (error) {
     next(error);
   }
  }

  validateId(req, res, next) {
    const { contactId } = req.params;
  
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).send("This  id does not exist");
    }

    next();
  }

  validatePostNewContact(req, res, next) {
    const postContactsRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string().allow(''),
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
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string().allow(''),
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
