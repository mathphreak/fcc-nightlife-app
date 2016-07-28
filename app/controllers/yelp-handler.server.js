/* eslint camelcase: "off" */

'use strict';

var Yelp = require('yelp');

var Users = require('../models/users.js');

function YelpHandler() {
  var yelp = new Yelp({
    consumer_key: process.env.YELP_CKEY,
    consumer_secret: process.env.YELP_CSECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKENSECRET
  });

  function countGuests(id) {
    return Users.count({going: id}).exec();
  }

  this.search = function (req, res) {
    yelp.search({term: 'bar', location: req.query.location})
      .then(data => {
        function handle(err, user) {
          if (err) {
            throw err;
          }
          var resultPromises = data.businesses.map(result => {
            return countGuests(result.id).then(count => {
              return {
                id: result.id,
                name: result.name,
                imageUrl: result.image_url,
                url: result.url,
                count: count,
                going: user && user.going.indexOf(result.id) > -1
              };
            });
          });
          Promise.all(resultPromises).then(results => res.json(results));
        }
        if (req.user) {
          Users.findById(req.user._id, handle);
        } else {
          handle();
        }
      })
      .catch(err => {
        throw err;
      });
  };

  this.toggle = function (req, res) {
    var isGoing = req.user.going.indexOf(req.params.id) > -1;
    var operator = isGoing ? '$pull' : '$push';
    var query = {};
    query[operator] = {going: req.params.id};
    Users
      .findOneAndUpdate(req.user._id, query)
      .exec(function (err) {
        if (err) {
          throw err;
        }

        res.sendStatus(200).end();
      });
  };
}

module.exports = YelpHandler;
