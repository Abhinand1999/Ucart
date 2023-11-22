"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = require("../../config/config");
const Product = config_1.db.define('product', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ProductName: {
        type: sequelize_1.default.STRING // Use the appropriate data type for the name field
    },
    Category: {
        type: sequelize_1.default.STRING,
    },
    Dicription: {
        type: sequelize_1.default.STRING,
    },
    Price: {
        type: sequelize_1.default.INTEGER,
    },
    Image: {
        type: sequelize_1.default.STRING,
        get() {
            return this.getDataValue('Image').split(',');
        },
        set(val) {
            this.setDataValue('Image', val.join(','));
        }
    }, quantity: {
        type: sequelize_1.default.INTEGER
    }
}, {
    timestamps: true,
    freezeTableName: true
});
exports.default = Product;
