"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var counter_1 = require("../counter");
var utils_1 = require("../utils");
var errors_1 = require("../errors");
var middleware_1 = require("../middleware");
var BooksRepository_1 = __importDefault(require("../BooksRepository"));
var ioc_container_1 = __importDefault(require("../ioc-container"));
var router = express_1.default.Router();
var backToBooksLink = { to: '/books', title: 'К списку', icon: 'arrow-left' };
var repo = ioc_container_1.default.get(BooksRepository_1.default);
router.get('/', function (__, res) { return __awaiter(void 0, void 0, void 0, function () {
    var books, views;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, repo.getBooks()];
            case 1:
                books = _a.sent();
                return [4 /*yield*/, (0, counter_1.getCounters)(books.map(function (book) { return book.id; }))];
            case 2:
                views = _a.sent();
                res.render('books/index', { title: 'Главная', books: books, views: views, link: false });
                return [2 /*return*/];
        }
    });
}); });
router.get('/create', function (__, res) {
    res.render('books/create', { title: 'Добавить книгу', book: {}, link: backToBooksLink });
});
router.post('/create', middleware_1.uploadBookFileFields, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, repo.createBook(__assign({ id: (0, uuid_1.v4)() }, (0, utils_1.parseBookDataFromReq)(req)))];
            case 1:
                _a.sent();
                res.redirect('/books');
                return [2 /*return*/];
        }
    });
}); });
router.post('/update/:id', middleware_1.uploadBookFileFields, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updatedBook;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, repo.updateBook(__assign({ id: id }, (0, utils_1.parseBookDataFromReq)(req)))];
            case 1:
                updatedBook = _a.sent();
                if (!updatedBook) {
                    next(new errors_1.NotFoundError((0, utils_1.notFoundMessage)(id)));
                }
                res.redirect('/books');
                return [2 /*return*/];
        }
    });
}); });
router.get('/update/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, targetBook;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, repo.getBook(id)];
            case 1:
                targetBook = _a.sent();
                if (!targetBook) {
                    next(new errors_1.NotFoundError((0, utils_1.notFoundMessage)(id)));
                }
                res.render('books/create', { title: 'Редактировать книгу', book: targetBook, link: backToBooksLink });
                return [2 /*return*/];
        }
    });
}); });
router.get('/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, targetBook, views;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, repo.getBook(id)];
            case 1:
                targetBook = _a.sent();
                if (!targetBook) {
                    next(new errors_1.NotFoundError((0, utils_1.notFoundMessage)(id)));
                }
                return [4 /*yield*/, (0, counter_1.incrCounter)(targetBook.id)];
            case 2:
                views = _a.sent();
                res.render('books/view', { title: 'Информация о книге', book: targetBook, views: views, link: backToBooksLink });
                return [2 /*return*/];
        }
    });
}); });
router.use(function (err, __, res, ___) {
    if (err instanceof errors_1.NotFoundError) {
        return res.render('not-found', { link: false });
    }
    res.status(500).send({ status: 'error', message: err.message });
});
exports.default = router;