require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Note = require('../lib/Models/Note');

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
          title: 'first note!',
          body: 'this is a note',
        });
      });
  });

  it('GET all notes', async() => {
    const notes = await Note.create([
      { title: 'note1', body: 'body1' },
      { title: 'note2', body: 'body2' },
      { title: 'note3', body: 'body3' }
    ]);
    return request(app)
      .get('/api/v1/notes')
      .then(res => {
        const notesJSON = JSON.parse(JSON.stringify(notes));
        notesJSON.forEach(note => {
          expect(res.body).toContainEqual({ 
            title: note.title, 
            body: note.body,
            _id: note._id.toString()
          });
        });
      });
  });
})
;
