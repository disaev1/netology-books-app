import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/login', (__: Request, res: Response): void => {
  res.status(201);
  res.send({ id: 1, mail: "test@mail.ru" });
});

export default router;
