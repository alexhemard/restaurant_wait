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
    r.declareWaitTime(data.avail, 'twilio');
    r.save(); // We don't need to wait for the save to succeed
    io.sockets.emit('restaurant', r);
    res.send(200);
  });
};
