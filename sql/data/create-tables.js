/*  eslint-disable no-console */

const client = require('../utils/client');

client.query(`
  CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    author VARCHAR(256) NOT NULL,
    title VARCHAR(256) NOT NULL,
    body TEXT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)
  .then(
    () => console.log('create tables complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });
