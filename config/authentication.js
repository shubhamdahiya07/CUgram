const jwt=require('jsonwebtoken');
const {secret_key}=require('../config/database');
const mongoose=require('mongoose');
const User=require('../models/user');

module.exports=(req,res,next)=>{

    const {authorization} = req.headers
    if(!authorization)
    {
        res.redirect("https://ipugram.herokuapp.com/login");
        return res.status(401).json({err:"You must be logged in"});
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,secret_key,(err,payload)=>{
        if(err)
            return res.status(401).json({err:"You must be logged in"});
        const _id=payload._id;
        User.findById(_id).then(user=>{
            req.user=user;
            next();
        })
        .catch(err=>{
            console.log(err);
        });
       
    })
}