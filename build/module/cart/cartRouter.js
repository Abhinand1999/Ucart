"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const cartController_1 = __importDefault(require("./cartController"));
const userController_1 = __importDefault(require("../user/userController"));
router.post('/addcart', userController_1.default.verifyjwt, cartController_1.default.addcart);
router.get('/view', userController_1.default.verifyjwt, cartController_1.default.cartView);
router.delete('/delete', userController_1.default.verifyjwt, cartController_1.default.deletecart);
router.put('/Edit', userController_1.default.verifyjwt, cartController_1.default.Edit);
exports.default = router;
