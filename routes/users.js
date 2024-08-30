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




module.exports = router;
