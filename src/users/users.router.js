const {Router} = require('express');
const {authorizeValidation, getCurrentUser, updateSubscription, updateAvatar, upload} = require('./users.controller')

const usersRouter = Router();

//current user:
usersRouter.get("/current", authorizeValidation, getCurrentUser);

//update subscription for user:
usersRouter.patch("/", authorizeValidation, updateSubscription);

//update avatar for user:
usersRouter.patch("/avatars", authorizeValidation, upload().single('avatar'), updateAvatar);


module.exports = usersRouter;