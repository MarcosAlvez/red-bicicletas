require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');

const Usuario = require('./models/usuario');
const Token = require('./models/token');

var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');
var bicicletasRouter = require('./routes/bicicletas');
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');
var authAPIRouter = require('./routes/api/auth');

let store;
if (process.env.NODE_ENV === 'development'){
  store = new session.MemoryStore();
}else{
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });
  store.on('error', function (err){
    assert.ifError(err);
    assert.ok(false);
  });
}

var app = express();

app.set('secretKey', 'jwt_pwd_!!223344');

app.use(session({
  cookie: {maxAge: 240*60*60*1000},
  store: store,
  saveUninitialized: true,
  resave: true,
  secret: 'red_bicis!!!****!!!****'
}))

var mongoose = require('mongoose');
const assert = require("assert");
// var mongoDB = 'mongodb://localhost/red_bicicletas';

var mongoDB = process.env.MONGO_URI;

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/google3834f4919d625fcc', function (req, res){
  res.sendfile('public/google3834f4919d625fcc.html');
});

app.get('/privacy_policy', function (req, res){
  res.render('privacy_policy');
});

app.get('/terms_and_conditions', function (req, res){
  res.render('terms_conditions');
});

// Login statements
app.get('/login', function (req, res) {
  res.render('./session/login');
});

app.post('/login', function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if(err) return next(err);
    if(!user) return res.render('./session/login', {info});
    req.logIn(user, function(err) {
      if(err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/forgotPassword', function (req, res) {
  res.render('./session/forgotPassword');
});

app.post('/forgotPassword', function (req, res) {
  Usuario.findOne({email: req.body.email}, function(err, usuario){
    if(!usuario) return res.render('./session/forgotPassword', {message: 'No existe el email para un usuario existente.'});

    usuario.resetPassword(function(err) {
      if (err) return next(err);
      console.log('***next***');
    });
    res.render('./session/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', function(req, res, next) {
  Token.findOne({token: req.params.token}, function(err, token) {
    if(!token) return res.status(400).send({type: 'not-verified', msg: 'No existe un usuario asociado al token. Verifique que su token no haya expirado.'});

    Usuario.findById(token._userId, function (err, usuario){
      if(!usuario) return res.status(400).send({type: 'not-verified', msg: 'No existe un usuario asociado al token.'});
      res.render('./session/resetPassword', {errors: {}, usuario: usuario});
    });
  });
});

app.post('/resetPassword', function (req, res){
  if(req.body.password !== req.body.confirm_password) {
    res.render('./session/resetPassword', {errors: {confirm_password: {message: 'No coincide con el password ingresado'}},
      usuario: new Usuario({email: req.body.email})});
  }
  Usuario.findOne({email: req.body.email}, function (err, usuario) {
    usuario.password = req.body.password;
    usuario.save(function (err){
      if(err) {
        res.render('./session/resetPassword', {errors: err.errors, usuario: new Usuario({email: req.body.email})});
      }else{
        res.redirect('/login');
      }
    })
  })
});

app.get('/auth/google',
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/plus/v1/people/me' ] }
    )
);

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
      successRedirect: '/',
      failureRedirect: '/error'
    }));

app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/api/bicicletas', validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/api/auth', authAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

function loggedIn(req, res, next) {
  if(req.user) {
    next();
  }else{
    console.log('user sin loggearse');
    res.redirect('/login');
  }
}

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded){
    if(err){
      res.json({status:"error", message: err.message, data: null});
    }else{
      req.body.userId = decoded.id;

      console.log('jwt verify: ' + decoded);

      next();
    }
  });
}

module.exports = app;
