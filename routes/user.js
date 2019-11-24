const User = require('../models/user.js');
const router = require('express').Router();
const passport = require('passport');
const Cart =require('../models/cart.js');
const async =require('async');
const passportConf = require('../config/passport');

/* LOGIN ROUTE */
router.route('/login')

  .get((req, res, next) => {
    if (req.user) return res.redirect('/');
    res.render('accounts/login', { message: req.flash('loginMessage') });
  })

  .post(passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));




router.get('/profile', function (req, res, next) {

  User.findOne({ _id: req.user.id }, function (err, user) {
    if (err) return next(err);
    res.render('accounts/profile', { user: user })
  })

});


/* SIGNUP ROUTE */
router.route('/signup')
  .get(function (req, res, next) {
    res.render('accounts/signup', {
      errors: req.flash('errors')
    });
  })

  .post((req, res, next) => {
    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (existingUser) {
        req.flash('errors', 'Account with that email address already exists.');
        return res.redirect('/signup');
      } else {

        async.waterfall([
          function (callback) {
            var user = new User();
            user.profile.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.profile.picture = user.gravatar();
            user.save(function (err) {
              if (err) return next(err);
              req.logIn(user, function (err) {
                if (err) return next(err);
                callback(null, user);
              });
            });

          },
          function (user) {
            let cart = new Cart();
            cart.owner = user._id;
            cart.save(function (err) {
              if (err) return next(err);
              req.logIn(user, function (err) {
                if (err) return next(err);
                res.redirect('/profile')
              })
            })
          },
        ])
      }
    });
  });


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

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/')
});

router.get('/edit-profile', function (req, res, next) {
  res.render('accounts/edit-profile', { message: req.flash('success') });
});
router.post('/edit-profile', function (req, res, next) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) return next(err);

    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.address = req.body.address;
    user.save(function (err) {
      if (err) return next(err);
      req.flash('success', 'Successfully Edited your profile');
      return res.redirect('/edit-profile');
    });
  });
});

module.exports = router;
