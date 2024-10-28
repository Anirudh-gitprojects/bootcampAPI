const express=require('express')
const router=express.Router();
const {bootcampPhotoUpload,getBootCamps,getBootCamp,createBootCamp,updateBootCamp,deleteBootCamp,getBootCampInRadius}=require('../controller/bootcampController')
const {protect,authorize}=require('../middleware/auth')
const courseRouter=require('./courses')
const reviewRouter=require('./reviews')
const Bootcamp=require('../models/Bootcamp')
const advancedResults=require('../middleware/advancedResults')

// Re-route into other resource router


router.use('/:bootcampId/courses',courseRouter);
router.use('/:bootcampId/reviews',reviewRouter)
router.route('/radius/:zipcode/:distance').get(getBootCampInRadius)

router.route('/').get(advancedResults(Bootcamp,'courses'),getBootCamps).post(protect,authorize('publisher','admin'),createBootCamp)

router.route('/:id')
.get(getBootCamp)
.put(protect,authorize('publisher','admin'),updateBootCamp)
.delete(protect,authorize('publisher','admin'),deleteBootCamp)
 
router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload)

module.exports=router;