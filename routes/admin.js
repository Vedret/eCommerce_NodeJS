let router =require('express').Router();
let Category =require('../models/category');

router.route('/add-category')
    .get((req,res,next)=>{
        res.render('admin/add-category',{message: req.flash('success')})

    })
    .post((req,res,next)=>{
        let category =new Category();
        category.name=req.body.name;

        category.save(function(err){
            if(err)return next(err);
            req.flash('success','Successfully added a category');
            return res.redirect('/add-category');
        });
    })

    
module.exports=router