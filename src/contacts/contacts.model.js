const mongoose = require('mongoose');
const {Schema} = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const contactShema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  subscription: {type: String, required: true, alias: 'Sub'},
  password: {type: String, required: true},
  token: {type: String, required: false},
});
contactShema.plugin(mongoosePaginate);
const contactModel = mongoose.model('Contact', contactShema);

module.exports = contactModel;
