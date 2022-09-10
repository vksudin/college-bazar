const User=require('../models/User');



// create user
exports.createUser=async(req,res)=>{
    try {
        let {username,isAdmin,email,phone,address,password,cpassword}=req.body;
        if(!username || !username.trim() || !email || !email.trim() || !phone || !phone.trim() || !address || !address.trim() || !password || !password.trim() || ! cpassword || !cpassword.trim()) res.status(400).json({error:"Don't leave any field empty!"});
        else{
            username=username.trim();
            email=email.trim();
            phone=phone.trim();
            address=address.trim();
            isAdmin=isAdmin||false;
            password=password.trim();
            cpassword=cpassword.trim();
            if(password!==cpassword) res.status(400).json({error:"Passwords didn't match!"});
            else{
                const user=new User({username,isAdmin,email,phone,address,password});
                await user.save();
                res.status(201).json({message:"User created!"});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

// Get all users
exports.getAllUsers=async(req,res)=>{
    try {
        const users=await User.find();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}

// login
exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) res.status(400).json({error:"Invalid credentials!"});
        else{
            let result=await user.comparePasswords(password);
            if(result===false) res.status(400).json({error:"Invalid credentials!"});
            else{
                let token=await user.generateToken();
                if(user.isAdmin==true)
                res.status(200).json({token:token,isAdmin:true});
                else
                res.status(200).json({token:token,isAdmin:false});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong!"});
    }
}
