let router=require('express').Router();
let async =require('async');
let faker=require('faker');
let Category =require('../models/category');
let Product=require('../models/product');
const algoliasearch=require('algoliasearch');

let client = algoliasearch('EUXHYU6U4I', 'dc139b675f3962efc57140dc643e3475');
let index = client.initIndex('ProductSchema');

router.post('/search', function(req,res,next){
    
    index.search({
        query:req.body.search_term
    }, function(err,results){
        if(err) return next(err);
        res.json(results);
    });
});

router
    .get('/:name',function(req,res,next){
        async.waterfall([
            function(callback){
                Category.findOne({name:req.params.name},function(err,category){
                    if(err)return next(err);
                    callback(null,category);
                });
            },
            function(category,callback){
                for(var i =0;i<30;i++){
                    let product=new Product();
                    product.category=category._id;
                    product.name=faker.commerce.productName();
                    product.price=faker.commerce.price();
                    product.image=faker.image.image();

                    product.save();
                }
            }
        ]);
        res.json({message:'Success'});
    });

    module.exports=router;