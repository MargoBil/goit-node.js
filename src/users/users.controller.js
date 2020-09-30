const {
  createNewUser,
  handleSignInReq,
  findeUserByEmail,
  createNewToken,
  updateToken,
  getCurrentUser,
  createAvatarUrl,
} = require('./usersServises');
const Joi = require('joi');
const Jwt = require('jsonwebtoken');
const userModel = require('./users.model');
var multer = require('multer');
const path = require('path');
const fs = require('fs');

class UsersController {
  constructor() {
    this._costFactor = 4;
  }

  get signUp() {
    return this._signUp.bind(this);
  }

  async _signUp(req, res, next) {
    try {
      const newUser = await createNewUser(req.body, this._costFactor);

      if (!newUser) {
        return res.status(409).json({
          message: 'Email in use',
        });
      }
      const {email, _id, avatarURL} = newUser;
      return res.status(201).json({
        _id,
        email,
        avatarURL,
      });
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const userFindedByEmail = await findeUserByEmail(req.body);
      if (!userFindedByEmail) {
        res.status(401).json({message: 'Not authorized'});
      }
      const isReqValid = await handleSignInReq(req.body, userFindedByEmail);
      if (!isReqValid) {
        res.status(401).json({message: 'Not authorized'});
      }
      const token = await createNewToken(userFindedByEmail);
      const updateTokenResult = await updateToken(userFindedByEmail, token);
      res.status(200).json(updateTokenResult);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await updateToken(user._id, null);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const currentUser = req.user;
      const {email, subscription} = currentUser;
      return res.json({email, subscription});
    } catch (error) {
      next(error);
    }
  }
  async updateSubscription(req, res, next) {
    try {
      await userModel.updateOne(
        {subscription: req.user.subscription},
        req.body,
        err => {
          if (err) {
            return console.log(err);
          }
        },
      );
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      const fileName = req.file.filename;
      const originalAvatar = req.user.avatarURL;
      const avatarURL = createAvatarUrl(fileName);
      const data = await userModel.updateOne(
        {avatarURL: req.user.avatarURL},
        {avatarURL},
        err => {
          if (err) {
            return console.log(err);
          }
        },
      );
      const {name, ext} = path.parse(originalAvatar);
      const previousFileName = name + ext;
      await fs.unlinkSync(`./src/public/images/${previousFileName}`);
      if (!data) {
        return res.status(401).json({message: 'Not authorized'});
      }
      return res.status(200).json({avatarURL});
    } catch (error) {
      next(error);
    }
  }

  upload() {
    const storage = multer.diskStorage({
      destination: './src/public/images',
      filename: function (req, file, cb) {
        const fileName = `${Date.now()}`;
        const ext = path.parse(file.originalname).ext;
        cb(null, fileName + ext);
      },
    });
    return multer({storage});
  }

  validateReqBodyForAuth(req, res, next) {
    const validateRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validResult = validateRules.validate(req.body);
    if (validResult.error) {
      return res
        .status(400)
        .json('Error from Joi or another validation library');
    }
    next();
  }

  async authorizeValidation(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization');
      const token = authorizationHeader.replace('Bearer ', '');
      let userId = await Jwt.verify(token, process.env.TOKEN_SECRET)._id;
      if (!userId) {
        return res.status(401).json({message: 'Not authorized'});
      }
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({message: 'Not authorized'});
      }
      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
