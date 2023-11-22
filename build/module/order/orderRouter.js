"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const orderController_1 = __importDefault(require("./orderController"));
const userController_1 = __importDefault(require("../user/userController"));
router.post('/addorder', userController_1.default.verifyjwt, orderController_1.default.addorder);
router.get('/orderView', userController_1.default.verifyjwt, orderController_1.default.orderView);
router.get('/sample', userController_1.default.verifyjwt, orderController_1.default.sample);
router.delete('/cancel', userController_1.default.verifyjwt, orderController_1.default.cancelorder);
router.get('/history', userController_1.default.verifyjwt, orderController_1.default.history);
router.put('/update', userController_1.default.verifyjwt, orderController_1.default.edit);
router.get('/mostsell', orderController_1.default.Mostsell);
exports.default = router;
