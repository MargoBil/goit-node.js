const express = require('express');
const cors = require('cors');
require('dotenv').config();
const contactsRouter = require('./contacts.router');
const morgan = require('morgan');
const mongoose = require('mongoose');

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async startServer() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDataBase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(
      cors({
        origin: 'http://localhost:3000',
      }),
    );
    this.server.use(morgan('dev'));
  }

  initRoutes() {
    this.server.use('/api/contacts', contactsRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log('Server started listening on port', process.env.PORT);
    });
  }
  async initDataBase() {
    try {
      const {MONGODB_URL} = process.env;
      await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true});
      console.log('Database connection successful');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
};
