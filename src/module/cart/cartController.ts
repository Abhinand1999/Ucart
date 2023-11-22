import sequelize from 'sequelize'
import cart from "./cartmodel";
import user from "../user/userModel"
import Product from "../product/productModel";
import { Sequelize } from "sequelize";



// ...........................add cart.....................................

const addcart = async (req: any, res: any) => {

    try {
        const value = await cart.findOne({ where: { product_id: req.query.product_id } })

        if (value) 
        {

            //if  same item are add the incriment that value
            const Update = await cart.update({ quantity: req.body.quantity }, { where: { product_id: req.query.product_id } })
            console.log("your item is updated")
            res.status(500).json({ message: "item updated" })
            if (req.body.quantity == 0) 
            {
                // if quantity zero
                await cart.destroy({ where: { product_id: req.query.product_id } })
                res.status(500).json({ message: "item removed" })
            }
        }

        else {

            // if not product id in the database and quntity zero

            if (req.body.quantity == 0) 
            {
                await cart.destroy({ where: { product_id: req.query.product_id } })
                res.status(500).json({ message: "quntity is zero" })
            } 
            else 
            {

                let id = req.payload.resp.id

                if (req.query.product_id && req.body.quantity) //for proper value in feild
            
                {
                    const add = await cart.create({
                        user_id: id,
                        product_id: req.query.product_id,
                        quantity: req.body.quantity
                    })
                    res.status(200).json({
                        message: "cart created",
                        status: "Success"
                    })
                }
                else {
                    res.status(500).json({ message: "enter proper feild" })
                }
            }
        }
    }
    catch (err) 
    {
        console.log(err)
        res.status(200).json({
            message: "error",
            status: false
        })
    }




}



cart.belongsTo(user, { foreignKey: "user_id" })
cart.belongsTo(Product, { foreignKey: "product_id" })







//............................ view cart ...................................

const cartView = async (req: any, res: any) => {
    
    try {

        let view = await cart.findAll({})
        console.log(view)
        if (!view) {
            res.status(201).json({ message: "your cart have no item" })
        }
        else {

             view = await cart.findAll({
                include: [{
                    model: Product,
                    attributes: ["ProductName", "Category", "Dicription", "Price", "Image", "quantity"]
                }]
            })

            //total price

            let totalPrice = 0;
            view.forEach((cartItem: any) => {
                const { quantity, product } = cartItem;
                console.log({ quantity })
                totalPrice += quantity * product.Price;
            });
            let Quanlity = 0


            view.forEach((cartItem: any) => {

                const { quantity } = cartItem;
                console.log(quantity)

                Quanlity += quantity;
                console.log(Quanlity)
            })
            console.log(Quanlity)
            res.status(201).json({ view, totalPrice });
        }
    }

    catch (err) {
        console.log(err)
        res.status(200).json({
            message: "error",
            status: false
        })

    }

}



//...........................delete the cart.......................................


const deletecart = async (req: any, res: any) => {
    try {
        const value = await cart.findOne({ where: { user_id: req.payload.resp.id } })
        if (!value) {
            res.status(500).json({ message: "you have no cart items" })
        }
        else {
            if (req.query.product_id) {
                const Delete = await cart.destroy({ where: { product_id: req.query.product_id } })
                console.log(Delete, "deleted")
                res.status(500).json({ message: "deleted" })
            }
            else {
                res.status(500).json({ message: "product not found" })
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ message: "error" })
    }
}





//...............................Edit quntity.................

const Edit = async (req: any, res: any) => {
    try {

        const value = await cart.findOne({ where: { user_id: req.payload.resp.id } })
        if (!value)
        {
            //..database have no value...
            res.status(500).json({ message: "you have no cart items" })
        }
        else {

            if (req.body.quantity == 0) 
            {
                //..quantity is zero..
                const Delete = await cart.destroy({ where: { product_id: req.query.product_id } })
                console.log(Delete, "deleted")
                res.status(500).json({ message: "deleted" })
            }
            if (req.query.product_id) 
            {

                const Update = await cart.update(req.body, { where: { product_id: req.query.product_id } })
                console.log(Update, "update")
                res.status(500).json({ message: "updated" })
            }
            else { res.status(500).json({ message: "product not fount" }) }
        }
    }
    catch (err) 
    {
        console.log(err)
        res.status(200).json({ message: "error" })
    }
}

export default { addcart, cartView, deletecart, Edit }
