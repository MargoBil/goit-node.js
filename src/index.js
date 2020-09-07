const argv = require('yargs').argv;

const switchAction = require('../services/switchAction');

const Server = require('./server');

function invokeAction({action, id, name, email, phone}) {
  switchAction(action, id, name, email, phone);
}

// invokeAction(argv);

new Server().startServer();

