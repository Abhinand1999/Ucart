import order from "../order/ordermodel";
import order_item from "../orderItem/orderItemModel";
import notification from "./notificationModel";
import Product from "../product/productModel";
import User from "../user/userModel";


order.hasMany(order_item, { foreignKey: "order_id" })
order_item.belongsTo(Product, { foreignKey: "product_id" })

//  view  all notification
const viewNotification = async (req: any, res: any) => {
    const page = parseInt(req.query.page)
    const size = parseInt(req.query.size)

    // view all notification

    let view =  notification.findAll({ attributes: ["message", "key"], limit: size, offset: page * size, order: [['updatedAt', 'DESC']], where: { user_id: req.payload.resp.id } })
   

    let count = notification.count({ where: { key: false } });



   const [View,Count]=await Promise.all([view,count])
    res.status(200).json({ Count,View })
}






// ..................mark as read..

const markasRead = async (req: any, res: any) => {
    try {
        const view = await notification.findAll()

        for (let i of view) {
            await notification.update({ key: true }, { where: { key: false } })

        }
        res.status(200).json({ message: "updated" })

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ message: "error" })
    }
}






// ................... show notification details.............

const notificationDetails = async (req: any, res: any) => {
    try {

        const view = await order.findAll({
            where: { id: req.query.id },
            include:
                [{
                    model: order_item, attributes: ['quantity', 'price', 'subtotal'], include: [{ model: Product, attributes: ["ProductName"] }]
                }

                ]


        })


        const update=await notification.update({ key: true }, { where: {order_id:req.query.id } })
        // console.log(view)
        res.status(200).json({ view,update})

    }
    catch (err) {
        console.log(err)
        res.status(200).json({ message: "error" })
    }
}

export default { viewNotification, markasRead, notificationDetails } 