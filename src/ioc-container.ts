import 'reflect-metadata';
import { Container } from 'inversify';
import BooksRepository from './BooksRepository';

const iocContainer: Container = new Container();

iocContainer.bind<BooksRepository>(BooksRepository).toSelf().inSingletonScope();

export default iocContainer;
