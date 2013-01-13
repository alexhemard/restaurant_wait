var models = require('../../models')
  , Restaurant = models.Restaurant
;

exports.acceptData = function(req, res, next) {
  var data = req.body.twilio;
  Restaurant.findById(data.id, function(err, restaurant) {
    if(err) res.send(404);
    restaurant.declareWaitTime(data.avail, 'twilio');
    restaurant.save(); // We don't need to wait for the save to succeed
    io.sockets.emit('restaurant', restaurant);
    res.send(200);
  });
};
