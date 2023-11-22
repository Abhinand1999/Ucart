"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ordermodel_1 = __importDefault(require("../order/ordermodel"));
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
const notificationModel_1 = __importDefault(require("../notification/notificationModel"));
//.......................... view in sorted order...............................
const sortview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, moment_1.default)();
    let Where = {};
    // ...if two value present..
    if (req.query.status) {
        Where.status = req.query.status;
    }
    if (req.query.endDate && req.query.startDate) {
        Where.createdAt = { [sequelize_1.Op.between]: [(0, moment_1.default)(req.query.endDate).startOf('days'), (0, moment_1.default)(req.query.startDate).endOf('days')] };
    }
    else {
        Where.createdAt = { [sequelize_1.Op.between]: [(0, moment_1.default)().startOf('day'), (0, moment_1.default)().endOf('day')] };
    }
    const view = yield ordermodel_1.default.findAll({ where: Where, order: [['createdAt', 'DESC'],] });
    console.log(view);
    res.status(200).json({ view });
});
// ...........view status of the order.......
const viewStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if parameter in status....
    if (req.query.status) {
        const view = yield ordermodel_1.default.findAll({
            where: { status: req.query.status },
            order: [
                ['updatedAt', 'DESC'],
            ]
        });
        res.status(500).json({ view });
    }
    else {
        // no parameter are given
        const view = yield ordermodel_1.default.findAll({
            where: { status: "pending" },
            order: [
                ['updatedAt', 'DESC'],
            ]
        });
        res.status(500).json({ view });
    }
});
//............................. order approvel.........................
const verification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const View = yield ordermodel_1.default.findOne({ where: { id: req.query.id } });
    if (!View) {
        res.status(500).json({ message: "id not found !" });
    }
    else {
        const view = yield ordermodel_1.default.update({ status: "approved" }, { where: { status: "pending", id: req.query.id } });
        res.status(500).json({ message: "verified" });
        //.......notification....
        const update = yield notificationModel_1.default.update({ message: "order is approved and wait for order" }, { where: { order_id: req.query.id } });
        console.log("notification", { update });
    }
});
exports.default = { sortview, viewStatus, verification };
