const Category = require("../models/categoryModel")
const multer = require("multer")
const cropImage = require("../multer/catImageCrop")
const getCategory = async(req,res)=>{
    try{
        const categories = await Category.find()

        res.render('category',{categories})
    }
    catch(error){
        console.log(error.message)
    }
}
const   addCategory = async(req, res)=>{
  try{
      const {categoryname, description,} = req.body; 
    
        const images = req.file.filename;
        await cropImage.crop(req)

      const newCategory = new Category({ 
          categoryname:req.body.categoryname,
          description:req.body.description, 
          image: images
      });
      const savedCategory = await newCategory.save();
      res.redirect('category')
  }catch(error){
      console.log(error.message)
  }
}
module.exports = {getCategory,addCategory}