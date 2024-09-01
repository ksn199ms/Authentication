var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var db = require('./config/connection');
var session = require('express-session');
var nocache = require('nocache');
var dotenv = require('dotenv').config();


var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layouts/'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(session({
  secret: 'ksn199ms', // Replace with a secure key
  resave: false,             // Don't save session if unmodified
  saveUninitialized: true,   // Save uninitialized session (new but not modified)
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 // Set session cookie max age (e.g., 1 day)
  }
}));

app.use(nocache())
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRouter);
app.use('/', usersRouter);

db.connect((err)=>{
  if(err) console.log('Connection error'+err)
  else console.log('Database connected')
})

// mongoose.connect('mongodb://localhost:27017/social-network-api', {
//   useNewUrlParser: true
// })
// .then(() => console.log('MongoDB Connected'))
// .catch(err => console.log(err));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
