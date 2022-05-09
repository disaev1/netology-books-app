import express, { Router, Request, Response, NextFunction, Errback }  from 'express';
import { v4 as uuid } from 'uuid';

import { incrCounter, getCounters, Counts } from '../counter';
import { parseBookDataFromReq, notFoundMessage } from '../utils';
import { NotFoundError } from '../errors';
import { uploadBookFileFields } from '../middleware';
import BooksRepository from '../BooksRepository';
import iocContainer from '../ioc-container';
import { Book } from '../book';

const router: Router = express.Router();
const backToBooksLink = { to: '/books', title: 'К списку', icon: 'arrow-left' };

const repo: BooksRepository = iocContainer.get<BooksRepository>(BooksRepository);

router.get('/', async (__: Request, res: Response) => {
  const books: Book[] = await repo.getBooks();
  const views: Counts = await getCounters(books.map(book => book.id));

  res.render('books/index', { title: 'Главная', books, views, link: false });
});

router.get('/create', (__: Request, res: Response) => {
  res.render('books/create', { title: 'Добавить книгу', book: {}, link: backToBooksLink });
});

router.post('/create', uploadBookFileFields, async (req, res: Response) => {
  await repo.createBook({ id: uuid(), ...parseBookDataFromReq(req) });

  res.redirect('/books');
});

router.post('/update/:id', uploadBookFileFields, async (req, res, next) => {
  const { id } = req.params;
  const updatedBook: Book = await repo.updateBook({ id, ...parseBookDataFromReq(req) }) as Book;

  if (!updatedBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.redirect('/books');
});

router.get('/update/:id', async (req, res, next) => {
  const { id } = req.params;
  const targetBook: Book = await repo.getBook(id) as Book;

  if (!targetBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.render('books/create', { title: 'Редактировать книгу', book: targetBook, link: backToBooksLink });
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const targetBook: Book = await repo.getBook(id) as Book;

  if (!targetBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  const views: number = await incrCounter(targetBook.id);

  res.render('books/view', { title: 'Информация о книге', book: targetBook, views, link: backToBooksLink });
});

router.use((err: Error, __: Request, res: Response, ___: NextFunction) => {
  if (err instanceof NotFoundError) {
    return res.render('not-found', { link: false });
  }
  
  res.status(500).send({ status: 'error', message: err.message });
});

export default router;
