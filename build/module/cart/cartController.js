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
const cartmodel_1 = __importDefault(require("./cartmodel"));
const userModel_1 = __importDefault(require("../user/userModel"));
const productModel_1 = __importDefault(require("../product/productModel"));
// ...........................add cart.....................................
const addcart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield cartmodel_1.default.findOne({ where: { product_id: req.query.product_id } });
        if (value) {
            //if  same item are add the incriment that value
            const Update = yield cartmodel_1.default.update({ quantity: req.body.quantity }, { where: { product_id: req.query.product_id } });
            console.log("your item is updated");
            res.status(500).json({ message: "item updated" });
            if (req.body.quantity == 0) {
                // if quantity zero
                yield cartmodel_1.default.destroy({ where: { product_id: req.query.product_id } });
                res.status(500).json({ message: "item removed" });
            }
        }
        else {
            // if not product id in the database and quntity zero
            if (req.body.quantity == 0) {
                yield cartmodel_1.default.destroy({ where: { product_id: req.query.product_id } });
                res.status(500).json({ message: "quntity is zero" });
            }
            else {
                let id = req.payload.resp.id;
                if (req.query.product_id && req.body.quantity) //for proper value in feild
                 {
                    const add = yield cartmodel_1.default.create({
                        user_id: id,
                        product_id: req.query.product_id,
                        quantity: req.body.quantity
                    });
                    res.status(200).json({
                        message: "cart created",
                        status: "Success"
                    });
                }
                else {
                    res.status(500).json({ message: "enter proper feild" });
                }
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({
            message: "error",
            status: false
        });
    }
});
cartmodel_1.default.belongsTo(userModel_1.default, { foreignKey: "user_id" });
cartmodel_1.default.belongsTo(productModel_1.default, { foreignKey: "product_id" });
//............................ view cart ...................................
const cartView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let view = yield cartmodel_1.default.findAll({});
        console.log(view);
        if (!view) {
            res.status(201).json({ message: "your cart have no item" });
        }
        else {
            view = yield cartmodel_1.default.findAll({
                include: [{
                        model: productModel_1.default,
                        attributes: ["ProductName", "Category", "Dicription", "Price", "Image", "quantity"]
                    }]
            });
            //total price
            let totalPrice = 0;
            view.forEach((cartItem) => {
                const { quantity, product } = cartItem;
                console.log({ quantity });
                totalPrice += quantity * product.Price;
            });
            let Quanlity = 0;
            view.forEach((cartItem) => {
                const { quantity } = cartItem;
                console.log(quantity);
                Quanlity += quantity;
                console.log(Quanlity);
            });
            console.log(Quanlity);
            res.status(201).json({ view, totalPrice });
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({
            message: "error",
            status: false
        });
    }
});
//...........................delete the cart.......................................
const deletecart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield cartmodel_1.default.findOne({ where: { user_id: req.payload.resp.id } });
        if (!value) {
            res.status(500).json({ message: "you have no cart items" });
        }
        else {
            if (req.query.product_id) {
                const Delete = yield cartmodel_1.default.destroy({ where: { product_id: req.query.product_id } });
                console.log(Delete, "deleted");
                res.status(500).json({ message: "deleted" });
            }
            else {
                res.status(500).json({ message: "product not found" });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ message: "error" });
    }
});
//...............................Edit quntity.................
const Edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield cartmodel_1.default.findOne({ where: { user_id: req.payload.resp.id } });
        if (!value) {
            //..database have no value...
            res.status(500).json({ message: "you have no cart items" });
        }
        else {
            if (req.body.quantity == 0) {
                //..quantity is zero..
                const Delete = yield cartmodel_1.default.destroy({ where: { product_id: req.query.product_id } });
                console.log(Delete, "deleted");
                res.status(500).json({ message: "deleted" });
            }
            if (req.query.product_id) {
                const Update = yield cartmodel_1.default.update(req.body, { where: { product_id: req.query.product_id } });
                console.log(Update, "update");
                res.status(500).json({ message: "updated" });
            }
            else {
                res.status(500).json({ message: "product not fount" });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ message: "error" });
    }
});
exports.default = { addcart, cartView, deletecart, Edit };
