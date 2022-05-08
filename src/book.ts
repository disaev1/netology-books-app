import mongoose from 'mongoose';

const { Schema, SchemaTypes } = mongoose;

const bookSchema = new Schema({
  id: SchemaTypes.String,
  title: SchemaTypes.String,
  description: SchemaTypes.String,
  authors: [SchemaTypes.String],
  favourite: SchemaTypes.String,
  fileCover: SchemaTypes.String,
  fileName: SchemaTypes.String,
  fileBook: SchemaTypes.String,
});

interface Book {
  id?: string;
  title?: string;
  description?: string;
  authors?: string[] | string;
  favourite?: string;
  fileCover?: string;
  fileName?: string;
  fileBook?: string;
}

const BookModel = mongoose.model<Book>('Book', bookSchema);

export default BookModel;

export { Book };
