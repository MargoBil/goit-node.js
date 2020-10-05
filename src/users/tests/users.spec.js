const sinon = require('sinon');
require('should');
const UserServer = require('../../server');
const request = require('supertest');
const userModel = require('../users.model');
const {requests} = require('sinon');

describe('Unite test for users router middelware', () => {
  let server;
  before(async () => {
    const userServer = new UserServer();
    server = await userServer.startServer();
  });

  after(() => {
    server.close();
  });

  describe('PATCH/users/avatars', () => {
    it('shoud return 401 error when user get invalid token', async () => {
      await request(server)
        .patch('/users/avatars')
        .set('Content-Type', 'multipart/form-data')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjc4ODVmODQzMDY4ZDM5NTA3Y2JlM2QiLCJpYXQiOjE2MDE3MzQxNDV9.RlnTAbA0TKW2zjrpo7m4OdY1BnltcWHM1U9dvnuQ17k',
        )
        .expect(401);
    });
    it('shoud return 500 error when user do not get any token', async () => {
      await request(server)
        .patch('/users/avatars')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', '')
        .expect(500);
    });
  });
});
