const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const request = require('request');

const index = require('./routes/index');
const generator = require('./routes/generator');
const login = require('./routes/login');
const logout = require('./functions/doLogout');
const register = require('./routes/register');
const account = require('./routes/account');
const routines = require('./routes/routines');
const doLogin = require('./functions/doLogin');
const doRegister = require('./functions/doRegister');

const generate = require('./functions/generate');

const changeAccount = require('./functions/changeAccount');
const editRoutine = require('./routes/viewRoutine');


const app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'thisIsASecret'}));

app.use(express.static(__dirname + '/public'));
app.use('/ofline', express.static('views/offline'));


app.use('/', index);
app.use('/generator',generator);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/doLogin', doLogin);
app.use('/doRegister', doRegister);
app.use('/generate', generate);
app.use('/account', account);
app.use('/changeAccount', changeAccount);
app.use('/routines', routines);
app.use('/editRoutine', editRoutine);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
