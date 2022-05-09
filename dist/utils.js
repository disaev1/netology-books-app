"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMessage = exports.bookFileFields = exports.parseBookDataFromReq = void 0;
var lodash_1 = __importDefault(require("lodash"));
var bookFields = ['title', 'description', 'authors', 'favourite'];
var bookFileFields = ['fileCover', 'fileName', 'fileBook'];
exports.bookFileFields = bookFileFields;
function parseBookDataFromReq(req) {
    var res = lodash_1.default.pick(req.body, bookFields);
    // In form data "authors" field is a JSON string, it is not automatically parsed
    if ('authors' in res && typeof res.authors === 'string') {
        try {
            res.authors = JSON.parse(res.authors);
        }
        catch (e) {
            res.authors = [res.authors];
        }
    }
    if (req.files) {
        var files_1 = req.files;
        bookFileFields.forEach(function (field) {
            if (files_1[field]) {
                res[field] = files_1[field][0].filename;
            }
        });
    }
    return res;
}
exports.parseBookDataFromReq = parseBookDataFromReq;
var notFoundMessage = function (id) { return "There is no book with id = ".concat(id, "!"); };
exports.notFoundMessage = notFoundMessage;
