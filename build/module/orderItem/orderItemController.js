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
const userModel_1 = __importDefault(require("../user/userModel"));
const productModel_1 = __importDefault(require("../product/productModel"));
const ordermodel_1 = __importDefault(require("../order/ordermodel"));
const orderItemModel_1 = __importDefault(require("../orderItem/orderItemModel"));
// orderitem.belongsTo(user,{foreignKey:"user_id"})
// user.hasMany(orderitem,{foreignKey:"user_id"})
ordermodel_1.default.hasMany(orderItemModel_1.default, { foreignKey: "order_id" });
orderItemModel_1.default.belongsTo(productModel_1.default, { foreignKey: "product_id" });
// orderitem.belongsTo(order,{foreignKey:"order_id"})
//...view history...
const history = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const view = yield ordermodel_1.default.findAll({
            include: [
                { model: userModel_1.default, attributes: ['Name'] },
                { model: orderItemModel_1.default, include: [{ model: productModel_1.default, attributes: ["ProductName"] }] }
            ],
            where: { user_id: req.payload.resp.id }
        });
        console.log(view);
        res.status(500).json({ view });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "error" });
    }
});
exports.default = { history };
