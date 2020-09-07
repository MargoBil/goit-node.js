const express = require('express');
const cors = require('cors');
require('dotenv').config();
const contactsRouter = require('./contacts.router');
const morgan = require('morgan');

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  startServer() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({origin: "http://localhost:3000"}));
    this.server.use(morgan('dev'));
  }

  initRoutes() {
      this.server.use("/api/contacts", contactsRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log('Server started listening on port', process.env.PORT);
    });
  }
};
