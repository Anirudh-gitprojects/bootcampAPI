const jwt=require('jsonwebtoken')
const asyncHandler=require('../middleware/asyncErrorHandler')
const ErrorResponse=require('../utils/errorResponse')
const User=require('../models/User')
const dotenv=require('dotenv').config('./config/config.env')

// Protect routes

exports.protect=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        // Set token with hearders
        token=req.headers.authorization.split(' ')[1]
    }

    //
    //else if(req.cookies.token){
    // Set token with cookies   
    //  token=req.cookies.token
   // }
    // Make sure token exists
    if(!token){
        console.log('no token')
        return next(new ErrorResponse(`Not authorized to access route`,401))
    }   
    try{
        // Verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=await User.findById(decoded.id)
        next();
    }
    catch(err){
        return next(new ErrorResponse(`Not authorized to access route`,401))
    }   
})


// Grant access to specific roles
exports.authorize=(...roles)=>{

    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User with role '${req.user.role}' not authorized to access this route`,401))
        }
        next();
    }
   
}