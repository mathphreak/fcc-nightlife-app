'use strict';

var path = process.cwd();
var YelpHandler = require(path + '/app/controllers/yelp-handler.server.js');

module.exports = function (app, passport) {
  function forceAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(403).end();
  }

  var yelpHandler = new YelpHandler();

  app.route('/')
    .get(function (req, res) {
      res.sendFile(path + '/public/index.html');
    });

  app.route('/search')
    .get((req, res) => res.sendFile(path + '/public/serp.html'));

  app.route('/login')
    .get(function (req, res) {
      res.cookie('auth-dest', req.get('Referrer'));
      res.sendFile(path + '/public/login.html');
    });

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect(req.get('Referrer'));
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      failureRedirect: '/login'
    }), (req, res) => {
      var authDest = req.cookies['auth-dest'];
      res.clearCookie('auth-dest');
      res.redirect(authDest);
    });

  app.route('/api/search')
    .get(yelpHandler.search);

  app.route('/api/me')
    .get(function (req, res) {
      if (req.user) {
        res.json(req.user.github);
      } else {
        res.json(false);
      }
    });

  app.route('/api/toggle/:id')
    .post(forceAuth, yelpHandler.toggle);
};
