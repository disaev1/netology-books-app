"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema, SchemaTypes = mongoose_1.default.SchemaTypes;
var bookSchema = new Schema({
    id: SchemaTypes.String,
    title: SchemaTypes.String,
    description: SchemaTypes.String,
    authors: [SchemaTypes.String],
    favourite: SchemaTypes.String,
    fileCover: SchemaTypes.String,
    fileName: SchemaTypes.String,
    fileBook: SchemaTypes.String,
});
var BookModel = mongoose_1.default.model('Book', bookSchema);
exports.default = BookModel;
