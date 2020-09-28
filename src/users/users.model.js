const mongoose = require('mongoose');
const {Schema} = mongoose;

const userShema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: {type: String, required: false},
});
const userModel = mongoose.model('User', userShema);

module.exports = userModel;
