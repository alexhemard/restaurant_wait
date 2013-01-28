
var mongoose = exports.mongoose = require('mongoose')
, Schema = mongoose.Schema
, WaitSchema = require('./wait')
, WaitTime = mongoose.model('WaitTime', WaitSchema)
, ObjectId = Schema.ObjectId
, _ = require('underscore')
;

exports = module.exports = new Schema({
  tourismBoard: { type: Schema.Types.Mixed, default: {} },
  name: {type: String, index: '1'},
  slug: {type: String, index: '1'},
  vendorWaitTime: {type: Schema.ObjectId, ref: 'WaitTime'},
  location: {type: [Number], index: '2d'},
  waitTimes: {type: [WaitSchema], default: []},
  twilio: { type: Schema.Types.Mixed, default: {} }
});

exports.static('findNear',function(location) {
  return this.find({location: { $near: location}});
});

exports.static('findByName',function(name) {
  return this.find({name: { $regex: name, $options: 'i'}});
});

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

exports.method('declareVendorWaitTime', function(option, sessionId) {
  var waitTime = new WaitTime({sessionId: sessionId, option: option});
  waitTime.save(function(err, restaurant) {
    if(!err) {
      this.vendorWaitTime = waitTime.id;
    
      this.save(function(err, restaurant) {
        // :/
      });
    }
  });


});

