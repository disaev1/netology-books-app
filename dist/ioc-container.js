"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var inversify_1 = require("inversify");
var BooksRepository_1 = __importDefault(require("./BooksRepository"));
var iocContainer = new inversify_1.Container();
iocContainer.bind(BooksRepository_1.default).toSelf().inSingletonScope();
exports.default = iocContainer;
