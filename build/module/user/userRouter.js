"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const userController_1 = __importDefault(require("./userController"));
//register
router.post('/Register', userController_1.default.Register);
router.get('/login', userController_1.default.login);
router.put('/edit', userController_1.default.verifyjwt, userController_1.default.edit);
exports.default = router;
