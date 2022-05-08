import { Request } from 'express';
import _ from 'lodash';

import { Book } from './book';

const bookFields: string[] = ['title', 'description', 'authors', 'favourite'];
const bookFileFields: string[] = ['fileCover', 'fileName', 'fileBook'];

interface NamedFilesContainer {
 [fieldname: string]: Express.Multer.File[];
}

function parseBookDataFromReq(req: Request) {
  const res: Book = _.pick(req.body, bookFields);

  // In form data "authors" field is a JSON string, it is not automatically parsed
  if ('authors' in res && typeof res.authors === 'string') {
    try {
      res.authors = JSON.parse(res.authors);
    } catch (e) {
      res.authors = [res.authors as string];
    }
  }

  if (req.files) {
    const files: NamedFilesContainer = req.files as NamedFilesContainer;

    bookFileFields.forEach((field: string) => {
      if (files[field]) {
        res[field as keyof Book] = files[field][0].filename;
      }
    });
  }

  return res;
}

const notFoundMessage = (id: string): string => `There is no book with id = ${id}!`;

export { parseBookDataFromReq, bookFileFields, notFoundMessage };
