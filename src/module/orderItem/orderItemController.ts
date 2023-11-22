
import user from "../user/userModel"
import Product from "../product/productModel";
import order from "../order/ordermodel"
import orderitem from "../orderItem/orderItemModel";





// orderitem.belongsTo(user,{foreignKey:"user_id"})
// user.hasMany(orderitem,{foreignKey:"user_id"})

order.hasMany(orderitem,{foreignKey:"order_id"})
orderitem.belongsTo(Product,{foreignKey:"product_id"})
// orderitem.belongsTo(order,{foreignKey:"order_id"})

//...view history...


const history= async(req:any,res:any)=>{
try
{
    const view=await order.findAll({
        include:[
        {model:user,attributes:['Name']},
        {model:orderitem,include:[{model:Product,attributes:["ProductName"]}]}],
        where:{user_id:req.payload.resp.id}
        })
    console.log(view)
    res.status(500).json({ view })
}
catch(err)
{
console.log(err)
res.status(500).json({ message:"error" })
}
}





export default {history}

