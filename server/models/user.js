const mongoose= require('mongoose')
const {ObjectId} =mongoose.Schema.Types
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    phone:{
        type:String,
        required:true
    },
    aboutus:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/prakhar123/image/upload/v1615976536/images_ql3vwb.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],



})

mongoose.model("User",userSchema)