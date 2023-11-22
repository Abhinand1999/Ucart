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
const productModel_1 = __importDefault(require("./productModel"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs = require('fs');
//............................imageupload..............................................
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
// const upload = multer({ storage: storage }).single("file")    //single
const upload = (0, multer_1.default)({ storage: storage }).array('files', 100); // for multiple image upload
//.....................................addproduct..............................................................
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let image = [];
        if (req.files) { //files have list of attibute so we itreate it for extract
            let k = 0;
            // logic to save url in db
            for (let i of req.files) {
                image[k] = i.filename;
                k++;
            }
            console.log(image);
        }
        const value = yield productModel_1.default.findOne({ where: { ProductName: req.body.ProductName } });
        if (value) {
            res.status(500).json({ message: "item alredy in shop" });
        }
        else {
            const add = yield productModel_1.default.create({
                ProductName: req.body.ProductName,
                Category: req.body.Category,
                Dicription: req.body.Dicription,
                Price: req.body.Price,
                Image: image,
                quantity: req.body.quantity,
            });
            res.status(200).json({
                message: "User created",
                status: "Success"
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ message: "error" });
    }
});
//........................................view...........................................................
const ViewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    console.log(page);
    console.log(size);
    const list = yield productModel_1.default.findAll({
        limit: size, offset: page * size, order: [
            ['updatedAt', 'DESC']
        ]
    });
    // console.log(JSON.stringify(list, null, 2));
    // const viewOne =await blog.findAll({})
    res.status(500).json({ list });
});
//...............................update...........................................................................
const updateproduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.query.id;
        let body = req.body;
        const view = yield productModel_1.default.findOne({ where: { id } });
        if (!view) {
            res.status(500).json({ message: "id not found" });
        }
        else {
            if (req.files) {
                const oldProduct = yield productModel_1.default.findByPk(id);
                if (oldProduct && oldProduct.get('Image')) {
                    // Delete the old image file
                    oldProduct.Image.forEach((imageFilename) => {
                        const imagePath = path_1.default.join(__dirname, '..', '..', '..', 'uploads', imageFilename);
                        try {
                            fs.unlinkSync(imagePath);
                            console.log(`Deleted ${imageFilename} successfully`);
                        }
                        catch (error) {
                            console.error(`Error deleting ${imageFilename}:`, error);
                        }
                    });
                    let image = [];
                    if (req.files) { //files have list of attibute so we itreate it for extract
                        let k = 0;
                        // logic to save url in db
                        for (let i of req.files) {
                            image[k] = i.filename;
                            k = k + 1;
                        }
                        console.log(image);
                        body.Image = image;
                    }
                    const update = yield productModel_1.default.update(body, { where: { id: id } });
                    console.log(update);
                    res.status(500).json({ message: "is updated" });
                }
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(200).json({ message: "error" });
    }
});
exports.default = { addProduct, upload, ViewProduct, updateproduct };
