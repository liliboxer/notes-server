require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const client = require('../utils/client');

describe('notes routes', () => {
  beforeEach(() => {
    return client.query(`
      DELETE from notes;
      DELETE from authors;
    `);
  });

  let author = null;

  beforeEach(() => {
    return client.query(`
      INSERT INTO authors(name, url)
      VALUES ('blogger', 'http://blogger.com')
      RETURNING #;
    `)
      .then(result => author = result.rows[0])
      .then(author => TEST_NOTE.authorId = author.id);
  });

  afterAll(() => {
    return client.end();
  });

  const TEST_NOTE = {
    title: 'meow note',
    authorId: -1, // will be populated by beforeEach
    body: 'I am a kitty, meow!'
  };

  const createNote = (note = TEST_NOTE) => request(app)
    .post('/api/v1/notes')
    .expect(200)
    .send(note);

  const testNote = note => {
    expect(note).toEqual({
      id: expect.any(Number),
      title: 'meow note',
      authorId: -1,
      body: 'I am a kitty, meow!',
      created: expect.any(String)
    });
  };

  it('creates note', () => {
    return createNote()
      .then(({ body }) => {
        testNote(body);
      });
  });

  it('gets a note by id', () => {
    return createNote()
      .then(({ body }) => {
        return request(app)
          .get(`/api/v1/notes/${body.id}`)
          .expect(200);
      })
      .then(({ body }) => {
        testNote(body);
      });
  });

  it('returns 404 on non-existant id', () => {
    return request(app)
      .get('/api/v1/notes/100')
      .expect(404);
  });

  it('gets a list of notes', () => {
    return Promise.all([
      createNote({ title: 'title 1', author: 'max', body: 'body 1' }),
      createNote({ title: 'title 2', author: 'max', body: 'body 2' }),
      createNote({ title: 'title 3', author: 'max', body: 'body 3' })
    ])
      .then(() => {
        return request(app)
          .get('/api/v1/notes')
          .expect(200)
          .then(({ body }) => {
            expect(body.length).toBe(3);
          });
      });
  });

  it('updates a note', () => {
    return createNote()
      .then(({ body }) => {
        body.title = 'new title bitches';
        return request(app)
          .put(`/api/v1/notes/${body.id}`)
          .send(body)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.title).toBe('new title bitches');
      });
  });

  it('deletes note', () => {
    return createNote()
      .then(({ body }) => {
        return request(app)
          .delete(`/api/v1/notes/${body.id}`)
          .expect(200)
          .then(({ body: removed }) => {
            expect(removed).toEqual(body);
            return body.id;
          });
      })
      .then(id => {
        return request(app)
          .get(`/api/v1/notes/${id}`)
          .expect(404);
      });
  });


});
