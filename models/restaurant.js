
var mongoose = exports.mongoose = require('mongoose')
, Schema = mongoose.Schema
, WaitSchema = require('./wait')
, ObjectId = Schema.ObjectId
, _ = require('underscore')
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
  waitTimes: {type: [WaitSchema], default: []}
});

// i have no idea yet if this works
exports.method('declareWaitTime', function(option, sessionId) {
  if(option < 1 || option > 4) return;

  this.waitTimes = _.filter(this.waitTimes, function(waitTime) { 
    return waitTime.sessionId != sessionId;
  });

  this.waitTimes.push({sessionId: sessionId, option: option});

  console.log(this.waitTimes);

  if(this.waitTimes.length > 5) this.waitTimes.shift();
  this.save(function(err, restaurant) {
  // BREAK STUFF
  });
});
