'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var routes = require('./app/routes/index.js');

var app = express();
if (app.get('env') === 'development') {
  require('dotenv').load();
}
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGODB_URI);

app.use(require('cookie-parser')());

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
  secret: 'secretClementine',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Node.js listening on port ' + port + '...');
});
