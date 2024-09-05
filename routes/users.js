var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');

function checkLogin(req,res,next){
  if(req.session.user){
    next();
  }else{
    res.redirect('/login');
  }
}

function isLogin(req,res,next){
  if(req.session.user){
    res.redirect('/home');
  }else{
    next();
  }
}

/* GET users listing. */
router.get('/login', function(req, res, next) {
  if(req.session.user){
    res.redirect('/home');
  }else{
  res.render('./user/login'); 
  }
});

router.get('/signup', function(req, res, next) {
  if(req.session.user){
    res.redirect('/home');
  }else{
    res.render('./user/signup');
  }
  
});

router.post('/signup',isLogin, async (req,res) => {

  console.log(req.body);
  userController.userSignup(req.body).then((response) => {
    console.log(response);
    if(response.status){
      req.session.user = response.user;
      res.redirect('/home');
    }else{
      res.render('./user/signup',{message : response.message});
      
    }
  })
  
})

router.post('/login',isLogin, (req,res) => {
  userController.userLogin(req.body).then((data) => {
    console.log(data);
    if(data.status){
      req.session.user = data.user;
      res.redirect('/home');
    }else{
      res.render('./user/login',{message : data.message});
      
    }
  })
  
})

router.get('/home',checkLogin, function(req, res, next) {
  res.render('./home/home');
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/login');
});

router.get('/forgot', function(req, res, next) {
  res.render('./user/forgotPassword');
});

router.post('/forgot', function(req, res) {
  console.log(req.body);
  userController.forgotPassword(req.body).then((response) => {
    console.log(response)
    if(response.status){
      res.redirect('/verifyOTP');
    }else{
      
      res.render('./user/forgotPassword', {message : response.message });
    }
  })
});

router.get('/verifyOTP', function(req, res, next) {
  res.render('./user/verifyOTP');
});

router.post('/verifyOTP', function(req, res) {
  console.log(req.body);
  userController.verifyOTP(req.body).then((response) => {
    console.log(response)
    if(response.status){
      res.render('./user/confirmPassword',{email:response.email});
    }else{
      res.render('./user/verifyOTP', {message : response.message, status : response.status, verifyOTPError: response.verifyOTPError });
    }
  })
});

router.get('/resetPassword', function(req, res, next) {
  res.render('./user/confirmPassword');
});

router.post('/resetPassword', function(req, res) {
  console.log(req.body);
  userController.resetPassword(req.body).then((response) => {
    if(response.status){  
      res.redirect('/login');
    }else{
      res.render('./user/confirmPassword', {message : response.message});
    }
  })
});
   



module.exports = router;
