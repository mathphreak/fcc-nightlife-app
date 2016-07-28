'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
  github: {
    displayName: String,
    username: String
  },
  going: {type: [String], default: []}
});

module.exports = mongoose.model('User', User);
