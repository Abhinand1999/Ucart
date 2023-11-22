"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = require("../../config/config");
const rating = config_1.db.define('rating', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.default.INTEGER // Use the appropriate data type for the name field
    },
    product_id: {
        type: sequelize_1.default.INTEGER
    },
    rating: {
        type: sequelize_1.default.INTEGER
    }
}, {
    timestamps: true,
    freezeTableName: true
});
exports.default = rating;
