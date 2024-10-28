const express=require('express')
 const {register,login,getMe,logout,forgotpassword,updatePassword,resetPassword,updateDetails}=require('../controller/auth')
const {protect}=require('../middleware/auth')
const router=express.Router();


router.post('/register',register)
router.post('/login',login)
router.get('/getMe',protect,getMe)
router.post('/forgotpassword',forgotpassword)
router.put('/resetPassword/:resettoken',resetPassword)
router.put('/updateDetails',protect,updateDetails)
router.put('/updatePassword',protect,updatePassword)
router.get('/logout',logout)


module.exports=router;