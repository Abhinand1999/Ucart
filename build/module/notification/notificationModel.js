"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = require("../../config/config");
const notification = config_1.db.define('notification', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.default.INTEGER // Use the appropriate data type for the name field
    },
    order_id: {
        type: sequelize_1.default.INTEGER
    },
    message: {
        type: sequelize_1.default.STRING
    },
    key: {
        type: sequelize_1.default.BOOLEAN, allowNull: false, defaultValue: true
    }
}, {
    timestamps: true,
    freezeTableName: true
});
exports.default = notification;
