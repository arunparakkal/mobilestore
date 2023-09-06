const Product = require("../models/productModel")
const Category = require("../models/categoryModel")
const cropImage = require('../multer/proImageCrop')

const addProduct = async(req,res)=>{
try{
  const categories = await Category.find()
 res.render("addproduct",{categories})
}
catch(error){
    console.log(error.message);
}
}
const addProductPost = async(req,res)=>{
    try{     
        const images = req.files.map(file => file.filename);
        await cropImage.crop(req)
        const product= new Product({
            productname:req.body.productname,
            categoryname:req.body.categoryname,
            description:req.body.description,
            quantity:req.body.quantity,
            color:req.body.color,
            productprice:req.body.productprice,
            salesprice:req.body.salesprice,
            image:images,
          
        })
        
        const productData = await product.save()
        const products = await Product.find()
        res.render("productpage",{products})
    }
    catch(error){
        console.log(error.message)
    }
}
const product = async(req,res)=>{
    try{
        const products = await Product.find()
        res.render("productpage",{products})
    }
    catch(error){
console.log(error.message);
    }
}

const productDetail = async(req,res)=>{
    try{

        const products = await Product.find({_id: req.query.productid})
        res.render("productDetail",{products})
    }
    catch(error){
        console.log(error.message);
    }
}
const productPage = async(req, res)=>{
    try{
        const categoryname = req.query.categoryname 
        const search = req.query.search
        console.log(categoryname)
        let products;
        if (categoryname && categoryname !== 'all') {
            products = await Product.find({ categoryname: categoryname });
            
            console.log(products);
        } else {

            products = await Product.find({productname: {$regex:new RegExp(search)}});
           
        }
        
        const categories = await Category.find().lean();

        res.render('products',{categories, products, categoryname});
    }catch(error){
        console.log(error.message)
    }
}
const listProduct = async(req, res)=>{
    try{
        const productId = req.params.productId;
        const validProductId = new mongoose.Types.ObjectId(productId);
        await Product.findByIdAndUpdate(validProductId, {isListed: true});
        res.redirect(302,'/admin/products')
    }catch(error){
        console.log(error.message)
    }
}
const unListProduct = async(req, res)=>{
    try{
        const productId = req.params.productId;
        const validProductId = new mongoose.Types.ObjectId(productId);
        await Product.findByIdAndUpdate(validProductId, {isListed: false});
        res.redirect(302,'/admin/products')
    }catch(error){
        console.log(error.message)
    }
}
const editProductPage = async(req, res)=>{
    try{
        const productId = req.params.productId;
        const product = await Product.findById(productId).lean();
        const categories = await Category.find().lean()
        res.render('editProduct',{product ,categories})
    }catch(error){
        console.log(error.message)
    }
}
// edit product 
const editProduct = async (req, res) => {
    try {
       
        const productId = req.params.productId; 
        const validProductId = new mongoose.Types.ObjectId(productId);

        const updatedProductData = {
            productname: req.body.productname,
            categoryname: req.body.categoryname,
            description: req.body.description,
            quantity: req.body.quantity,
            color: req.body.color,
            productprice: req.body.productprice,
            salesprice: req.body.salesprice,
            
        };
        if (req.files && req.files.length > 0) {
            await cropImage.crop(req);
            const images = req.files.map(file => file.filename);
            updatedProductData.image = images;
        }
        
        const updateProduct = await Product.findByIdAndUpdate(validProductId, updatedProductData);

        if (!updateProduct) {
            console.log('Product not found or not updated.');
            console.log('Invalid product ID:', validProductId);
            return res.status(404).send('Product not found or not updated.');
        } else {
            console.log('Product updated:', updateProduct);
            const products = await Product.find();
            console.log('Product updated successfully');
            const categories = await Category.find().lean()
            res.render('productPage', { products, categories});
        
        }
    } catch (error) {
        console.log(error.message);
    }
};
module.exports = {
addProduct,
addProductPost,
product,
productDetail,
productPage,
unListProduct,
listProduct,
editProduct,
editProductPage

}