import cart from "../cart/cartmodel";
import user from "../user/userModel"
import Product from "../product/productModel";
import order from "./ordermodel"
// import orderItem from "../orderItem/orderItemModel"
import notification from "../notification/notificationModel";
import nodemailer from "nodemailer"

import fs, { readSync } from 'fs'
import handlebars from 'handlebars'
import { Op, Sequelize } from "sequelize";
import order_item from "../orderItem/orderItemModel";
import 'core-js'




order.belongsTo(user, { foreignKey: "user_id" })
// user.hasMany(cart,{foreignKey:"user_id"})
// Product.hasMany(orderItem, { foreignKey: "product_id" })
// Product.hasMany(orderItem, { foreignKey: "product_id" })

// Product.hasMany(cart,{foreignKey:"product_id"})




// ...........................add order.....................................


const addorder = async (req: any, res: any) => {
    try {

        const PendingOrders:any= await order.findOne({
            where:
            {
                user_Id: req.payload.resp.id, status : 'pending'
            }
        })

        console.log(PendingOrders)
        if (PendingOrders?.dataValues.status == 'pending') 
        {
            console.log('hi')
            let total,flag=0;
            let totalquntity
            // get cart valuew..
            const view: any = await cart.findAll({
                include: [{
                    model: user,
                    attributes: ["Name"],
                },{
                    model: Product,
                    attributes: ["ProductName", "Category", "Dicription", "Price", "Image","dicount"]
                }]
            })


            // cart have same order

            const Oder: any = await order.findOne({
                where:
                {
                    user_Id: req.payload.resp.id,
                    status: 'pending'
                }
            })

            console.log(Oder.dataValues.TotalPrice)
            total=Oder.dataValues.TotalPrice
            totalquntity=Oder.dataValues.quantity
            let stringifyJson = JSON.stringify(Oder.order_item) //
            let content = JSON.parse(stringifyJson)

            for (let i of view)
            {      const Find=content.find((use:any) => 
                        use.product_id===i.product_id
                    )
                    console.log(Find)

                    if(Find)
                    {   
                        total=total+Find.price*i.quantity
                        // totalquntity=totalquntity-Find.quantity
                        Find.quantity+=i.quantity
                        // total=Find.price*i.quantity+total
                        totalquntity=totalquntity+i.quantity
                    }
                    else 
                    {   
                        content.push({
                        product_id:i.product_id,
                        productName:i.product.ProductName,
                        quantity:i.quantity,
                        price:i.product.Price-(i.product.Price*i.product.discount/100)})//discount

                    total=(i.product.Price-(i.product.Price*i.product.discount/100))*i.quantity+total //discount
                    totalquntity=totalquntity+i.quantity
                    console.log(total)
                    }
               
                
                
            }



            await order.update({ quantity:totalquntity,TotalPrice:total,order_item: content },{ where: { user_id: req.payload.resp.id, status: 'pending' } })
            await cart.destroy({ where: { user_id: req.payload.resp.id } })













            //             let totalPrice = 0;
            //             let Quanlity = 0;

            //             //.....addtotal......
            //             view.forEach((cartItem: any) => {
            //                 const { quantity, product } = cartItem;

            //                 totalPrice += quantity * product.Price;

            //             });


            //             // ...adquntity...
            //             view.forEach((cartItem: any) => {
            //                 const { quantity } = cartItem;
            //                 console.log(quantity)
            //                 Quanlity += quantity;
            //             })


            //             let product_id=[]
            // let quantity=[],price=[],productName=[],orderitem=[]
            //     for (let i=0;i<view.length;i++)
            //      {
            //         const viewiteam=view[i]
            //         productName[i]=viewiteam.product.ProductName,
            //             product_id[i]= viewiteam.product_id,
            //             quantity[i]= viewiteam.quantity,
            //             price[i]=viewiteam.product.Price
            //             orderitem[i] = 
            //             {
            //                 productName: productName[i],
            //                 product_id: product_id[i],
            //                 quantity: quantity[i],
            //                 price: price[i]
            //               };
            //     }


            //             // ...update the order...

            //             let update: any = await order.update({ quantity: Quanlity, TotalPrice: totalPrice ,order_item:orderitem}, { where: { id: PendingOrders.dataValues.id } })


            //             // // update the order item...
            //             // for (let cartItem of view) 
            //             // {
            //             //     await orderItem.findOrCreate({
            //             //         where:
            //             //         {
            //             //             [Op.and]: [{ product_id: cartItem.dataValues.product_id }, { order_id: PendingOrders.dataValues.id }]
            //             //         },
            //             //         defaults: {
            //             //             user_id: req.payload.resp.id,
            //             //             order_id: PendingOrders.dataValues.id,
            //             //             product_id: cartItem.dataValues.product_id,
            //             //             quantity: cartItem.dataValues.quantity,
            //             //             price: cartItem.product.Price,
            //             //             subtotal: cartItem.product.Price * cartItem.dataValues.quantity

            //             //         }
            //             //     }).then(([user, created]) => {
            //             //         if (!created) {
            //             //             // If the user already exists, update the record.
            //             //             return user.update({user_id: req.payload.resp.id,
            //             //                 order_id: PendingOrders.dataValues.id,
            //             //                 product_id: cartItem.dataValues.product_id,
            //             //                 quantity: cartItem.dataValues.quantity,
            //             //                 price: cartItem.product.Price,
            //             //                 subtotal: cartItem.product.Price * cartItem.dataValues.quantity})

            //             //         }
            //             //     }).then(() => {
            //             //         console.log('User created or updated successfully.');
            //             //     })
            //             //    }

            //             const Delete = await cart.destroy({ where: { user_id: req.payload.resp.id } })



            return res.status(400).json({ error: 'You already have a pending order' })
        }
        // admin approve..
        else if (PendingOrders?.dataValues.status == 'approved') {
            return res.status(400).json({ message: 'Your order is on process.......... you cannot place order' })
        }

        else {


            const view: any = await cart.findAll({
                include: [
                    {
                        model: user,
                        attributes: ["Name"],
                    },
                    {
                        model: Product,
                        attributes: ["ProductName", "Category", "Dicription", "Price", "Image","discount"]
                    }]
            })
            



            //........total price.........

            let totalPrice = 0;
            let Quanlity = 0;

            //.....addtotal......
            view.forEach((cartItem: any) => 
            {
                const { quantity, product } = cartItem;

                totalPrice += quantity *(product.Price-(product.Price*product.discount/100));

            });

            //.......addquantity....
            view.forEach((cartItem: any) => {
                const { quantity } = cartItem;
                console.log(quantity)
                Quanlity += quantity;
            })


            // ...create order...
            let order_id, status;
            const View = await cart.findOne()
            // console.log(View)



            // create json value....

            let product_id = []
            let quantity = [], price = [], productName = [], orderitem = []
            for (let i = 0; i < view.length; i++) {
                const viewiteam = view[i]
                product_id[i] = viewiteam.product_id,
                    quantity[i] = viewiteam.quantity,
                    price[i] = viewiteam.product.Price-(viewiteam.product.Price*viewiteam.product.discount/100),
                    productName[i] = viewiteam.product.ProductName
                orderitem[i] = {
                    productName: productName[i],
                    product_id: product_id[i],
                    quantity: quantity[i],
                    price: price[i]
                };
            }



            console.log(orderitem)

            if (View) {
                let add: any = await order.create({
                    user_id: req.payload.resp.id,
                    TotalPrice: totalPrice,
                    quantity: Quanlity,
                    status: "pending",
                    order_item: orderitem
                }).then((item: any) => {

                    order_id = item.id; //get orderid...
                    status = item.status
                })

                // ........... add notification .........


                const adddnot = await notification.create({
                    user_id: req.payload.resp.id,
                    order_id: order_id,
                    message: "your order is pending",
                    key: false
                })
                // console.log({ adddnot })
                // console.log("notifiction add %%%%")


                //................. add to oreder item ..................


                // for (let cartItem of view) {
                //     await orderItem.create({
                //         user_id: req.payload.resp.id,
                //         product_id: cartItem.dataValues.product_id,
                //         order_id: order_id,
                //         quantity: cartItem.dataValues.quantity,
                //         price: cartItem.product.Price,
                //         subtotal: cartItem.product.Price * cartItem.dataValues.quantity
                //     })
                // }

                // ........................... email display.................

                // let Email, Name

                // let view1: any = await user.findAll({ where: { id: req.payload.resp.id } })

                // view1.forEach(
                //     ((user: any) => {
                //         Email = user.dataValues.Email
                //         Name = user.dataValues.Name
                //     })
                // );

                // const templateSource = fs.readFileSync('C:/Users/abhin/Desktop/app/ucart/src/module/order/email.hbs', 'utf-8');
                // const template = handlebars.compile(templateSource);

                // const view2 = await order.findOne({
                //     include:
                //         [
                //             {
                //                 model: orderItem,
                //                 include: [{ model: Product, attributes: ["ProductName", "Image"] }]
                //             }

                //         ],
                //     where: { user_id: req.payload.resp.id }
                // });

                // // console.log(view2)
                // // res.status(200).json({view2})
                // const htmlContent = template({ view2 });


                // const details = {
                //     from: "dreamhomeriss@gmail.com",
                //     to: Email,
                //     subject: "blog",
                //     text: "thank you for your trust",
                //     html: htmlContent
                // };

                // const transporter = nodemailer.createTransport({
                //     service: "gmail",
                //     auth: {
                //         user: "dreamhomeriss@gmail.com",
                //         pass: ""
                //     }
                // });

                // transporter.sendMail(details, (err, info) => {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         console.log(info);
                //     }
                // });


                //.....................delete the cart items..............


                // if (status == 'placed') { const Delete = await cart.destroy({ where: { user_id: req.payload.resp.id } }) }
                await cart.destroy({ where: { user_id: req.payload.resp.id } })

                res.status(200).json({
                    message: "order is sucessfully completed waiting for status",
                    status: "Success"
                })


            }
            else {
                res.status(200).json({
                    message: "your cart have no product",
                })
            }
        }


    }
    catch (err) {
        console.log(err)
        res.status(200).json({
            message: "error1",
            status: false
        })
    }









}


