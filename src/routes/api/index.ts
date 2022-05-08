const express = require('express');
const userRoutes = require('./user');
const booksRoutes = require('./books');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/books', booksRoutes);

module.exports = router;
