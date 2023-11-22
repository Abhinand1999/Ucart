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
const userModel_1 = __importDefault(require("./userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
//...........................................Register.....................................
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield userModel_1.default.findOne({ where: { Email: req.body.Email } });
        if (value) {
            res.status(500).json({ message: "user alredy Exist" });
        }
        else {
            let Name = req.body.Name;
            let passwd = req.body.password;
            let Email = req.body.Email;
            let Address = req.body.Address;
            let pin = req.body.pin;
            if (!passwd) {
                throw new Error("Please Enter Password");
            }
            const hashpassword = yield bcrypt_1.default.hash(passwd, 10);
            let user = yield userModel_1.default.create({
                Name: Name,
                Email: Email,
                password: hashpassword,
                Address: Address,
                pin: pin
            });
            if (!user.Email) {
                throw new Error("Please Enter Email");
            }
            if (!user.Name) {
                throw new Error("Please Enter Name");
            }
            if (!user.Address) {
                throw new Error("Please Enter Address");
            }
            if (!user.pin) {
                throw new Error("Please Enter pin");
            }
            // res.status(200).json(user)
            res.status(200).json({
                message: "User created",
                status: "Success"
            });
            //  .....email verification And send mail to user email........
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: "dreamhomeriss@gmail.com",
                    pass: "dvxqzszzwwsokczr"
                }
            });
            const details = {
                from: "dreamhomeriss@gmail.com",
                to: Email,
                subject: "blog",
                text: "thank you for your trust",
                html: `<b>hey ${req.body.Name}</b><br>thank you for your trust</br>`
            };
            transporter.sendMail(details, (err, info) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(info);
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(200).json({
            status: false,
            message: error
        });
    }
});
//....................................login........................................
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Email = req.body.Email;
        let userpassword = req.body.password;
        let user = yield userModel_1.default.findOne({
            where: { Email: { [sequelize_1.Op.eq]: Email } }
        });
        // console.log(user.password)
        // console.log(user.Email)
        if (!user) {
            return res.status(200).json({ massage: 'invalid user' });
        }
        userpassword = yield bcrypt_1.default.compare(userpassword, user.password);
        if (!userpassword) {
            return res.status(401).json({ message: 'Invalid password.' });
        }
        //............tocken generation..........
        let resp = {
            id: user.id,
        };
        let tocken = jsonwebtoken_1.default.sign({ resp }, "secret", { expiresIn: '3000m' });
        res.json({ message: 'Login successesfully', tocken: tocken });
        // res.json({ message: 'Login successesfully' })
    }
    catch (error) {
        console.log('error during login', error);
        res.status(500).json({ message: 'sever error' });
    }
});
function verifyjwt(req, res, next) {
    try {
        let authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(500).send({ error: "no tocken provided" });
        }
        let tocken = authHeader.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(tocken, "secret", (err, decode) => {
            if (err) {
                res.status(500).send({ error: "Authentication failed" });
                console.log(decode);
            }
            else {
                req.payload = decode;
                next();
            }
        });
    }
    catch (err) {
        res.send(500).send({ err: "failed" });
    }
}
//.....................................Edit.............................
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.payload.resp.id;
        let body = req.body;
        console.log(body);
        let user = yield userModel_1.default.update(body, { where: { id: id } });
        console.log(user);
        res.status(500).json({
            message: "profile changed",
            status: "Success"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error in editing' });
    }
});
exports.default = { Register, login, verifyjwt, edit };
