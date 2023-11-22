
import Product from "./productModel";
import multer from 'multer'
import path from 'path'
const fs = require('fs');
const { Op }= require ('sequelize')
//............................imageupload..............................................

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});









// const upload = multer({ storage: storage }).single("file")    //single
const upload = multer({ storage: storage}).array('files',100)// for multiple image upload

//.....................................addproduct..............................................................



const addProduct=async(req:any,res:any)=>{
    try{
     let image=[]

if(req.files) {//files have list of attibute so we itreate it for extract
    let k=0
  // logic to save url in db
  for (let i of req.files) {
    image[k]=i.filename
    k++
  }
  console.log(image)
}
            const value= await Product.findOne({where:{ProductName:req.body.ProductName}})
            
            if(value){
                res.status(500).json({message:"item alredy in shop"})
            }
            
            else{

            
const  add= await Product.create({
    
    ProductName:req.body.ProductName,
    Category:req.body.Category,
    Dicription:req.body.Dicription,
    Price:req.body.Price,
    Image:image,
    quantity:req.body.quantity,
    
}
            
)   
    res.status(200).json({
    message: "User created",
    status: "Success"})

 }
}
catch(err)
{
console.log(err)
res.status(200).json({message:"error"})
}
}







//........................................view...........................................................


const ViewProduct = async (req: any, res: any) => {
    const page = parseInt(req.query.page)
    const size = parseInt(req.query.size)
    console.log(page)
    console.log(size)

    const list = await Product.findAll(
        {
            limit: size, offset: page * size, order: [
                ['updatedAt', 'DESC']]
        });
    // console.log(JSON.stringify(list, null, 2));
    // const viewOne =await blog.findAll({})
    res.status(500).json({ list })
}








//...............................update...........................................................................


const updateproduct=async(req:any,res:any)=>{
    try{
        let id=req.query.id
        let body=req.body
        const view=await Product.findOne({where:{id}})
       if(!view){
        res.status(500).json({ message: "id not found"})
       }
       else{
        if(req.files){
            const oldProduct:any = await Product.findByPk(id);
            
            if (oldProduct && oldProduct.get('Image')) 
            {
                // Delete the old image file
                oldProduct.Image.forEach((imageFilename :any)=> {
                    const imagePath = path.join(__dirname, '..', '..', '..', 'uploads', imageFilename);
                  
                    try {
                      fs.unlinkSync(imagePath);
                      console.log(`Deleted ${imageFilename} successfully`);
                    } catch (error) {
                      console.error(`Error deleting ${imageFilename}:`, error);
                    }
                  });
            
            let image=[]

            if(req.files) {//files have list of attibute so we itreate it for extract
                let k=0
              // logic to save url in db
              for (let i of req.files)
               {
                image[k]=i.filename
                k=k+1
              }
              console.log(image)

            body.Image = image
        }

  
    const update=await Product.update(body,{where:{id:id}})
    console.log(update)
    res.status(500).json({ message: "is updated"})
        }
        }
    }
   
}
   
catch(err){
console.log(err)
res.status(200).json({ message: "error"})
}
}


// search product

const Serach=async(req:any,res:any)=>
{
    let search
    let Where:any={}

    if(!req.query.productName&&!req.query.category)
    {
        res.status(200).json ({message:"fill the search bar"})
    }

else{

    if(req.query.productName)
    {
        Where.ProductName=req.query.productName
    }
    if(req.query.category)
    {
        console.log('hi')
        Where.Category=req.query.category
    }

    if(req.query.startingPrice&&req.query.endingPrice)
    {
    Where.Price={[Op.between]:[req.query.startingPrice,req.query.endingPrice]}
    }
    search=await Product.findAll({where:Where})
    if(search.length==0)
    {
        res.status(200).json({message:"Product not found"})
    }
    else
    {
        res.status(200).json(search)
    }
    
}
}

// product discount list

const discount=async(req:any,res:any)=>
{
   const viewDiscount=await Product.findAll({where:{discount:{[Op.not]:0}}})   
   res.status(200).json(viewDiscount)
}

















export default {addProduct,upload,ViewProduct,updateproduct,Serach,discount}


