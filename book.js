const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  authors: Array,
  favourite: String,
  fileCover: String,
  fileName: String,
  fileBook: String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
