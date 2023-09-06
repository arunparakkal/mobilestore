const express = require("express")
const user_route = express()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const auth = require("../middleware/auth")

user_route.set("view engine","ejs")
user_route.set("views","./views/users")
const bodyparser = require("body-parser")
user_route.use(bodyparser.json())
user_route.use(bodyparser.urlencoded({extended:true}))

const session = require("express-session")
const confi = require("../confi/confi")
user_route.use(session({
    secret:confi.sessionSecrete,
    resave:true,
    saveUninitialized:false
}))

user_route.get("/",auth.isLogout,userController.loadLogin)
user_route.get("/login",auth.isLogout,userController.loadLogin)

user_route.post("/login",auth.isLogout,userController.veryLogin)

user_route.get("/logout",userController.logout)


user_route.get("/register",auth.isLogout,userController.LoadRegister)

user_route.get("/verify",userController.verfymail)

// user_route.get("/otp",userController.otpLoad)

user_route.post("/register",userController.insertUser)
user_route.get("/productdetail",productController.productDetail)
user_route.get('/products',productController.productPage)


user_route.get("/home",auth.isLogin,userController.LoadHome)
user_route.get('/otp',userController.otppage)

user_route.post("/verifyotp",userController.verifyotp)

module.exports = user_route