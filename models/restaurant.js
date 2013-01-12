
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
  waitTimes: [{ session: Schema.Types.ObjectId, option: Number }]
});

exports.method('declareWaitTime', function(session, option) {
  // TODO: implement
});
