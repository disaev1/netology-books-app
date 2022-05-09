"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userRoutes = require('./user');
var booksRoutes = require('./books');
var router = express_1.default.Router();
router.use('/user', userRoutes);
router.use('/books', booksRoutes);
exports.default = router;
