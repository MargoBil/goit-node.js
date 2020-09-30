const {Router} = require('express');
const {signUp, signIn, logout, validateReqBodyForAuth, authorizeValidation} = require('./users.controller');
const multer = require('multer');
const upload = multer({dest: 'tmp'});

const authRouter = Router();

//register:
authRouter.post("/register", validateReqBodyForAuth, signUp, upload.single('tmp'));

//login:
authRouter.post("/login", validateReqBodyForAuth, signIn);

//logout:
authRouter.post("/logout", authorizeValidation, logout);

module.exports = authRouter;
