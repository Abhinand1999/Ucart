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
const orderItemModel_1 = __importDefault(require("../orderItem/orderItemModel"));
const notificationModel_1 = __importDefault(require("./notificationModel"));
const productModel_1 = __importDefault(require("../product/productModel"));
ordermodel_1.default.hasMany(orderItemModel_1.default, { foreignKey: "order_id" });
orderItemModel_1.default.belongsTo(productModel_1.default, { foreignKey: "product_id" });
//  view  all notification
const viewNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    // view all notification
    let view = notificationModel_1.default.findAll({ attributes: ["message", "key"], limit: size, offset: page * size, order: [['updatedAt', 'DESC']], where: { user_id: req.payload.resp.id } });
    let count = notificationModel_1.default.count({ where: { key: false } });
    const [View, Count] = yield Promise.all([view, count]);
    res.status(200).json({ Count, View });
});
// ..................mark as read..
const markasRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const view = yield notificationModel_1.default.findAll();
        for (let i of view) {
            yield notificationModel_1.default.update({ key: true }, { where: { key: false } });
        }
        res.status(200).json({ message: "updated" });
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ message: "error" });
    }
});
// ................... show notification details.............
const notificationDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const view = yield ordermodel_1.default.findAll({
            where: { id: req.query.id },
            include: [{
                    model: orderItemModel_1.default, attributes: ['quantity', 'price', 'subtotal'], include: [{ model: productModel_1.default, attributes: ["ProductName"] }]
                }
            ]
        });
        const update = yield notificationModel_1.default.update({ key: true }, { where: { order_id: req.query.id } });
        // console.log(view)
        res.status(200).json({ view, update });
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ message: "error" });
    }
});
exports.default = { viewNotification, markasRead, notificationDetails };
