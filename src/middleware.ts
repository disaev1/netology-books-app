import upload from './multer';
import { RequestHandler } from 'express';
import { bookFileFields } from './utils';

const uploadBookFileFields: RequestHandler = upload.fields(bookFileFields.map(field => ({ name: field, maxCount: 1 })));

export { uploadBookFileFields };
