
var mongoose = exports.mongoose = require('mongoose')
  , Schema = mongoose.Schema
;

exports = module.exports = new Schema({
  name:  String,
  address: String,
  url:   String,
  phone: String,
  priceRange: Number,
  neighborhood: String,
  attire: String,
  openFor: String,
  cuisine: [String],
});


