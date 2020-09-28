const {Router} = require('express');
const {signUp, signIn, logout, validateReqBodyForAuth, authorizeValidation} = require('./users.controller')

const authRouter = Router();

//register:
authRouter.post("/register", validateReqBodyForAuth, signUp);

//login:
authRouter.post("/login", validateReqBodyForAuth, signIn);

//logout:
authRouter.post("/logout", authorizeValidation, logout);

module.exports = authRouter;
