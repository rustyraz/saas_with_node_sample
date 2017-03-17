var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var compression = require('compression');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var connectMongo = require('connect-mongo');
var fs = require('fs');


//db settings
var db_settings = require('./config/db_settings');

//db connection
mongoose.connect(db_settings.dbUrl);

//require config files
var settings = require('./config/settings');

//load the routes
var routes = require('./routes/index');
var users = require('./routes/users');
var orders = require('./routes/orders');
var admin_user_routes = require('./routes/admin/user');
var admin_dashboard_routes = require('./routes/admin/dashboard');
var admin_products_routes = require('./routes/admin/products');
var admin_customers_routes = require('./routes/admin/customers');

var MongoStore = connectMongo(expressSession);

//passport auth
var passportConfig = require('./middlewares/auth/passport-config');
var restrict = require('./middlewares/auth/restrict');
passportConfig();

var app = express();

// compress responses
app.use(compression());

//middleware for tenancy
var auth_tenant = require('./middlewares/tenancy');
app.use(auth_tenant());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //for aprsing application/x-www-form-urlencoded
app.use(multer({
  dest: './public/uploads/',
  changeDest: function(dest, req, res) {
    dest += req.tenant.domain;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    return dest;  
  },
  onFileUploadComplete: function (file, req, res) {
    //console.log(file.fieldname + ' uploaded to  ' + file.path)
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(expressSession(
{
  secret: 'my hard to crack secret phrase',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}
));

//CORS Support to open up the access to make the api public
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//insert flash before passport
app.use(flash());
//authenticate before routing
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/user', users);
//app.use(restrict); //put all restricted routes under this middleware
app.use('/orders', orders);

//admin routes
app.use('/admin', admin_user_routes);
app.use(restrict); //put all restricted routes under this middleware
app.use('/admin/dashboard', admin_dashboard_routes);
app.use('/admin/products', admin_products_routes);
app.use('/admin/customers', admin_customers_routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
