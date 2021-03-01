const mongoose=require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    body:{
        type:String,
        require:true
    },
    image:{
        type:String,
        default:"No Photo"
    },
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
    }],
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

var Post=mongoose.model('Post',PostSchema);

module.exports=Post;