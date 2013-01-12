var models = require('./models')
  , Restaurant = models.Restaurant
;

module.exports = function(io) {

  io.sockets.on('connection', function(socket) {

    socket.on('waitTime', function(data) {

      Restaurant.findById(data.id, function(err, restaurant) {

        restaurant.declareWaitTime(data.option); // TODO: define this method
        restaurant.save(); // We don't need to wait for the save to succeed
        socket.emit('restaurant', restaurant); // Send the updated restaurant
      });

    });

  });

};
