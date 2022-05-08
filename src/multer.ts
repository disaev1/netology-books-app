import multer, { StorageEngine } from 'multer';
import { Request } from 'express';

const storage: StorageEngine = multer.diskStorage({
  destination(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, './public/img/');
  },

  filename(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export default multer({ storage });
