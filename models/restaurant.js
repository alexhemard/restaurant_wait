
var mongoose = exports.mongoose = require('mongoose')
, Schema = mongoose.Schema
, WaitSchema = require('./wait')
, ObjectId = Schema.ObjectId
;

exports = module.exports = new Schema({
  name:  String,
  url:   String,
  address: String,
  location: {lat: Number, lon: Number},
  neighborhood: String,
  photoURL: String,
  attire: String,
  cuisine: [String],
  description: String,
  phone: String,
  priceRange: Number,
  waitTimes: [WaitSchema]
});

// i have no idea yet if this works
exports.method('declareWaitTime', function(sessionId, option) {
  if(option < 1 || option > 4) return;
  this.waitTimes.findOne({'sessionId': sessionId}).remove();
  this.waitTimes.push({ sessionId: sessionId, option: option });
  if(this.waitTimes.length > 5) waitTimes.shift();
  this.save(function(err, restaurant) {
    // BREAK STUFF
  });
});
