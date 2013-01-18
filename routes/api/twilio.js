var models = require('../../models')
  , Restaurant = models.Restaurant
;

exports.acceptData = function(req, res, next) {
  var data = req.body.twilio;
  Restaurant.findById(data.id, function(err, r) {
    if(err) {
      console.log(err);
      return res.send(404);
    }
    console.log('|' + data.id + '|');
    r.declareWaitTime(data.avail, 'twilio');
    r.save(); // We don't need to wait for the save to succeed
    io.sockets.emit('update', { restaurantId: r.id, waitTimes: r.waitTimes });
    res.send(200);
  });
};
