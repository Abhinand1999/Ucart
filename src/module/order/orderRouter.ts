const express =require("express")
const router=express.Router()
import order from './orderController'
import user from '../user/userController'
router.post('/addorder',user.verifyjwt,order.addorder)
router.get('/orderView',user.verifyjwt,order.orderView)
router.get('/sample',user.verifyjwt,order.sample)
router.delete('/cancel',user.verifyjwt,order.cancelorder)
router.get('/history',user.verifyjwt,order.history)
router.put('/update',user.verifyjwt,order.edit)
router.get('/mostsell',order.Mostsell)

export default router