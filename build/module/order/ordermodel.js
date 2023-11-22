"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = require("../../config/config");
const order = config_1.db.define('order', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.default.INTEGER // Use the appropriate data type for the name field
    },
    TotalPrice: {
        type: sequelize_1.default.INTEGER,
    },
    quantity: {
        type: sequelize_1.default.INTEGER
    },
    status: {
        type: sequelize_1.default.STRING,
    },
    order_item: {
        type: sequelize_1.default.JSON,
        allowNull: false
    }
}, {
    timestamps: true,
    freezeTableName: true
});
exports.default = order;
