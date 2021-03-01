const express = require('express');
const app=express();
const config=require('./config/database.js');
const mongoose=require('mongoose');
const cors = require('cors')
const User=require('./models/user');
const authRouter=require('./routes/auth');
const postRouter=require('./routes/posts');
const userRouter=require('./routes/users');

const connect=mongoose.connect(config.mongoUrl,{useUnifiedTopology: true,useNewUrlParser: true});
connect.then(()=>{
    console.log('connected to mongo');
})
.catch(err=>{
    console.log(err);
});

app.use(cors())
app.use(express.json());
app.use('/',authRouter);
app.use('/posts/',postRouter);
app.use('/profile/',userRouter);

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log("Server running at "+PORT);
});
