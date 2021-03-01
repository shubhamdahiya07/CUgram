const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Post=require('../models/post');
const isLoggedIn=require('../config/authentication');

router.get('/explore',(req,res)=>{
    Post.find({}).populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt").then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
});

router.get('/home',isLoggedIn,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt").then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
});

router.post('/createpost',isLoggedIn,(req,res)=>{
    const {title,body,url}=req.body;
    console.log(title,body,url);
    if(!title||!body||!url)
    {    console.log("lll");

        return res.status(422).json("Add title and body");
    }
    req.user.password=undefined;
    const post=new Post({
        title,body,image:url,postedBy:req.user
    });
    post.save().then(result=>{
        res.json({post:result});
        console.log("KKK");
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/myPosts',isLoggedIn,(req,res)=>{
    Post.find({postedBy:req.user._id}).populate("postedBy","_id,name").then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
})

router.put('/like',isLoggedIn,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).populate("comments.postedBy","_id name").exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike',isLoggedIn,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',isLoggedIn,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',isLoggedIn,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .then((post)=>{
        if(!post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() == req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports=router;