// ....................................view order.........................................

const orderView = async (req: any, res: any) => {
    try {
        const value = await order.findOne({ where: { user_id: req.payload.resp.id } })

        if (!value) {
            res.status(500).json({ message: "you have no order" })
        }
        else 
        {

            if (value.dataValues.status == 'pending' || value.dataValues.status == 'approved') {
                const view = await order.findAll({
                    include: [{
                        model: user,
                        attributes: ["Name", "Address", "pin"],
                    }
                    ]
                })
                console.log(view)
                res.status(201).json({ view })
            }
            else 
            {
                res.status(201).json({ message: "currendly you have no orders" })
            }
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




// ..................................... cancell the order.................................................


const cancelorder = async (req: any, res: any) => {
    try {

        const value = await order.findOne({ where: { user_id: req.payload.resp.id } })
        if (!value) 
        {
            res.status(500).json({ message: "you have no order" })
        }
        else 
        {
            const Delete = await order.destroy({ where: { user_id: req.payload.resp.id } })
            console.log("order cancelled")
            res.status(500).json({ message: "order cancelled" })

            //..notification..

            const update = await notification.update({ message: "order is cancelled" }, { where: { user_id: req.payload.resp.id } })
            console.log("notification", { update })
        }
    }
    catch (err) {
        console.log(err)
        res.status(200).json({ message: "error" })
    }
}




const sample = async (req: any, res: any) => {
    // const orderitem=await orderItem.findAll({where:{id:req.payload.resp.id}})

    let view: any = await user.findAll({ where: { id: req.payload.resp.id } })

    // console.log(view.dataValues.id)





    // // order
    // let view1: any = await order.findAll
    //     ({
    //         include: [
    //             { model: user, attributes: ['Name'] },
    //             { model: orderItem, include: [{ model: Product, attributes: ["ProductName"] }] }],
    //         where: { user_id: req.payload.resp.id }
    //     })


    //    console.log(view1.dataValues.user.dataValues.Name)

    // let TotalPrice,quantity,status,product_name


    //    view1.forEach( 
    //     ((user:any) => { 
    //         TotalPrice=user.dataValues.TotalPrice,
    //         quantity=user.dataValues.quantity,
    //         status=user.dataValues.status
    //         product_name=user.dataValues.order_items
    //         product_name.forEach( 
    //             ((user1:any) => { 
    //                 user1.product.productname

    //     }))})
    //   )
    //   console.log(TotalPrice)
    //   console.log(quantity)
    //   console.log(status)
    //   console.log(product_name)
    // //    console.log(view)


    // let item=await orderItem.findAll({where:{user_id:req.payload.resp.id}})
    let Email, Name



    view.forEach(
        ((user: any) => {
            Email = user.dataValues.Email
            Name = user.dataValues.Name
        })
    );

    //   console.log(view1)



    // let product_id,product_name
    let k = 0
    //   item.forEach( 
    //     (( i:any) => { 
    //         product_id[k]=i.dataValues.product_id
    //         k++
    //     })
    //   );


    //   for(let i of item)
    //   {
    //     product_id ="<br>" +i.dataValues.product_id + "<br>"
    //     product_name="<br>" +i.dataValues.product_id + "<br>"
    //   }
    // console.log(product_id)
    // console.log(view1)
    // const view2 = await order.findOne({
    //   where: { user_id: req.payload.resp.id }
    // });



    // const details={
    //     from:"dreamhomeriss@gmail.com",
    //     to:Email,
    //     subject:"blog",
    //     text:"thank you for your trust",
    //     html:
    //     `<head>


    // </head>
    // <body>
    //     <div class="body">
    //     <div class="header">
    //     <h1>U-cart</h1>
    // </div>
    // <div class="body2">
    //     <p>Dear:${Name}</p>

    //     <p>product:</p>
    //     <style>
    //     {{#each data}}
    //     {
    //         id: '{{id}}',
    //         user_id: '{{user_id}}',
    //         TotalPrice: '{{TotalPrice}}',
    //         quantity: '{{quantity}}'
    //     }
    // {{/each}}
    // </style>
    // </div>

    // </div>
    // </body>
    //  `



    // }

    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: "dreamhomeriss@gmail.com",
    //       pass: "dvxqzszzwwsokczr"
    //     }
    //   });

    //   transporter.sendMail(details, (err, info) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log(info);
    //     }
    //   });









    // const templateSource = fs.readFileSync('C:/Users/abhin/Desktop/app/ucart/src/module/order/email.html', 'utf-8');

    // // Compile the template
    // const template = handlebars.compile(templateSource);

    // // Sample product data
    // let view2:any=await order.findAll
    // ({
    //    where:{user_id:req.payload.resp.id}
    //    })

    // const products = [
    //   {
    //     name: 'Product 1',
    //     price: 19.99,
    //     description: 'A wonderful product.',
    //   },
    //   {
    //     name: 'Product 2',
    //     price: 29.99,
    //     description: 'Another amazing product.',
    //   },
    // ];



    // // Render the template with data
    // const htmlContent = template({ view2: view2 });



    // const details={
    //         from:"dreamhomeriss@gmail.com",
    //         to:Email,
    //         subject:"blog",
    //         text:"thank you for your trust",
    //         html:htmlContent

    // }

    // const transporter=nodemailer.createTransport({
    //     service:"gmail",
    //     auth:{
    //         user:"dreamhomeriss@gmail.com",
    //         pass:"dvxqzszzwwsokczr"
    //     }
    // })

    // transporter.sendMail(details,(err:any,info:any)=>{

    //     if(err)
    //     {
    //         console.log(err)
    //     }
    //     else
    //     {
    //         console.log(info)
    //     }
    // })





    const templateSource = fs.readFileSync('C:/Users/abhin/Desktop/app/ucart/src/module/order/email.hbs', 'utf-8');
    const template = handlebars.compile(templateSource);

    const view2 = await order.findOne({
        include:
            [
                {
                    // model: orderItem,
                    include: [{ model: Product, attributes: ["ProductName", "Image"] }]
                }
            ],
        where: { user_id: req.payload.resp.id }
    });

    console.log(view2)
    res.status(200).json({ view2 })
    const htmlContent = template({ view2 });


    const details = {
        from: "dreamhomeriss@gmail.com",
        to: Email,
        subject: "blog",
        text: "thank you for your trust",
        html: htmlContent
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "dreamhomeriss@gmail.com",
            pass: "dvxqzszzwwsokczr"
        }
    });

    transporter.sendMail(details, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });


}

