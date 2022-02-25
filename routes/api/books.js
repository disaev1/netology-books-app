const express = require('express');
const path = require('path');
const { v4: uuid } = require('uuid');
const _ = require('lodash');
const { NotFoundError } = require('../../errors');
const { parseBookDataFromReq } = require('../../utils');
const { uploadBookFileFields } = require('../../middleware');

const router = express.Router();

const Book = require('../../book');

function send404(err, res) {
  res.status(404);
  res.send({ status: 'error', message: err.message });
}

router.get('/', async (__, res) => {
  const books = await Book.find({});

  res.send(books);
});

router.post('/', uploadBookFileFields, (req, res) => {
  const newBook = new Book({ id: uuid(), ...parseBookDataFromReq(req) });

  newBook.save();

  res.send(newBook);
});

router.put('/:id', uploadBookFileFields, async (req, res, next) => {
  const { id } = req.params;
  const target = await Book.findOne({ id });

  if (!target) {
    next(new NotFoundError(`There is no book with id = ${id}!`));
  }

  await Book.updateOne({ id }, parseBookDataFromReq(req));

  const updatedBook = await Book.findOne({ id });

  res.send(updatedBook);
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const target = await Book.findOne({ id });

  if (!target) {
    next(new NotFoundError(`There is no book with id = ${id}!`));
  }

  await Book.deleteOne({ id });
  res.send({ status: 'ok' });
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const target = await Book.findOne({ id });

  if (target) {
    res.send(target);

    return;
  }

  next(new NotFoundError(`There is no book with id = ${id}!`));
});

router.get('/:id/download', async (req, res, next) => {
  const { id } = req.params;

  const target = await Book.findOne({ id });

  if (!target) {
    next(new NotFoundError(`There is no book with id = ${id}!`));
  }

  if (!target.fileBook) {
    next(new Error(`The book with id = ${id} have no fileBook!`));
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
