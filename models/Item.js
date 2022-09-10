const mongoose=require('mongoose');

const itemSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    sellingPrice:{
        type:Number,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    tags:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'category'
        }
    ],
    isApproved:{
        type:Boolean,
        default:false
    },
    sold:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const Item=new mongoose.model("item",itemSchema);

module.exports=Item;