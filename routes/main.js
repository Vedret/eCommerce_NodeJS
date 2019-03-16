const router = require('express').Router();
const Product = require('../models/product');
const algoliasearch=require('algoliasearch');
const config=require('../config/config');

let client = algoliasearch('EUXHYU6U4I', 'dc139b675f3962efc57140dc643e3475');
let index = client.initIndex('ProductSchema');

// router.route('/search')
//     .get((req,res,next)=>{
//         if(req.query.q){
//             index.search({
//                 query_string:{query:req.query.q}
//             },function(err,results){
//                 console.log("ressss"+results);
//                 results:
//                 if(err)return next(err);
//                 let data=results.hits.hits.map(function(hit){
//                     return hit._source;
//                     console.log("dataaa11"+hit);
//                 });
//                 console.log("dataaa"+data);
//                 res.render('main/search-result',{query:req.query.q,data:data
//                 });
//             });
//         }
//     })
//     .post((req,res,next)=>{
//         res.redirect('/search?q='+req.body.q)
// });

router.route('/search')
    .get((req,res,next)=>{
        if(req.query.q){
            index.search(req.query.q,function(err,data){
                 console.log(data.hits);
                res.render('main/search-result',{data:data.hits,query:req.query.q})
            })
        }
    })
    .post((req,res,next)=>{
        res.redirect('/search?q='+req.body.q)
    })


router.get('/' , function(req,res,next){
    
    if(req.user){
     let perPage=9;
     let page=req.params.page;

     Product
        .find()
        .skip (perPage * page)
        .limit(perPage)
        .populate('category')
        .exec(function(err,produts){
            if (err) return next(err);
            Product.count().exec(function (err,count){
                if (err) return next(err);
                res.render('main/product-main',{
                    products:products,
                    pages:count/perPage
                });
            });
        });
    }else{
    res.render('main/home');
    }
})

router.get('/about' , function(req,res){
    
    res.render('main/about');
})

router.get('/products/:id',function(req,res,next){
    Product
        .find({category:req.params.id})
        .populate('category')
        .exec(function(err,products){
            if(err)return next(err);
            res.render('main/category',{
                products: products
            });
        });
});

router.get('/product/:id',function(req,res,next){
    Product.findById({_id:req.params.id},function(err,product){
        if(err) return next(err);
        res.render('main/product',{
            product:product
        });
    });
});

module.exports=router;