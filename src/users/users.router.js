const {Router} = require('express');
const {authorizeValidation, getCurrentUser, updateSubscription} = require('./users.controller')

const usersRouter = Router();

//current user:
usersRouter.get("/current", authorizeValidation, getCurrentUser);


//update subscription for user:
usersRouter.patch("/", authorizeValidation, updateSubscription);

module.exports = usersRouter;