const express =require("express")
const router=express.Router()
import cart from './cartController'
import user from '../user/userController'
router.post('/addcart',user.verifyjwt,cart.addcart)
router.get('/view',user.verifyjwt,cart.cartView)
router.delete('/delete',user.verifyjwt,cart.deletecart)
router.put('/Edit',user.verifyjwt,cart.Edit)


export default router