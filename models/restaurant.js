
var mongoose = exports.mongoose = require('mongoose')
  , Schema = mongoose.Schema
;

exports = module.exports = new Schema({
  name:  String,
  url:   String,
  address: String,
  location: {lat: Number, lon: Number},
  neighborhood: String,
  attire: String,
  cuisine: [String],
  description: String,
  phone: String,
  priceRange: Number,
  waitTimes: [{ option: Number }]
});

// i have no idea yet if this works
exports.method('declareWaitTime', function(option) {
  if(option < 1 || option > 4) return;

  this.waitTimes.push({ option: option });

  if(this.waitTimes.length > 5) waitTimes.shift();
});
