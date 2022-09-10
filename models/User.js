const mongoose=require('mongoose');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
      type:String,
      required:true
    },
    address:{
      type:String,
      required:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    wishlist:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'item'
      }
    ]
},{timestamps:true});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
  });
  
  userSchema.methods.generateToken = async function () {
    try {
      const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRES,
      });
      return token;
    } catch (error) {
      throw new Error('Token is not generated!');
    }
  };
  
  userSchema.methods.comparePasswords = async function (password) {
    try {
      return await bcryptjs.compare(password, this.password);
    } catch (error) {
      return false;
    }
  };
  
  const User = new mongoose.model('user', userSchema);
  
  module.exports = User;