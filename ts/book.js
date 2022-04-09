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

const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;
