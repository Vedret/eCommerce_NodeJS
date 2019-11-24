const router = require('express').Router();
const Product = require('../models/product');
const algoliasearch=require('algoliasearch');
const config=require('../config/config');
const Cart=require('../models/cart');

function paginate(req,res,next){
    let perPage=9;
     let page=req.params.page;

     Product
        .find()
        .skip (perPage * page)
        .limit(perPage)
        .populate('category')
        .exec(function(err,products){
            if (err) return next(err);
            Product.count().exec(function (err,count){
                if (err) return next(err);
                res.render('main/product-main',{
                    products:products,
                    pages:count/perPage
                });
            });
        });
    
}

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

router.post('/product/:product_id', function(req, res, next) {
    Cart.findOne({ owner: req.user._id }, function(err, cart) {
      cart.items.push({
        item: req.body.product_id,
        price: parseFloat(req.body.priceValue),
        quantity: parseInt(req.body.quantity)
      });

      
      cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
  
      cart.save(function(err) {
        if (err) return next(err);
        return res.redirect('/cart');
      });
    });
  });

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
     paginate(req,res,next);
    }else{
    res.render('main/home');
    }
});

router.get('/page/:page',function(req,res,next){
    paginate(req,res,next);
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

router.get('/cart', function(req,res,next){
    Cart
    .findOne({owner:req.user._id})
    .populate('items.item')
    .exec(function(err,foundCart){
        
        if(err) return next(err);
        res.render('main/cart',{
            
            foundCart:foundCart
        });
    });
});

module.exports=router;