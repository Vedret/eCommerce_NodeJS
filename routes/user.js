const User=require('../models/user.js');
const router = require('express').Router();

router.get('/signup',function(req,res,next){
    res.render('accounts/signup',{
        errors: req.flash('errors')
    });
});

router.post('/signup',(req,res)=>{

    let user = new User();
    user.profile.name=req.body.name;
    user.profile.password=req.body.password;
    user.profile.email=req.body.email;

    user.save().then(()=>{
        return res.redirect('/');
 
     }).catch((e)=>{
         req.flash('errors',"Name or email already exists");
         console.log(e)
         return res.redirect('/signup');
     })



    // User.findOne({email:req.body.email},function(existingUser){
    //     if(existingUser){
    //         console.log(req.body.email + ' is already exist');
    //         return res.redirect('/signup')
    //     }else{
    //         user.save().then((user)=>{
    //             res.redirect('/');
    //         }).catch((e)=>{


    //             return res.redirect('/signup').send(e);
    //             // return res.redirect('/signup')
    //             // res.status(400).send(e);

    //         })
    //     }
    // })
    });

module.exports=router;
