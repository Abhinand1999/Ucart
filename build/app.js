"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config/config");
const userRouter_1 = __importDefault(require("./module/user/userRouter"));
const productRouter_1 = __importDefault(require("./module/product/productRouter"));
const cartRouter_1 = __importDefault(require("./module/cart/cartRouter"));
const orderRouter_1 = __importDefault(require("./module/order/orderRouter"));
const orderItemRouter_1 = __importDefault(require("./module/orderItem/orderItemRouter"));
const adminRouter_1 = __importDefault(require("./module/admin/adminRouter"));
const notificationrouter_1 = __importDefault(require("./module/notification/notificationrouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
//db authentication
config_1.db.authenticate().then(() => {
    console.log('database connection successfully');
})
    .catch((err) => {
    console.log(err);
});
const port = process.env.PORT;
// orderr.sync()
//   .then(() => {
//     console.log('table product created');
//   })
//   .catch((err: any) => {
//     console.log(err);
//   })
app.use('/user', userRouter_1.default);
app.use('/product', productRouter_1.default);
app.use('/cart', cartRouter_1.default);
app.use('/order', orderRouter_1.default);
app.use('/orderitem', orderItemRouter_1.default);
app.use('/image', express_1.default.static('./upload'));
app.use('/notification', notificationrouter_1.default);
app.use('/admin', adminRouter_1.default);
app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        error: 'api not found'
    });
});
//port
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
