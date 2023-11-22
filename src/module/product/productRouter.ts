const express =require("express")
const router=express.Router()
import product from './productController'
import user from '../user/userController'
let upload=product.upload


//add product

router.post('/addProduct',upload,product.addProduct)
router.get('/view',user.verifyjwt,product.ViewProduct)
router.put('/update',product.upload,product.updateproduct)
router.get('/search',user.verifyjwt,product.Serach)
router.get('/viewDiscount',product.discount)

export default router