
var mongoose = exports.mongoose = require('mongoose')
, Schema = mongoose.Schema
, WaitSchema = require('./wait')
, ObjectId = Schema.ObjectId
, _ = require('underscore')
;

exports = module.exports = new Schema({
  tourismBoard: { type: Schema.Types.Mixed, default: {} },
  location: {type: [Number], index: '2d'},
  waitTimes: {type: [WaitSchema], default: []}
});

exports.statics.findNear = function(location) {
  //console.log({location: { $near: location.reverse() }});
  return this.find({location: { $nearSphere: location.reverse() }});
}

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