// view hisory...................

const history = async (req: any, res: any) => {
    try {
        const view = await order.findAll({
            include: [
                { model: user, attributes: ['Name'] },
                // {model:Product,attributes:["ProductName"]}
            ],
            where: { user_id: req.payload.resp.id }
        })
        console.log(view)
        res.status(500).json({ view })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "error" })
    }

}


// qunditity updation
const edit = async (req: any, res: any) => {
    let view: any = await order.findOne({
        where: { user_id: req.payload.resp.id, status: 'pending' }
    })

    // const data:any =fs.readFileSync(view.dataValues.order_item)
    console.log(view.order_item)
    let stringifyJson = JSON.stringify(view.order_item)
    let content = JSON.parse(stringifyJson)
    // console.log(content[0].product_id)


    // for (let i = 0; i < content.length; i++) 
    // {
    //     if (content[i].product_id == req.query.product_id) {
    //         if (content[i].quantity == 0) {
    //             // Remove the element from the array if quantity is 0
    //             content.splice(i, 1);
    //             i--; // Decrement i to account for the removed element
    //         }
    //         else {
    //             content[i].quantity = req.body.quantity;
    //         }
    //     }
    //     else {
    //         // res.status(200).json({ message: 'product not in the order' })
    //     }
    // }
    
    let total=view.dataValues.TotalPrice,quandity=view.dataValues.quantity


    const Find=content.find((use:any) => 
    use.product_id==req.query.product_id)
    console.log(Find)
    // Find.quantity = req.body.quantity;
    if(Find)
    {
        if (0==req.body.quantity) 
        {
            total=total-(Find.quantity*Find.price)
            quandity=quandity-Find.quantity
            const index = content.indexOf(Find);
            if (index > -1) 
            { // only splice array when item is found
              content.splice(index, 1); // 2nd parameter means remove one item only
            }
            await order.update ({quantity:quandity, order_item: content ,TotalPrice:total}, { where: { user_id: req.payload.resp.id, status: 'pending' } })
            res.status(200).json ({ message: 'quntity updated'})
        }

        }
        else if(quandity==0)
        {
            await order.destroy({ where: { user_id: req.payload.resp.id } })
        }
        else 
        {
            res.status(200).json({ message: 'producte not found'})
        }
    }

   



    // stringifyJson=  JSON.stringify(content)
    // console.log(content)
   










    // join

    const  mostsell=async(req:any,res:any)=>
    {
        const mostSell:any= await order_item.findAll({attributes:['product_id',[Sequelize.fn('COUNT','product_id'),'count']],group:"product_id"})
        console.log(mostSell)
        for(let i of mostSell)
        {

        }
        //  console.log(Math.max(mostSell.dataValues.count))
        res.status(200).json({mostSell})
        
    }


    // most sell product in json

    const  Mostsell=async(req:any,res:any)=>
    {
        let array:any=[]
        let view: any = await order.findAll({
            where: {  status: 'success' }
        })
        for(let i of view)
        {
        array.push(i.order_item)
        }
        
        let concatenatedArray:any = [].concat(...array);



//   const groupByCategory = concatenatedArray.groupBy((product:any )=> {
//     return product.product_id;
//   });

    //    console.log(groupByCategory)
    //    res.status(200).json(groupByCategory)
     

    let groupCounts:any={}
    concatenatedArray.forEach((item:any )=>
    {
        const { productName } = item;
        if (!groupCounts[productName]) 
        {
          groupCounts[productName] = 0;
        }
        groupCounts[productName]++;
    });

    //   res.status(200).json({groupCounts})
   
    
    let maxGroups:any= [];
    let maxCount = -1;
    
    for (const category in groupCounts) 
    {
      if (groupCounts[category] > maxCount)
      {
        maxCount = groupCounts[category];
        maxGroups = [category]; // Reset maxGroups with a single category
      } 
      else if(groupCounts[category] === maxCount) 
      {
        maxGroups.push(category); // Add category to maxGroups if it has the same count
      }
    }

    console.log('product:'+maxGroups,'counyt:'+maxCount)

    res.status(200).json({'product':maxGroups,'sell':maxCount})

    }


  

// discound







export default { addorder, orderView, cancelorder, sample, history, edit ,Mostsell}


