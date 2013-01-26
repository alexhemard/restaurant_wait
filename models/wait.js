
var mongoose = exports.mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

exports = module.exports = new Schema({
  sessionId: String,
  timestamp: {type: Date, default: Date.now},
  option: Number 
});

