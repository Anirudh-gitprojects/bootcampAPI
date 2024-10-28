const express=require('express')
const Course=require('../models/Course')
const {protect,authorize}=require('../middleware/auth')

const advancedResults=require('../middleware/advancedResults')
const {getUser,getUsers,updateUser,deleteUser,createUser}=require('../controller/users')
const router=express.Router({mergeParams:true});
const User=require('../models/User')
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User),getUsers)
.post(createUser)

router.route('/:id')
.get(getUser)
.put(updateUser)
.delete(deleteUser)

module.exports=router;
