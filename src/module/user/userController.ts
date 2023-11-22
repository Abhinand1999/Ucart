import User from './userModel'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import  jwt  from 'jsonwebtoken'
import {Op} from 'sequelize'
import { promises } from 'dns'
import Product from '../product/productModel'




//...........................................Register.....................................

const Register = async (req: any, res: any) => {
    try {

        const value= await User.findOne({where:{Email:req.body.Email}})
            
        if(value){
            res.status(500).json({message:"user alredy Exist"})
        }
        else{
        
        let Name=req.body.Name
        let passwd = req.body.password
        let Email=req.body.Email
        let Address=req.body.Address
        let pin=req.body.pin
        if (!passwd) {
            throw new Error("Please Enter Password")
        }

        const hashpassword = await bcrypt.hash(passwd, 10)

        let user: any = await User.create(
            {
                Name: Name,
                Email: Email,
                password: hashpassword,
                Address:Address,
                pin:pin

            });
        if (!user.Email) {
            throw new Error("Please Enter Email")
        }
        if (!user.Name) {
            throw new Error("Please Enter Name")
        }
        if (!user.Address) {
            throw new Error("Please Enter Address")
        }
        if (!user.pin) {
            throw new Error("Please Enter pin")
        }
        // res.status(200).json(user)
        
        res.status(200).json({
            message: "User created",
            status: "Success"
        })


        //  .....email verification And send mail to user email........


        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"dreamhomeriss@gmail.com",
                pass:"dvxqzszzwwsokczr"
            }
        })

        const details=
        {
            from:"dreamhomeriss@gmail.com",
            to:Email,
            subject:"blog",
            text:"thank you for your trust",
            html:`<b>hey ${req.body.Name}</b><br>thank you for your trust</br>`
        }
        transporter.sendMail(details,(err:any,info:any)=>{

            if(err)
            {
                console.log(err)
            }
            else
            {
                console.log(info)
            }
        })




   }}
   
     catch (error) {
        console.log(error)
        res.status(200).json({
            status: false,
            message: error
        })
    }
}





//....................................login........................................


const login = async (req: any, res: any) => {

    try {
        let Email = req.body.Email
        let userpassword = req.body.password


        let user: any = await User.findOne({
            where: { Email: { [Op.eq]: Email } }
        })
        // console.log(user.password)
        // console.log(user.Email)
        if (!user) {
            return res.status(200).json({ massage: 'invalid user' })
        }
        userpassword = await bcrypt.compare(userpassword, user.password)
        if (!userpassword) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        //............tocken generation..........

        let resp = {
            id: user.id,

        };
        let tocken = jwt.sign({ resp}, "secret", { expiresIn: '300000m' })
        res.json({ message: 'Login successesfully', tocken: tocken })
        // res.json({ message: 'Login successesfully' })



        



    }

    catch (error) {
        console.log('error during login', error)
        res.status(500).json({ message: 'sever error' })
    }

}


function verifyjwt(req:any,res:any,next:any){
    try {
        let authHeader = req.headers.authorization
        if (!authHeader) {
            res.status(500).send({ error: "no tocken provided" })
        }
        let tocken = authHeader.split(" ")[1]
        const decodedToken: any =jwt.verify(tocken, "secret", (err: any, decode: any) => {
            if (err) {
                res.status(500).send({ error: "Authentication failed" })
                console.log(decode)
            }
            else {
                req.payload = decode

                next()
            }
        })

    }
    catch (err) {
        res.send(500).send({ err: "failed" })
    }
}




//.....................................Edit.............................

const edit= async(req:any,res:any)=>{
    try{
        
        let id=req.payload.resp.id
        
    let body=req.body
    console.log(body)
 
    

        let user=await User.update(body,{where:{id:id}})
        console.log(user)
        res.status(500).json({
            message:"profile changed",
            status:"Success"})


}


    catch (error)
    {
        console.log( error)
        res.status(500).json({ message: 'error in editing' })
    }
}



// search user
// const search =async(req:any,res:any)=>
// {
    // const searchKey=req.query.searchKey
    // const [userData,productData]= await Promise.all(
    //     [
    //     User.findAll ({attributes:['id','Name']}),
    //     Product.findAll ({attributes:['id','ProductName','Category']})
    //     ]
    // )
    // const compain=
    
    
//    res.status(200).json({userData,productData})





const search  = async (req: any, res: any) => {
    try {
        const searchKey = req.query.key;
        const userSearchColumns = ['Name', 'email']; 
        const productSearchColumns = ['ProductName', 'Category','Dicription']; 

        const userConditions = userSearchColumns.map(column => ({
            [column]: {
                [Op.like]: `%${searchKey}%`,
            },
        }));

        const productConditions = productSearchColumns.map(column => ({
            [column]: {
                [Op.like]: `%${searchKey}%`,
            },
        }));

        const [userData, productData] = await Promise.all([
            User.findAll({
                attributes: ['id', 'Name'],
                where: { [Op.or]: userConditions },
            }),
            Product.findAll({
                attributes: ['id', 'ProductName'],
                where: { [Op.or]: productConditions },
            }),
        ]);

        //combine
        const combinedData = [
            ...userData.map((user:any) => ({ ...user.toJSON(), type: 'user' })),
            ...productData.map((product:any) => ({ ...product.toJSON(), type: 'product' })),
          ];
        res.json(combinedData)

    }
    catch (error) 
    {
        console.error('Error searching keyword', error);
        return res.status(500).json({ error: 'Failed to search keyword' });
    }
}













export default {Register,login,verifyjwt,edit,search}