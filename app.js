require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var passport = require('passport');
var OidcStrategy = require('passport-openidconnect').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passportjs use session to store user info
app.use(session({
  secret: 'very-secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

// config different OIDC endpoints
passport.use('oidc', new OidcStrategy({
  issuer: 'https://app.simplelogin.io',
  authorizationURL: 'https://app.simplelogin.io/oauth2/authorize',
  tokenURL: 'https://app.simplelogin.io/oauth2/token',
  userInfoURL: 'https://app.simplelogin.io/oauth2/userinfo',
  clientID: process.env.CLIENT_ID, // OAuth config from env thanks to dotenv
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.URL + '/authorization-code/callback',
  scope: 'openid profile'
}, (issuer, sub, profile, accessToken, refreshToken, done) => {
  return done(null, profile);
}));

// redirect user to authorization page
app.use('/login', passport.authenticate('oidc'));

// user is redirected back with the *code*
app.use('/authorization-code/callback',
  passport.authenticate('oidc', {
    failureRedirect: '/error'
  }),
  (req, res) => {
    // redirect user to /profile so they can see their information
    res.redirect('/profile');
  }
);

// show user info
app.use('/profile', (req, res) => {
  console.log("user:", req);
  res.render('profile', {
    title: 'User Info',
    user: req.user._json
  });
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
