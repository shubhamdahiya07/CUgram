const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {secret_key}=require('../config/database');
const nodemailer=require('nodemailer');
const crypto = require('crypto')
const {SENDGRID_API,EMAIL}=require('../config/database')

const nodemailerSendgrid = require('nodemailer-sendgrid');
const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: SENDGRID_API
    })
);
router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body;
    if(!name||!email||!password)
    {
        return res.status(422).json({error:"empty entry"});
    }
    
    User.findOne({email:email}).then(user=>{
        if(user)
            res.status(422).json({err:"User already exists"});
        else
        {
            bcrypt.hash(password,12)
            .then(hashed=>{
                const newUser=new User({
                    email,name,password:hashed,pic
                })
                newUser.save().then(user=>{
                    transporter.sendMail({
                        to:user.email,
                        from:"himanshudahiya215@gmail.com",
                        subject:"Signup success",
                        html:"<h1>Welcome to IPUgram</h1>"
                    });
                    res.json({message:"User registered"});
                })
                .catch(err=>{
                    console.log(err);
                })
            });
        }
    })
    .catch(err=>{
        console.log(err);
    })
});

router.post('/login',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        res.status(422).json({err:"empty entry"});
        return;
    }
    User.findOne({email}).then(user=>{
        if(!user)
        {
            return res.status(422).json({err:"Invalid email or password"});
        }
        bcrypt.compare(password,user.password).then(matched=>{
            if(matched)
            {
                const token=jwt.sign({_id:user._id},secret_key);
                const {_id,name,email,followers,following,pic}=user;
                res.json({token,user:{_id,name,email,followers,following,pic}});
                //return res.json({message:"Signed In"});
            }
            else
                return res.status(422).json({err:"Invalid email or password"});
        })
        .catch(err=>{
            console.log(err);
        })
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
                return res.status(422).json({error:"User with this email does not exist"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"himanshudahiya215@gmail.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click on this <a href="${EMAIL}/reset-password/${token}">link</a> to reset your password</h5>
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
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"Password updated successfully"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router;