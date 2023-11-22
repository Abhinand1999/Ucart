const express =require("express")
const router=express.Router()
import user from '../user/userController'
import orderitem from './orderItemController'

router.get('/history',user.verifyjwt,orderitem.history)
export default router