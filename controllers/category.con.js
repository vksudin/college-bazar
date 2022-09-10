const Category=require('../models/Category');
const slugify=require('slugify');

//Add category
exports.addCategory=async(req,res)=>{
    try {
        const {categories}=req.body;
        categories.forEach(async(e)=>{
            const slug=await slugify(e).toLowerCase();
            const category=new Category({categoryname:e,slug});
            await category.save();
        })
        res.status(201).json({message:"Categorie added!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

// get all categories
exports.getCategory=async(req,res)=>{
    try {
        let cats=await Category.find();
        res.status(200).send(cats);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}