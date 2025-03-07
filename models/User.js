const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const { reset } = require('nodemon')
const crypto=require('crypto')
const dotenv=require('dotenv').config({path:'./config/config.env'})
const UserSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,`Please add a name!`]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,`Please add a valid email.`
        ]
    },
    role:{
        type:String,
        enum:[
            'user',
            'publisher'
        ],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please add a password!'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

UserSchema.pre('save',async function(next){
   if(!this.isModified('password')){
        next();
   }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})
UserSchema.methods.getSignedJwtToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    
    })
}

// Match password for login
UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.generateResetToken=function(){
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPassword token field
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire=Date.now() + 10 * 60 * 1000;
    return resetToken;
}

module.exports=mongoose.model('User',UserSchema)