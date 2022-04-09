const express = require('express');
const { v4: uuid } = require('uuid');
const { Container } = require('inversify');
require('reflect-metadata');

const { incrCounter, getCounters } = require('../counter');
const { parseBookDataFromReq, notFoundMessage } = require('../utils');
const { NotFoundError } = require('../errors');
const { uploadBookFileFields } = require('../middleware');

const router = express.Router();
const backToBooksLink = { to: '/books', title: 'К списку', icon: 'arrow-left' };

const BooksRepository = require('../BooksRepository');

const container = new Container();

container.bind(BooksRepository).toSelf();

const repo = container.get(BooksRepository);

router.get('/', async (__, res) => {
  const books = await repo.getBooks();
  const views = await getCounters(books.map(book => book.id));

  res.render('books/index', { title: 'Главная', books, views, link: false });
});

router.get('/create', (__, res) => {
  res.render('books/create', { title: 'Добавить книгу', book: {}, link: backToBooksLink });
});

router.post('/create', uploadBookFileFields, async (req, res) => {
  await repo.createBook({ id: uuid(), ...parseBookDataFromReq(req) });

  res.redirect('/books');
});

router.post('/update/:id', uploadBookFileFields, async (req, res, next) => {
  const { id } = req.params;
  const updatedBook = await repo.updateBook({ id, ...parseBookDataFromReq(req) });

  if (!updatedBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.redirect('/books');
});

router.get('/update/:id', async (req, res, next) => {
  const { id } = req.params;
  const targetBook = await repo.getBook(id);

  if (!targetBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.render('books/create', { title: 'Редактировать книгу', book: targetBook, link: backToBooksLink });
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const targetBook = await repo.getBook(id);

  if (!targetBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  const views = await incrCounter(targetBook.id);

  res.render('books/view', { title: 'Информация о книге', book: targetBook, views, link: backToBooksLink });
});

router.use((err, __, res, ___) => {
  if (err instanceof NotFoundError) {
    return res.render('not-found', { link: false });
  }
  
  res.status(500).send({ status: 'error', message: err.message });
});

module.exports = router;
