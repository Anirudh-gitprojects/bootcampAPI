const express=require('express')
const dotenv=require('dotenv')
const morgan=require('morgan')
const connectDB=require('./config/db')
const errorHandler=require('./middleware/error')
const colors=require('colors')
const mongoose=require('mongoose')
const path=require('path')
const fileupload=require('express-fileupload')
const users=require('./routes/users')
const cookieParser=require('cookie-parser')
//Route files
const bootcamp=require('./routes/bootcamps')
const courses=require('./routes/courses')
const auth=require('./routes/auth')
const reviews=require('./routes/reviews')
const xss_clean=require('xss-clean')
const mongoSanitize=require('express-mongo-sanitize')
const helmet=require('helmet')
const cors=require('cors')
const hpp=require('hpp')
const rateLimit=require('express-rate-limit')
//Load env vars
dotenv.config({path:'./config/config.env'});

const app=express();

app.use(express.static(path.join(__dirname,'public')))


app.use(express.json())

app.use(cookieParser())
//Connect to DB
connectDB();



if(process.env.NODE_ENV=="development"){

    app.use(morgan('dev'))
}

//File uploading

app.use(fileupload());


// Sanitize data
app.use(mongoSanitize());

// Set security headers with helmet
app.use(helmet())


// Prevent XSS attacks
app.use(xss_clean())

// CORS
app.use(cors())


const limiter=rateLimit({
    windowMs:10*60*1000,
    max:100
})

app.use(limiter);

// Prevent http param pollution
app.use(hpp())
//Mount routers
app.use('/api/v1/bootcamps',bootcamp)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use('/api/v1/reviews',reviews)

//Error Handler
app.use(errorHandler)

const PORT=process.env.PORT || 5000;

const server=app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})  


process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`.red)
    //Close server & exit process
    server.close(()=>process.exit(1))
})
