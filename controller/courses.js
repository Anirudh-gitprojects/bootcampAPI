const Course=require('../models/Course')
const ErrorResponse=require('../utils/errorResponse')
const asyncHandler=require('../middleware/asyncErrorHandler')

const Bootcamp=require('../models/Bootcamp')

// @desc GET courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses=asyncHandler(async(req,res,next)=>{
   
    if(req.params.bootcampId){
      
        const courses=await Course.find({bootcamp:req.params.bootcampId})
        return res.status(200).json({
            success:true,
            data:courses,
            count:courses.length,
        })
    }
    else{
      res.status(200).json(res.advancedResults)
    }

    const courses=await query;
    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
})


// @desc GET a single course
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse=asyncHandler(async(req,res,next)=>{

    req.body.bootcamp=req.params.bootcampId;
   const bootcamp=await Bootcamp.findById(req.params.id).populate({
    path:'bootcamp',
    select:'name description'
   })
   if(!bootcamp){
    return next(new ErrorResponse(`No course with id of ${req.params.id}`),404)
   }


    res.status(200).json({
        success:true,
        data:course
    })
})


// @desc POST a single course
// @route POST /api/v1/bootcamps/:bootcampId/courses/
// @access Private
exports.addCourse=asyncHandler(async(req,res,next)=>{

    req.body.bootcamp=req.params.bootcampId;
        //Add user to req.body
    req.body.user=req.user.id
    // Check for published bootcamp
   const bootcamp=await Bootcamp.findById(req.params.bootcampId)
   
   if(!bootcamp){
    return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`),404)
   }
    // Make sure user is bootcamp owne
    if (bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to the bootcamp ${bootcamp._id}`,401))
    }   
   const course=await Course.create(req.body)

    res.status(200).json({
        success:true,
        data:course
    })
})


// @desc Update a single course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse=asyncHandler(async(req,res,next)=>{

    let course=await Course.findById(req.params.id)
   if(!course){
    return next(new ErrorResponse(`No course with id of ${req.params.bootcampId}`),404)
   }
    // Make sure user is course owner
    if (course.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update a course to the bootcamp.`,401))
    }  
   course=await Course.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    validators:true
   })
    res.status(200).json({
        success:true,
        data:course
    })
})



// @desc  DELETE a single course
// @route DEL /api/v1/courses/:id
// @access Private
exports.deleteCourse=asyncHandler(async(req,res,next)=>{

    const course=await Course.findById(req.params.id)
   if(!course){
    return next(new ErrorResponse(`No course with id of ${req.params.id}`),404)
   }
    // Make sure user is course owner
    if (course.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update a course to the bootcamp.`,401))
    }  
    await course.deleteOne()
    res.status(200).json({
        success:true,
        data:{}
    })
})





    