const express = require('express');
const { v4: uuid } = require('uuid');
const { incrCounter, getCounters } = require('../counter');

const { parseBookDataFromReq } = require('../utils');
const { NotFoundError } = require('../errors');
const { uploadBookFileFields } = require('../middleware');

const router = express.Router();
const backToBooksLink = { to: '/books', title: 'К списку', icon: 'arrow-left' };

const Book = require('../book');

router.get('/', async (__, res) => {
  const books = await Book.find({});
  const views = await getCounters(books.map(book => book.id));

  res.render('books/index', { title: 'Главная', books, views, link: false });
});

router.get('/create', (__, res) => {
  res.render('books/create', { title: 'Добавить книгу', book: {}, link: backToBooksLink });
});

router.post('/create', uploadBookFileFields, (req, res) => {
  const newBook = new Book({ id: uuid(), ...parseBookDataFromReq(req) });

  newBook.save();
  res.redirect('/books');
});

router.post('/update/:id', uploadBookFileFields, async (req, res, next) => {
  const { id } = req.params;
  const target = await Book.findOne({ id });

  if (!target) {
    next(NotFoundError(`There is no book with id = ${id}!`));
  }

  await Book.updateOne({ id }, parseBookDataFromReq(req));

  res.redirect('/books');
});

router.get('/update/:id', async (req, res, next) => {
  const { id } = req.params;
  const target = await Book.findOne({ id });

  if (target) {
    res.render('books/create', { title: 'Редактировать книгу', book: target, link: backToBooksLink });

    return;
  }

  next(new NotFoundError(`There is no book with id = ${id}!`));
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const target = await Book.findOne({ id });

  if (target) {
    const views = await incrCounter(target.id);

    res.render('books/view', { title: 'Информация о книге', book: target, views, link: backToBooksLink });

    return;
  }

  next(new NotFoundError(`There is no book with id = ${id}!`));
});

router.use((err, __, res, ___) => {
  if (err instanceof NotFoundError) {
    return res.render('not-found', { link: false });
  }
  
  res.status(500).send({ status: 'error', message: err.message });
});

module.exports = router;
