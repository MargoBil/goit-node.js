const userModel = require('./users.model');
const bcryptjs = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const AvatarGenerator = require('avatar-generator');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function createNewUser(bodyChunk, costFactor) {
  try {
    const {password, email} = bodyChunk;
    const passwordHash = await bcryptjs.hash(password, costFactor);
    const avatarFileName = await getUsersAvatar();
    const avatarURL = createAvatarUrl(avatarFileName);
    const newUser = await userModel.create({
      email,
      password: passwordHash,
      avatarURL: avatarURL,
    });
    return newUser;
  } catch (error) {
    console.log(error);
  }
}
async function getUsersAvatar() {
  try {
    const avatar = new AvatarGenerator({
      parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
      partsLocation: path.join(
        __dirname,
        '../../node_modules/avatar-generator/img',
      ),
      imageExtension: '.png',
    });
    const variant = 'female';
    const fileName = `${Date.now()}.png`;
    const image = await avatar.generate(fileName, variant);
    await image.png().toFile(`./tmp/${fileName}`);
    await fs.copyFileSync(
      `./tmp/${fileName}`,
      `./src/public/images/${fileName}`,
    );
    await fs.unlinkSync(`./tmp/${fileName}`);
    return fileName;
  } catch (error) {
    console.log(error);
  }
}

function createAvatarUrl(fileName) {
  const avatarURL = `http://localhost:${process.env.PORT}/images/${fileName}`;
  return avatarURL;
}

async function findeUserByEmail(bodyChunk) {
  const {email} = bodyChunk;
  try {
    const findedUserByEmail = await userModel.findOne({email});
    return findedUserByEmail;
  } catch (error) {
    console.log(error);
  }
}

async function handleSignInReq(bodyChunk, user) {
  const {password: userPassword} = bodyChunk;
  const {password} = user;
  try {
    const isPasswordValid = await bcryptjs.compare(userPassword, password);
    return isPasswordValid;
  } catch (error) {
    console.log(error);
  }
}

async function createNewToken(user) {
  const {id} = user;
  try {
    const token = Jwt.sign({_id: id}, process.env.TOKEN_SECRET);
    return token;
  } catch (error) {
    console.log(error);
  }
}

async function updateToken(user, token) {
  const {_id, email, subscription} = user;
  try {
    await userModel.findByIdAndUpdate({_id}, {token});
    return {
      token,
      user: {email, subscription},
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createNewUser,
  handleSignInReq,
  findeUserByEmail,
  createNewToken,
  updateToken,
  createAvatarUrl
};
