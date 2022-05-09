"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get('/login', function (__, res) {
    res.status(201);
    res.send({ id: 1, mail: "test@mail.ru" });
});
exports.default = router;
