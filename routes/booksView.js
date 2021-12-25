const express = require('express');
const { v4: uuid } = require('uuid');

const { parseBookDataFromReq } = require('../utils');
const { NotFoundError } = require('../errors');
const { uploadBookFileFields } = require('../middleware');

const router = express.Router();
const backToBooksLink = { to: '/books', title: 'К списку', icon: 'arrow-left' };

let books = require('../books');

router.get('/', (__, res) => {
  res.render('books/index', { title: 'Главная', books, link: false });
});

router.get('/create', (__, res) => {
  res.render('books/create', { title: 'Добавить книгу', book: {}, link: backToBooksLink });
});

router.post('/create', uploadBookFileFields, (req, res) => {
  const newBook = { id: uuid(), ...parseBookDataFromReq(req) };
  
  books.push(newBook);
  res.redirect('/books');
});

router.post('/update/:id', uploadBookFileFields, (req, res) => {
  const { id } = req.params;
  const target = books.find(book => book.id === id);
  console.log('update book', target);

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

  res.redirect('/books');
});

router.get('/update/:id', (req, res) => {
  const { id } = req.params;
  const target = books.find(book => book.id === id);
  console.log('edit book', target);

  if (target) {
    res.render('books/create', { title: 'Редактировать книгу', book: target, link: backToBooksLink });

    return;
  }

  throw new NotFoundError(`There is no book with id = ${id}!`);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const target = books.find(book => book.id === id);

  if (target) {
    res.render('books/view', { title: 'Информация о книге', book: target, link: backToBooksLink });

    return;
  }

  throw new NotFoundError(`There is no book with id = ${id}!`);
});

router.use((err, __, res, ___) => {
  if (err instanceof NotFoundError) {
    return res.render('not-found', { link: false });
  }
  
  res.status(500).send({ status: 'error', message: err.message });
});

module.exports = router;
