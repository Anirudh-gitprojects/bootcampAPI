const fs=require('fs')
const mongoose=require('mongoose')
const colors=require('colors')
const dotenv=require('dotenv').config({path:'./config/config.env'})


const Bootcamp=require('./models/Bootcamp')
const Course=require('./models/Course')
const User=require('./models/User')
const Review=require('./models/Review')
const { dirname } = require('path')


// Connect to database
const conn=mongoose.connect(process.env.MONGO_URI)


// Read JSON files
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))

const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))

const reviews=JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'))
console.log(bootcamps)
// Import into db

const importData=async()=>{
    try{
        
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users) 
        await Review.create(reviews)
        console.log('Data Imported...'.green.inverse)
        process.exit();
    }
    catch(err){
        console.log(err.red)

    }
}

const deleteData=async()=>{
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Destroyed...'.red.invesre)
        process.exit();
    }
    catch(err){
        console.log(err.red)
    }
}

if(process.argv[2]=='-i'){
    importData();
}
else if(process.argv[2]=='-d'){
    deleteData();
}