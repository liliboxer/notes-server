const { Router } = require('express');
const client = require('../utils/client');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { title, body, author } = req.body;
  
    client.query(`
    INSERT INTO notes (author, title, body)
    VALUES ($1, $2, $3)
    RETURNING 
      id, author, title, body, 
      created;
  `,
    [author, title, body]
    )
      .then(result => {
        res.send(result.rows[0]);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    client.query(`
    SELECT id, author, title, body, created
    FROM notes
    WHERE id = $1;
    `, [req.params.id]
    )
      .then(result => {
        const note = result.rows[0];
        if(!note) {
          throw {
            status: 404,
            message: `Id ${req.params.id} does not exist`
          };
        }
        res.send(note);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    client.query(`
      SELECT id, author, title, body, created
      FROM notes
    `)
      .then(result => {
        res.send(result.rows);
      })
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const { title, body } = req.body;

    client.query(`
      UPDATE notes
        SET title = $1, body = $2
      WHERE id = $3
      RETURNING id, author, title, body
    `, [title, body, req.params.id]
    )
      .then(result => {
        res.send(result.rows[0]);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    client.query(`
      DELETE FROM notes
      WHERE id = $1
      RETURNING id, author, title, body, created
    `, [req.params.id]
    )
      .then(result => {
        res.send(result.rows[0]);
      })
      .catch(next);
  });

