"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const productController_1 = __importDefault(require("./productController"));
const userController_1 = __importDefault(require("../user/userController"));
let upload = productController_1.default.upload;
//add product
router.post('/addProduct', upload, productController_1.default.addProduct);
router.get('/view', userController_1.default.verifyjwt, productController_1.default.ViewProduct);
router.put('/update', productController_1.default.upload, productController_1.default.updateproduct);
exports.default = router;
