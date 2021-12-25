const express = require('express');
const path = require('path');
const { v4: uuid } = require('uuid');
const _ = require('lodash');
const { NotFoundError } = require('../../errors');
const { parseBookDataFromReq } = require('../../utils');
const { uploadBookFileFields } = require('../../middleware');

const router = express.Router();

let books = require('../../books');

function send404(err, res) {
  res.status(404);
  res.send({ status: 'error', message: err.message });
}

router.get('/', (__, res) => {
  res.send(books);
});

router.post('/', uploadBookFileFields, (req, res) => {
  const newBook = { id: uuid(), ...parseBookDataFromReq(req) };

  books.push(newBook);
  res.send(newBook);
});

router.put('/:id', uploadBookFileFields, (req, res) => {
  const { id } = req.params;
  const target = books.find(book => book.id === id);

  if (!target) {
    throw new NotFoundError(`There is no book with id = ${id}!`);
  }

  const updatedBook = { ...target, ...parseBookDataFromReq(req) };

  books = books.map(book => {
    if (updatedBook.id === book.id) {
      return updatedBook;
    }

    return book;
  });

  res.send(updatedBook);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const target = books.find(book => book.id === id);

  if (!target) {
    throw new NotFoundError(`There is no book with id = ${id}!`);
  }

  books = books.filter(book => book.id !== id);
  res.send({ status: 'ok' });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const target = books.find(book => book.id === id);

  if (target) {
    res.send(target);

    return;
  }

  throw new NotFoundError(`There is no book with id = ${id}!`);
});

router.get('/:id/download', (req, res) => {
  const { id } = req.params;

  const target = books.find(book => book.id === id);

  if (!target) {
    throw new NotFoundError(`There is no book with id = ${id}!`);
  }

  if (!target.fileBook) {
    throw new Error(`The book with id = ${id} have no fileBook!`);
  }
  
  res.download(path.resolve(__dirname, `../../public/img/${target.fileBook}`), target.fileBook, err => {
    if (err) {
      send404(new NotFoundError(`File ${target.fileBook} not found!`), res);
    }
  });
});

router.use((err, __, res, ___) => {
  if (err instanceof NotFoundError) {
    return send404(err, res);
  }
  
  res.status(500).send({ status: 'error', message: err.message });
});

module.exports = router;
