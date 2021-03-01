var mongoose =require('mongoose');
//var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    // username:{
    //     type:String,
    //     required:true
    // },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/sheft/image/upload/v1614467689/no-profile-picture-icon-15_jaruz1.png"
    },
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    resetToken:{
        type:String
    },
    expireToken:{
        type:String
    }
    // admin:{
    //     type:Number
    // },
    // cart:{
    //     type:Array
    // }
    
});

//UserSchema.plugin(passportLocalMongoose);

var User=mongoose.model('User',UserSchema);

module.exports=User;