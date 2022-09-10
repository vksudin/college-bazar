const User=require('../models/User');
const Item=require('../models/Item');
const sendEmail=require('../utils/sendEmail');

// get user
exports.getDetails=async(req,res)=>{
    try {
        let user=await User.findOne({_id:req.user._id}).populate({path:'wishlist',populate:{
            path:"owner"
        }});
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

//create item
exports.createPost=async(req,res)=>{
    try {
        if(req.user.isBlocked===true) {
            res.status(400).json({message:"User is blocked!"});
        }
        else{
            const {title,photo,description,tags,sellingPrice}=req.body;
            const item=new Item({title,photo,description,sellingPrice,tags,owner:req.user._id});
            await item.save();
            res.status(201).json({message:"Item created!"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

// get all items
exports.getItems=async(req,res)=>{
    try {
        const items=await Item.find({sold:false,owner:{$ne:req.user._id},isApproved:true}).populate('owner').populate("tags");
        res.status(200).send(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

// get unapproved items
exports.getItemsNotApproved=async(req,res)=>{
    try {
        const items=await Item.find({isApproved:false}).populate('owner').populate("tags");
        res.status(200).send(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

//Get all items according to categories
exports.getFilteredItems = async (req, res) => {
    let {limit}=req.body,searchObj;
    let [lowerLt,upperLt]=limit.split('-').map((e)=>parseInt(e));
    if(lowerLt===10000){
        searchObj={
            $and:[
                {tags: { $in: req.body.categories }},
                {sellingPrice:{ $gte:10000}}
            ]
        }
    }
    else searchObj=
        {
            $and:[
                {tags: { $in: req.body.categories }},
                {sellingPrice:{ $gte:lowerLt}},
                {sellingPrice:{$lte:upperLt}}
            ]
        }
    try {
        const items = await Item.find(searchObj).sort({createdAt:-1}).populate("tags").populate("owner");
        res.status(200).send(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
}

// search
exports.getSearchResults=async(req, res) => {
    try{
    let searchObj = req.body.field;
    if(searchObj  !== undefined) {
        searchObj = {
            $or: [
                { title: { $regex: req.body.field, $options: "i" }},
                { description: { $regex: req.body.field, $options: "i" }}
            ]
        }
    }
    const searchedData =  await Item.find(searchObj).populate("tags").populate("owner");
    res.status(200).send(searchedData);
  }
  catch(error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
    }
  };

  // get individual item
  exports.getAPost=async(req,res)=>{
    try {
        const {id}=req.params;
        const item=await Item.findOne({_id:id}).populate("owner");
        res.status(200).send(item);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // Add item to wishlist
  exports.addToWishlist=async(req,res)=>{
    try {
        const {itemId}=req.body;
        let user=await User.findOne({_id:req.user._id,wishlist:itemId});
        if(!user){
            await User.findOneAndUpdate({_id:req.user._id},{
                $addToSet:{wishlist:itemId}
            });
        }
        else{
            await User.findOneAndUpdate({_id:req.user._id},{
                $pull:{wishlist:itemId}
            });
        }
        res.status(200).json({message:"Item added or removed to wishlist!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // Remove item from wishlist
  exports.removeFromWishlist=async(req,res)=>{
    try {
        const {itemId}=req.body;
        await User.findOneAndUpdate({_id:req.user._id},{
            $pull:{wishlist:itemId}
        });
        res.status(200).json({message:"Item removed from wishlist!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // Inform user
  exports.informUser=async(req,res)=>{
    try {
        const {roomId,userId,otherId}=req.body;
        console.log(req.body);
        const user=await User.findOne({_id:otherId});
        sendEmail({
            user:user.email,
            subject:"New chat",
            html:`<h1>New chat is waiting for you!!!</h1><br><h4>Hi, ${user.username}. Click on the following button to join chat.</h4><br><a href="http://localhost:3000/chat/${roomId}/${otherId}/${userId}" target="_blank"><button style="color: white;background: purple;cursor: pointer;">Click here to join chat</button></a>`
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
  }

  // buy item
  exports.buyItem=async(req,res)=>{
    try {
        const {itemId}=req.params;
        await User.update({wishlist:itemId},{
            $pull:{wishlist:itemId}
        });
        await Item.findOneAndDelete({_id:itemId});
        res.status(200).json({message:"Item deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
  }



exports.approveItem=async(req,res)=>{
    try{
    const {itemId}=req.params;
    const item = await Item.findOne({_id:itemId}).populate("owner");
    if(item.isApproved==true){
        res.status(400).json({message:"Item already approved"});
    }
    else{
        await Item.findOneAndUpdate({_id:itemId},{isApproved:true},{ new: true});
         res.status(200).json({message:"Item approved!"});
         sendEmail({
            user:item.owner.email,
            subject:"Post approved",
            html:`<h1>Post approved!!!</h1><br><h4>Hi ${item.owner.username}, your post has been approved by our admin. Kindly go and check the status.`
        })
    }
}catch (error) {
     res.status(500).json({ error: "Something went wrong!" });
}
  }

exports.deleteItem=async(req,res)=>{
    try{
    const {itemId}=req.params;
    const item = await Item.findOne({_id:itemId});
    if(!item){
        res.status(400).json({message:"Item does not exist"});
    }
    else{
        await Item.findOneAndDelete({_id:itemId});
         res.status(200).json({message:"Item Deleted!"});
    }
}catch (error) {
     res.status(500).json({ error: "Something went wrong!" });
}
  }

exports.blockUser=async(req,res)=>{
    try{
    const {userId}=req.params;
    const user = await User.findOne({_id:userId});
    if(!user){
        res.status(400).json({message:"User not found"});
    }
    else if(user.isBlocked==true){
         await User.findOneAndUpdate({_id:userId},{isBlocked:false},{ new: true});
         res.status(200).json({message:"User unblocked!"});
    }else{
         await User.findOneAndUpdate({_id:userId},{isBlocked:true},{ new: true});
         res.status(200).json({message:"User blocked!"});
    }
}catch (error) {
     res.status(500).json({ error: "Something went wrong!" });
}
  }


exports.getAllUser=async(req,res)=>{
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }catch (error) {
     res.status(500).json({ error: "Something went wrong!" });
}
} 

exports.getAnUser=async(req,res)=>{
    try {
        const user=await User.findOne({_id:req.params.userId});
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
}