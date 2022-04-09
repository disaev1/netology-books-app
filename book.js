"use strict";
var mongoose = require('mongoose');
var bookSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    authors: Array,
    favourite: String,
    fileCover: String,
    fileName: String,
    fileBook: String,
});
var BookModel = mongoose.model('Book', bookSchema);
module.exports = BookModel;
