var express = require('express');
var router = express.Router();
var adminController = require('../controller/adminController');

function isAdminLoggedIn(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('./admin/login');
});

router.post('/login', (req, res) => {
  console.log(req.body);
   adminController.adminLogin(req.body).then((response) => {  
    console.log(response);
    if (response.status) {
      req.session.admin = response.admin;
      res.redirect('/admin/dashboard');
    } else {
      res.render('./admin/login', { message: response.message });
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.admin = null;
  res.redirect('/admin/login');
})

router.get('/dashboard',isAdminLoggedIn,async (req, res) => {
  let users = await adminController.getUserData();
  res.render('./admin/dashboard',{users:users});
})

router.get('/delete/:id',isAdminLoggedIn, (req, res) => {
  adminController.deleteUser(req.params.id).then((response) => {
    res.redirect('/admin/dashboard');
  })
})

router.get('/add',isAdminLoggedIn,(req, res) => {
  res.render('./admin/addUser');
})

router.post('/add',isAdminLoggedIn,(req, res) => {
  adminController.addUser(req.body).then((response) => {
    if(response.status){
      res.redirect('/admin/dashboard');
    }else{
      res.render('./admin/addUser',{message : response.message});
    }
  })
})

router.get('/edit/:id',isAdminLoggedIn, (req, res) => {
  adminController.getUserDataById(req.params.id).then((user) => {
    if(user){ 
      res.render('./admin/edit',{user:user,message : "user not found"});
    }else{
      res.redirect('/admin/dashboard');
    }
  })
})

router.post('/edit/:id',isAdminLoggedIn, (req, res) => {
  adminController.editUser(req.params.id,req.body).then((response) => {
    if(response.status){
      res.redirect('/admin/dashboard');
    }else{
      res.render('./admin/edit',{user:req.body,message : response.message});
    }
  })
})

module.exports = router;
