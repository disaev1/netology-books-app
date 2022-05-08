const express = require('express');
const path = require('path');
const { v4: uuid } = require('uuid');
const _ = require('lodash');
const { Container } = require('inversify');
require('reflect-metadata');

const { NotFoundError } = require('../../errors');
const { parseBookDataFromReq, notFoundMessage } = require('../../utils');
const { uploadBookFileFields } = require('../../middleware');

const router = express.Router();

const BooksRepository = require('../../BooksRepository');

const container = new Container();

container.bind(BooksRepository).toSelf();

const repo = container.get(BooksRepository);

function send404(err, res) {
  res.status(404);
  res.send({ status: 'error', message: err.message });
}

router.get('/', async (__, res) => {
  const books = await repo.getBooks();

  res.send(books);
});

router.post('/', uploadBookFileFields, async (req, res) => {
  const newBook = await repo.createBook({ id: uuid(), ...parseBookDataFromReq(req) });

  res.send(newBook);
});

router.put('/:id', uploadBookFileFields, async (req, res, next) => {
  const { id } = req.params;
  const updatedBook = await repo.updateBook({ id, ...parseBookDataFromReq(req) });

  if (!updatedBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.send(updatedBook);
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await repo.deleteBook(id);

  if (!result) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.send({ status: 'ok' });
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const targetBook = await repo.getBook(id);

  if (!targetBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.send(targetBook);
});

router.get('/:id/download', async (req, res, next) => {
  const { id } = req.params;
  const targetBook = await repo.getBook(id);

  if (!targetBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  if (!targetBook.fileBook) {
    next(new Error(`The book with id = ${id} have no fileBook!`));
  }
  
  res.download(path.resolve(__dirname, `../../public/img/${targetBook.fileBook}`), targetBook.fileBook, err => {
    if (err) {
      send404(new NotFoundError(`File ${targetBook.fileBook} not found!`), res);
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
