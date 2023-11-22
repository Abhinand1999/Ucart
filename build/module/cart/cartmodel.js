"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = require("../../config/config");
const cart = config_1.db.define('cart', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.default.INTEGER
    },
    product_id: {
        type: sequelize_1.default.INTEGER,
    },
    quantity: {
        type: sequelize_1.default.INTEGER
    }
}, {
    timestamps: true,
    freezeTableName: true
});
exports.default = cart;
