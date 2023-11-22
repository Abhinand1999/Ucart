import  express  from "express";
import dotenv from 'dotenv'

import bodyparser from 'body-parser'
import {db} from './config/config'

import user from './module/user/userRouter'

import prodect from './module/product/productRouter'

import cart from "./module/cart/cartRouter";

import order from "./module/order/orderRouter";

import orderitem from "./module/orderItem/orderItemRouter";

import orderr from "./module/product/productModel";
import admin from "./module/admin/adminRouter"

import notification from "./module/notification/notificationrouter";
import rating from "./module/ratting/rattingroutter";

dotenv.config()
const app=express()

app.use(bodyparser.json())




//db authentication

db.authenticate().then(()=>{
    console.log('database connection successfully')
    })
    .catch((err:any)=>{
        console.log(err)
    })
const port=process.env.PORT



// orderr.sync({alter:true})
//   .then(() => {
//     console.log('table product created');
//   })
//   .catch((err: any) => {
//     console.log(err);
//   })





app.use('/user',user)
app.use('/product',prodect)
app.use('/cart',cart)
app.use('/order',order)
app.use('/orderitem',orderitem)
app.use('/image', express.static('./upload'))
app.use('/notification',notification)
app.use('/admin',admin)
app.use('/rating',rating)

app.use((req, res, next) => {
    res.status(404).send({
    status: 404,
    error: 'api not found'
    })
   })




//port
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

