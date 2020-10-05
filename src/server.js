const express = require('express');
const cors = require('cors');
require('dotenv').config();
const contactsRouter = require('./contacts/contacts.router');
const authRouter = require('./users/auth.router');
const usersRouter = require('./users/users.router');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const multer = require('multer');
// const upload = multer({dest: 'public/'});

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async startServer() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDataBase();
   return this.startListening();
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
    this.server.use(express.static('./src/public'));
  }

  initRoutes() {
    this.server.use('/api/contacts', contactsRouter);
    this.server.use('/auth', authRouter);
    this.server.use('/users', usersRouter);
  }

  initDistributionStatic() {
    this.server.post('/form-data', upload.single('avatar'), function (req, res, next) {
      console.log(req.file);
      console.log(req.body);
      // req.file is the `avatar` file
      // req.body will hold the text fields, if there were any
    });
  }

  startListening() {
    return this.server.listen(process.env.PORT, () => {
      console.log('Server started listening on port', process.env.PORT);
    });
  }
  async initDataBase() {
    try {
      const {MONGODB_URL} = process.env;
      await mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
      });
      console.log('Database connection successful');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
};
