const argv = require('yargs').argv;
const switchAction = require('../services/switchAction');

function invokeAction({action, id, name, email, phone}) {
  switchAction(action, id, name, email, phone);
}

invokeAction(argv);
