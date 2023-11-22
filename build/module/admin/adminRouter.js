"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const router = Express.Router();
const admin_1 = __importDefault(require("./admin"));
router.get('/sortOrder', admin_1.default.sortview);
router.get('/statusView', admin_1.default.viewStatus);
router.put('/verification', admin_1.default.verification);
exports.default = router;
