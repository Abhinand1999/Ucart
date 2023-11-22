"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = require("../../config/config");
const order_item = config_1.db.define('order_item', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.default.INTEGER // Use the appropriate data type for the name field
    },
    product_id: {
        type: sequelize_1.default.INTEGER,
    },
    order_id: {
        type: sequelize_1.default.INTEGER
    },
    quantity: {
        type: sequelize_1.default.INTEGER
    },
    price: {
        type: sequelize_1.default.INTEGER
    },
    subtotal: {
        type: sequelize_1.default.INTEGER
    }
}, {
    timestamps: true,
    freezeTableName: true
});
exports.default = order_item;
