const express =require("express")
const router=express.Router()
import user from './userController'



//register

router.post('/Register',user.Register)
router.get('/login',user.login)
router.put('/edit',user.verifyjwt,user.edit)
router.get('/search',user.search)

export default router