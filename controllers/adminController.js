const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const { set } = require("../routes/userRoute")

const loadLogin = async(req,res)=>{
    try{
res.render("login")
    }
    catch(error){
        console.log(error.message)
    }
}

const verifyLogin = async(req,res)=>{
   
    try{
        const email = req.body.email
        console.log(email);
        const password = req.body.password

        const user = await User.findOne({email: email})
        console.log(user)

        if(user){

        const passwordMatch = await bcrypt.compare(password,user.password)
        if(passwordMatch){
            
        if(user.is_admin === 0){
            res.redirect("/login",{ message: "User not verified, please verify the user" })
           
        }else{
            console.log("arun")
            req.session.user_id = user
            const userData = await User.find()
             res.render("index",{userData})
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

const getdashboard = async(req,res)=>{
    try{
       
        const userData = await User.find()
        res.render("index",{userData})
    }
    catch(error){
        console.log(error.message)
    }
}


const getUsers = async(req,res)=>{
    try{
       
        const userData = await User.find()
      
        res.render("users",{users:userData})
    }
    catch(error){
        console.log(error.message)
    }
}

const blockUser = async(req,res)=>{
    try{
       
       const userId = req.query.id
      const userUpdate = await User.updateOne({_id:userId},{$set:{is_block:true}})
     
    res.redirect("/admin/users",)
       
      
    }
    catch(error){
        console.log(error.message)
        
    }
}

const unblockuser = async(req,res)=>{
    try{
 const userId = req.query.id
 const updateUser = await User.updateOne({_id:userId},{$set:{is_block:false}})
res.redirect("/admin/users")


     }
    catch(error){
        console.log(error.message)
    }
}



module.exports = {loadLogin,verifyLogin, getUsers ,getdashboard,unblockuser,blockUser}