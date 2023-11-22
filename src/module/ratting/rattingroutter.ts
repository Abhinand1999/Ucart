const express=require('express')
const router=express.Router()
import rating from "./ratingcontoll"
import user from '../user/userController'
router.post('/rating',user.verifyjwt,rating.addRating)
router.get('/viewarting',rating.viewrating)
router.get('/viewartingg',rating.viewratingg)

export default router