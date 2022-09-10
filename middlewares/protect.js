const User=require('../models/User');
const jwt=require('jsonwebtoken');

//User's Middleware
exports.protect=async(req,res,next)=>{
    try {
        let token;
        if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token){
            throw new Error("User unauthorized!");
        }
        console.log("hi1");
        const verifiedToken=await jwt.verify(token,process.env.SECRET_KEY);
        console.log("hi2");
        const user= await User.findOne({_id:verifiedToken._id});
        console.log("hi3");

        if(!user){
            throw new Error("User unauthorized!");
        }
        req.user=user;
        console.log("hi4");
        next();
    } catch (error) {
        console.log(error);
        next(new Error("Something went wrong!"));
    }
}