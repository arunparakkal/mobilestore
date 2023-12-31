const User = require("../models/userModel")
const randomString = require("randomstring")
const Product = require("../models/productModel") 
const Category =require('../models/categoryModel')

// const { use, emit } = require("../routes/userRoute")
const otpData={

}

//verify Mail
const nodemailer = require("nodemailer")
const sendVerifyMail = async(name,email,otp)=>{
    try{
    const transporter= nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:"arunaru0034@gmail.com",
            pass:"mlfxkmzrmyauvbml"
        }
   
    })
     
    const mailOption = {
        from:"arunaru0034@gmail.com",
        to:email,
        subject:"For verification mail",
        html:'<p>Hyy '+name+" "+"this is your verify opt " +"  "+  otp+' "</p>'
        
    }
    transporter.sendMail(mailOption,function(error,info){
        if(error){
            // console.log(error)
        }else{
            console.log("Email has been send:-",info.response)
            
        }
    })
   
    }
   
    catch(error){
    
         console.log(error.message)
    }
     }

     
     //verfymail part-2
     const verfymail = async (req, res,next) => {
        try {

            console.log(req.query.id); // Debugging line
            
            const updateInfo = await User.updateOne({_id: req.query.id}, {$set: {is_verified: 1}});
             res.render("login");
       
          
        } catch (error) {
            
            console.log(error.message);
        }
    }

    //otp login 
  
    const  otp = randomString.generate({length:5,charset:"numeric"})
    console.log(otp)
    otpData.OTP=otp

   
    
const bcrypt = require("bcrypt")
const Mail = require("nodemailer/lib/mailer")
const { render } = require("../routes/userRoute")
const { body } = require("express-validator")
const bcryptPassword = async(password)=>{
    try{
const Hashpassword = await bcrypt.hash(password,10)
return Hashpassword
    }
    catch(error){
        console.log(error.message)
    }
}

const LoadRegister = async (req,res)=>{

    try{
 res.render("registeration")
    }
    catch(error){
        console.log(error.message)
    }
}

const insertUser = async(req,res,next)=>{
try{
    const Spassword = await bcryptPassword(req.body.password)
    
   
const user = new User({
    name:req.body.name,
    email:req.body.email,
    mobile:req.body.mno,
    password:Spassword,
    is_admin:0
        
})


const userData = await user.save()

if(userData){

    const  otp = randomString.generate({length:5,charset:"numeric"})
    console.log(otp)
    otpData.OTP=otp
                                                                                                                            
    sendVerifyMail(req.body.name,req.body.email,otp)
    
    res.redirect(`/otp?id=${userData._id}`);
   
}else{
    res.render("registeration",{message:"Your registeration Failed"})
}
}catch(error){
    console.log(error.message)
}
}

const loadLogin = async(req,res)=>{
    try{
res.render("login")
    }
    catch(error){
console.log(error.message)
    }
}
const veryLogin = async(req,res)=>{
    try{
        
        const email = req.body.username
        console.log(email);
        const password = req.body.password

        const userData = await User.findOne({email: email})
       

        if(userData){

        const passwordMatch = await bcrypt.compare(password,userData.password)
        if(passwordMatch){
            
        if(userData.is_verified=== 0){
            res.render("login",{ message: "User not verified, please verify the user" })
           
        }else{
            console.log("arun")
            req.session.user_id = userData
            const products = await Product.find()
             res.render("home",{products})
        }

        }else{
            res.render("login",{message:" password is incorrect"})
        }
        }else{
            res.render("login",{message:"Email  is incorrect"})
        }
    }
    catch(error){
        console.log(error.message)
    }
}

const LoadHome = async(req,res)=>{
    try{
  const products = await Product.find()
    res.render("home",{products})
    }
    catch(error){
    console.log(error.message)
    }
}
const LoadHomeee = async(req,res)=>{
    try{

    res.render("otppage")
    }
    catch(error){
    console.log(error.message)
    }
} 
const otppage = async(req,res)=>{
    try{
    res.render("otp",{userId:req.query.id})
    }
    catch(error){
    console.log(error.message)
    }
}
const verifyotp = async(req,res)=>{
    try{
 console.log(req.query.id);
const enterOtp = req.body.enterOtp
console.log(enterOtp);



if(enterOtp === otpData.OTP){
    delete otpData.OTP
    res.json({success:true,userId:req.query.id})
  
   
}else{
    res.json({success:false})
}
    }
    catch(error){
        console.log(error.message)
        res.json({success:false})
    }
}
const logout = async(req,res)=>{
    try{

 res.render("login")
    }
    catch(error){
        
        console.log(error.message)
    }
}




module.exports = {LoadRegister,insertUser,loadLogin,verfymail,LoadHome,veryLogin,LoadHomeee,otppage,verifyotp,logout}