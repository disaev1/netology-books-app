import express, { Request, Response, NextFunction, Router } from 'express';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { NotFoundError } from '../../errors';
import { parseBookDataFromReq, notFoundMessage } from '../../utils';
import { uploadBookFileFields } from '../../middleware';
import BooksRepository from '../../BooksRepository';
import iocContainer from '../../ioc-container';
import { Book } from '../../book';

const router: Router = express.Router();

const repo: BooksRepository = iocContainer.get(BooksRepository);

function send404(err: Error, res: Response) {
  res.status(404);
  res.send({ status: 'error', message: err.message });
}

router.get('/', async (__: Request, res: Response): Promise<void> => {
  const books: Book[] = await repo.getBooks();

  res.send(books);
});

router.post('/', uploadBookFileFields, async (req: Request, res: Response): Promise<void> => {
  const newBook: Book = await repo.createBook({ id: uuid(), ...parseBookDataFromReq(req) });

  res.send(newBook);
});

router.put(
  '/:id',
  uploadBookFileFields,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const updatedBook: Book | boolean = await repo.updateBook({ id, ...parseBookDataFromReq(req) });

    if (!updatedBook) {
      next(new NotFoundError(notFoundMessage(id)));
    }

    res.send(updatedBook);
  }
);

router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const result: Book | boolean = await repo.deleteBook(id);

  if (!result) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.send({ status: 'ok' });
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const targetBook: Book | boolean = await repo.getBook(id);

  if (!targetBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  res.send(targetBook);
});

router.get('/:id/download', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const targetBook: Book | boolean = await repo.getBook(id);

  if (!targetBook) {
    next(new NotFoundError(notFoundMessage(id)));
  }

  if (!(targetBook as Book).fileBook) {
    next(new Error(`The book with id = ${id} have no fileBook!`));
  }
  
  res.download(
    path.resolve(__dirname, `../../public/img/${(targetBook as Book).fileBook}`),
    (targetBook as Book).fileBook,
      (err: Error) => {
      if (err) {
        send404(new NotFoundError(`File ${(targetBook as Book).fileBook} not found!`), res);
      }
    }
  );
});

router.use((err: Error, __: Request, res: Response, ___: NextFunction): void => {
  if (err instanceof NotFoundError) {
    return send404(err, res);
  }
  
  res.status(500).send({ status: 'error', message: err.message });
});

module.exports = router;
