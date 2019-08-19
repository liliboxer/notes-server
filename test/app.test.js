require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('notes routes', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can post note', () => {
    return request(app)
      .post('/api/v1/notes')
      .send({ title: 'first note!', body: 'this is a note' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
        });
      });
  });
})
;
