const router = require('express').Router();
const Product = require('../models/product');


router.route('/search')
    .get((req,res,next)=>{
        if(req.query.q){
            Product.search({
                query_string:{query:req.query.q}
            },function(err,results){
                console.log("ressss"+results);
                results:
                if(err)return next(err);
                let data=results.hits.hits.map(function(hit){
                    return hit._source;
                    console.log("dataaa11"+hit);
                });
                console.log("dataaa"+data);
                res.render('main/search-result',{query:req.query.q,data:data
                });
            });
        }
    })
    .post((req,res,next)=>{
        res.redirect('/search?q='+req.body.q)
});


router.get('/' , function(req,res){
    
    res.render('main/home');
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