"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBookFileFields = void 0;
var multer_1 = __importDefault(require("./multer"));
var utils_1 = require("./utils");
var uploadBookFileFields = multer_1.default.fields(utils_1.bookFileFields.map(function (field) { return ({ name: field, maxCount: 1 }); }));
exports.uploadBookFileFields = uploadBookFileFields;
