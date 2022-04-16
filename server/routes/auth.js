const express=require('express')
const router=express.Router()
const mongoose= require('mongoose')
const crypto = require('crypto')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const { JWT_SECRET }=require('../config/keys')
const requiredLogin =require('../middleware/requiredLogin')
const nodemailer =require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} =require('../config/keys')
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API 
    }
}))
router.get('/protected',requiredLogin,(req,res)=>{
    res.send("hello User")
})
// 
router.post('/signin',(req,res)=>{
    // res.send("Get")
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error : "Please add all the fields"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error : "Invalid Email"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"SuccessFull Sign In"})
                // token given to a user
                const token =jwt.sign({_id:savedUser._id},JWT_SECRET)
                // saved user will give list of id,name,email,followers,following
                const {_id,name,email,followers,following,pic,phone,aboutus}=savedUser
                res.json({token,user:{_id,name,email,followers,following,pic,phone,aboutus}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
        .catch(err=>{
            //error form devloper side
            console.log(err)
        })
            
        
    })
})

router.post('/signup',(req,res)=>{
    // res.send("Post")
    // console.log(req.body)
    const {name,email,password,phone,aboutus,pic}=req.body
    if (!email || !password || !name || !aboutus || !phone){
        return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"Already Exists Email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                phone,
                aboutus,
                pic:pic
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"prakhar211299@gmail.com",
                    subject:"signup success",
                    html:"<h2>Welcome to Madad</h2>"
                })
                res.json({message:"Saved Successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
            if(err){
                console.log(err)
            }
            const token = buffer.toString("hex")
            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    return res.status(422).json({error:"User does not exist with this Email"})
                }
                user.resetToken = token
                user.expireToken = Date.now()+3600000
                user.save().then((result)=>{
                    transporter.sendMail({
                        to:user.email,
                        from:"prakhar211299@gmail.com",
                        subject:"Password reset",
                        html:`
                        <p>You requested for password reset</p>
                        <h5>click on this <a href="${EMAIL}reset/${token}"> link </a> to reset the password</h5>
                        `
                    })
                    res.json({message:"check your email"})
                })
            })
    })
})
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user =>{
            if(!user){
                return res.status(422).json({error:"Try Again session expired"})
            }
            bcrypt.hash(newPassword,12).then(hashedpassword=>{
                user.password = hashedpassword;
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser)=>{
                    res.json({message:"Password Updated"})
                })
            })
    }).catch(err=>{
        console.log(err)
    })
})
module.exports = router