"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = require("../../config/config");
const User = config_1.db.define('user', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: sequelize_1.default.STRING // Use the appropriate data type for the name field
    },
    Email: {
        type: sequelize_1.default.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.default.STRING,
    },
    Address: {
        type: sequelize_1.default.STRING,
    },
    pin: {
        type: sequelize_1.default.INTEGER,
    }
}, {
    timestamps: true,
    freezeTableName: true
});
exports.default = User;
