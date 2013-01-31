
var mongoose = exports.mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , ONE_HOUR = 60 * 60 * 1000

exports = module.exports = new Schema({
  sessionId: String,
  timestamp: {type: Date, default: Date.now},
  option: Number 
});

exports.method('toJSON', function() {
  var currentDate = new Date
  , obj = this.toObject();
  delete obj.sessionId;

  if((currentDate - this._id.getTimestamp()) < ONE_HOUR) {
    return obj;
  }
  else {
    return null;
  }

});

