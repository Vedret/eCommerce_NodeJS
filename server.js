const express=require('express');
const mongoose = require('mongoose');
const morgan=require('morgan');
const config=require('./config/config.js');
const User=require('./models/user.js');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const ejsMate=require('ejs-mate');



let app = express();

//Mongodb Connection
mongoose.connect(config.database , (err)=>{
    if (err) console.log(err);
  console.log("Connected to the mlab database");
});

//Middleware
app.use(express.static(__dirname +'/public'))
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:true}));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');

app.post('/create-user',(req,res)=>{

    let user = new User();
    user.profile.name=req.body.name;
    user.profile.password=req.body.password;
    user.profile.email=req.body.email;

    user.save().then((user)=>{
        res.send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
    });




app.get('/' , function(req,res){
    
    res.render('main/home');
})

app.get('/about' , function(req,res){
    
    res.render('main/about');
})

app.listen(3000 , (err)=>{
    if(err) throw err;
    console.log('Server is running on port 3000')
});
