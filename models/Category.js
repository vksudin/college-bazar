const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    categoryname:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    }
})

const Category=new mongoose.model("category",categorySchema);

module.exports=Category;