import 'reflect-metadata';
import { injectable } from 'inversify';
import type { Document } from 'mongoose';

import BookModel, { Book } from './book';

@injectable()
class BooksRepository {
  static async createBook(book: Book): Promise<Book> {
    const newBook: Document = new BookModel(book);

    await newBook.save();

    return newBook.toObject();
  }

  static async getBook(id: string): Promise<Book | boolean> {
    const targetBook: Document = await BookModel.findOne({ id });

    if (!targetBook) {
      return false;
    }

    return targetBook.toObject();
  }

  static async getBooks(): Promise<Book[]> {
    const books: Document[] = await BookModel.find();

    return books.map((book: Document) => book.toObject());
  }

  static async updateBook(book: Book): Promise<Book | boolean> {
    const { id } = book;
    const targetBook: Document = await BookModel.findOne({ id });

    if (!targetBook) {
      return false;
    }

    await BookModel.updateOne({ id }, book);

    const updatedBook: Document = await BookModel.findOne({ id });

    return updatedBook.toObject();
  }

  static async deleteBook(id: string): Promise<boolean> {
    const targetBook: Document = await BookModel.findOne({ id });

    if (!targetBook) {
      return false;
    }

    await BookModel.deleteOne({ id });

    return true;
  }
}

export default BooksRepository;
