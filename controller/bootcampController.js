const Bootcamp=require('../models/Bootcamp')
const ErrorResponse=require('../utils/errorResponse')
const asyncHandler=require('../middleware/asyncErrorHandler')
const dotenv=require('dotenv').config({path:'./config/config.env'})
const path=require('path')
const geocoder=require('../utils/geocoder')
// @desc  Get all bootcamps
// @route GET/api/v1/bootcamps
// acccess Public 
exports.getBootCamps=asyncHandler(async(req,res,next)=>{
    // Create req.query
        res.status(200).json(res.advancedResults);
    
})


// @desc  Get single bootcamp
// @route GET/api/v1/bootcamps/:id
// acccess Public 
exports.getBootCamp=asyncHandler(async(req,res,next)=>{
  
    const bootcamp=await Bootcamp.findById(req.params.id)
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))

    }
    res.status(200).json({success:true,data:bootcamp})
  
})


// @desc  Create new bootcamp
// @route POST/api/v1/bootcamps/
// acccess Private 
exports.createBootCamp=asyncHandler(async (req,res,next)=>{
    //Add user to req.body
        req.body.user=req.user.id
    // Check for published bootcamp
    const publishedBootcamp=await Bootcamp.findOne({user:req.user.id})
    console.log(req.user.role)
    // If the user is not in admin
    if(publishedBootcamp && req.user.role!=="admin"){
        return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`,400))
    }
       const bootcamp= await Bootcamp.create(req.body)
       res.status(201).json({
        success:true,
        data:bootcamp
       })
    
 
    
})

// @desc Update bootcamp
// @route PUT/api/v1/bootcamps/:id
// acccess Private
exports.updateBootCamp=asyncHandler(async(req,res,next)=>{

    let bootcamp=await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }

    // Make sure user is bootcamp owne
    if (bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp.`,401))
    }
     bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

    res.status(200).json({success:true,data:bootcamp})

 

})

// @desc  DELETE bootcampt
// @route DELETE/api/v1/bootcamps/:id
// acccess Private
exports.deleteBootCamp=asyncHandler(async(req,res,next)=>{
    
  
        let bootcamp=await Bootcamp.findById(req.params.id)
        
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))

        }
        
        // Make sure owner is bootcamp owner
        if(bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp.`,401))
        }
        
      
    
        await bootcamp.deleteOne();
        res.status(200).json({success:true,data:{}})
        
        
       
        
})

// @desc  DELETE bootcampt
// @route DELETE/api/v1/bootcamps/:id
// acccess Private
exports.getBootCampInRadius=asyncHandler(async(req,res,next)=>{
    
    const {zipcode,distance}=req.params;

    // Get lat/lng from geocoder
    const loc=await geocoder.geocode(zipcode)
    const lat=loc[0].latitude
    const lng=loc[0].longitude

    // Calc radius using radians
    const  radius=distance/3963
    const bootcamps=await Bootcamp.find({
        location: {$geoWithin: {$centerSphere:[[lng,lat],radius]}}  
      });

    res.status(200).json({success:true,
    count:bootcamps.length,
    bootcamps:bootcamps
})


})


// @desc  Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// acccess Private
exports.bootcampPhotoUpload=asyncHandler(async(req,res,next)=>{
    
  
    const bootcamp=await Bootcamp.findById(req.params.id)
    


    
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))

    }
    
    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`,404))
    }
    
    // Make sure user is bootcamp owne
    if (bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp.`,401))
    }
     bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

    const file=req.files.file

    //Make sure image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file`,404))
    }
    
    // Check file size
    if(file.size>process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image file of size less that ${process.env.MAX_FILE_UPLOAD}`,404))

    }

    // Create a custom file name
    file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async(err)=>{
        if(err){
            console.log(err)
            return next(new ErrorResponse(`Error uploading file`,500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id,{
            photo:file.name

        })

        res.status(200).json({
            success:true,
            data:file.name
        })
    })
})
