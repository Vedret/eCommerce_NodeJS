const express=require('express');
let morgan=require('morgan');

let app = express();
//Middleware
app.use(morgan('dev'));

app.get('/name' , function(req,res){
    let age=10;
    res.json('My name is funk so bravo, godina '+age );
})

app.listen(3000 , (err)=>{
    if(err) throw err;
    console.log('Server is running on port 3000')
});
