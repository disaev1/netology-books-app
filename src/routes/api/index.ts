import express, { Router } from 'express';

const userRoutes: Router = require('./user');
const booksRoutes: Router = require('./books');

const router: Router = express.Router();

router.use('/user', userRoutes);
router.use('/books', booksRoutes);

export default router;
