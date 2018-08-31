const express=require('express');
const mongoose = require('mongoose');
const morgan=require('morgan');
const config=require('./config/config.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

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
app.use(cookieParser());
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'wedret123'
}));
app.use(flash());

app.engine('ejs',ejsMate);
app.set('view engine','ejs');


let mainRoutes=require('./routes/main');
let userRoutes=require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);






app.listen(3000 , (err)=>{
    if(err) throw err;
    console.log('Server is running on port 3000')
});
