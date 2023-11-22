"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationController_1 = __importDefault(require("./notificationController"));
const userController_1 = __importDefault(require("../user/userController"));
const Express = require('express');
const router = Express.Router();
router.get('/notification', userController_1.default.verifyjwt, notificationController_1.default.viewNotification);
router.get('/mark', userController_1.default.verifyjwt, notificationController_1.default.markasRead);
router.get('/details', userController_1.default.verifyjwt, notificationController_1.default.notificationDetails);
exports.default = router;
