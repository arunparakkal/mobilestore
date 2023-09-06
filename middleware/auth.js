const User = require("../models/userModel")
const session =  require("express-session")
const isLogin = async(req,res,next)=>{
    try{

        if(req.session.user_id ){
            const userData = await User.findOne({_id:req.session.user_id})
            if(userData.is_block){
               return res.render("login",{message:"Your blocked by admin pleasse contact admin"})
            }
            next()
        }else{
            res.render("/")

        }
    }
    catch(error){
        console.log(error.message)
    }
}
const isLogout = async(req,res,next)=>{
    try{
       
        if(req.session.user_id){
           
            res.render("home")  
            
        }else{
        next()
       

        }
    }
    catch(error){
        console.log(error.message)
    }
}
module.exports = {isLogin,isLogout}