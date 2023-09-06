const express = require("express")
const admin_route = express()

const confi = require("../confi/confi")
const session = require("express-session")
admin_route.use(session({
    secret:confi.sessionSecrete,
    saveUninitialized: false, // Add this line
    resave: false 
}))

const bodyparser = require("body-parser")
admin_route.use(bodyparser.json())
admin_route.use(bodyparser.urlencoded({extended:true}))

admin_route.set("view engine","ejs")
admin_route.set("views","./views/admin")

const adminController = require("../controllers/adminController")
const categoryController = require("../controllers/categoryController")
const categoryUpload = require("../multer/category")
const productUpload = require("../multer/product")
const productController = require("../controllers/productController")


admin_route.get("/login",adminController.loadLogin)
admin_route.post("/login",adminController.verifyLogin)
admin_route.get('/dashboard',adminController.getdashboard)
admin_route.get('/users',adminController.getUsers)

admin_route.get("/block",adminController.blockUser)
admin_route.get("/unblock",adminController.unblockuser)
admin_route.get("/category",categoryController.getCategory)
admin_route.post('/addcategory', categoryUpload.single('file'), categoryController.addCategory);

 admin_route.get("/addproduct",productController.addProduct)
 admin_route.post("/addproduct",productUpload.array("file"),productController.addProductPost)
 admin_route.get("/product",productController.product)
 admin_route.get('/unlistproduct/:productId', productController.unListProduct);
 admin_route.get('/listproduct/:productId', productController.listProduct);
 admin_route.get('/edit-product/:productId',productController.editProductPage);
admin_route.post('/edit-product',productController.editProduct);
 



module.exports = admin_route




