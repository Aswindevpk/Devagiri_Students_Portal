var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var hbs  = require('express-handlebars');
var exphbs  = require('express-handlebars');
var dateformat = require('handlebars-dateformat');
var admin = require('./routes/admin');
var users = require('./routes/users');
var session = require("express-session")
var fileUpload = require("express-fileupload")

var app = express();

// view engine setup
var hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Register the helper for date formatting
hbs.handlebars.registerHelper('dateFormat', dateformat);


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// app.engine('hbs', hbs.engine({
//   extname: 'hbs',
//   defaultLayout: 'layout',
//   layoutsDir: __dirname + '/views/layout/',
//   partialsDir: __dirname + '/views/partials/'
// }))

// hbs.registerHelper('dateFormat', function(context, options) {
//   // Your logic to format the date goes here
//   // ...
//   formattedDate= 1;
//   return formattedDate;
// });



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const interval = 1000 * 60 *10;
app.use(session({
    secret: "devagiri college",
    saveUninitialized:true, 
    cookie: { maxAge: interval },
    resave: false 
}));
app.use(fileUpload())

app.use('/admin', admin);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
