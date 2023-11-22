"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const userController_1 = __importDefault(require("../user/userController"));
const orderItemController_1 = __importDefault(require("./orderItemController"));
router.get('/history', userController_1.default.verifyjwt, orderItemController_1.default.history);
exports.default = router;
