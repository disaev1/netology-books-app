import 'reflect-metadata';
import { injectable } from 'inversify';

/// <reference path="./node.d.ts"/>
import BookModel = require('./book');

interface Book {
  id: string;
  title?: string;
  description?: string;
  authors?: string[];
  favourite?: string;
  fileCover?: string;
  fileName?: string;
  fileBook?: string;
}

@injectable()
class BooksRepository {
  async createBook(book: Book): Promise<Book> {
    const newBook = new BookModel(book);

    await newBook.save();

    return newBook.toObject();
  }

  async getBook(id: string): Promise<Book> {
    const targetBook = await BookModel.findOne({ id });

    if (!targetBook) {
      return;
    }

    return targetBook.toObject();
  }

  async getBooks(): Promise<Book[]> {
    const books = await BookModel.find();

    return books.map((book: any) => book.toObject());
  }

  async updateBook(book: Book): Promise<Book> {
    const { id } = book;
    const targetBook = await BookModel.findOne({ id });

    if (!targetBook) {
      return;
    }

    await BookModel.updateOne({ id }, book);

    const updatedBook = await BookModel.findOne({ id });

    return updatedBook.toObject();
  }

  async deleteBook(id: string): Promise<Boolean> {
    const targetBook = await BookModel.findOne({ id });

    if (!targetBook) {
      return false;
    }

    await BookModel.deleteOne({ id });

    return true;
  }
}

export = BooksRepository;
