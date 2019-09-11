/*  eslint-disable no-console */

const client = require('../utils/client');

client.query(`
  CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAT(256) NOT NULL,
    url VARCHAR(256)
  )
  CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES authors(id),
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
 
