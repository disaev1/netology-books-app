import express, { Express, Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';

import apiRoutes from './routes/api';
import booksViewRoutes from './routes/booksView';

const PORT: string | number = process.env.PORT || 3000;
const MONGO_DB_URL: string = process.env.MONGO_DB_URL || 'mongodb://db:27017/test';
const app: Express = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/books', booksViewRoutes);
app.use('/public', express.static(path.join(__dirname, './public')));

app.use((req: Request, res: Response): void => {
  res.status(404);
  res.send({ status: 'error', message: `Route "${req.url}" is not found` });
});

async function main(): Promise<void> {
  await mongoose.connect(MONGO_DB_URL);

  app.listen(PORT);
}

main().catch((err: Error) => console.log(err));
