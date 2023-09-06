const mongoose = require('mongoose')
require("dotenv").config()
mongoose.connect(process.env.MONGO_DB_URL).then(()=>{
    console.log("db connected")
}).catch((Error)=>{
    console.log(Error.message)
})
const express = require("express")
const app = express()
const multer = require("multer")
const path = require('path')
app.use('/public',express.static('public'));



const userRoute = require("./routes/userRoute")
app.use("/",userRoute)


const adminRoute = require("./routes/adminRoute")
app.use("/admin",adminRoute)


app.listen(2000,()=>{console.log("server start")})


