var models = require('./models')
  , Restaurant = models.Restaurant
;

module.exports = function(io) {

  io.sockets.on('connection', function(socket) {

    socket.on('waitTime', function(data) {
      if (data.headers.cookie) {
        // if there is, parse the cookie
        data.cookie = parseCookie(data.headers.cookie);

        console.log(data.cookie['connect.sid']);
        Restaurant.findById(data.restaurant, function(err, restaurant) {

          restaurant.declareWaitTime(data.option, data.cookie['connect.sid']);
          restaurant.save(); // We don't need to wait for the save to succeed
          socket.emit('restaurant', restaurant); // Send the updated restaurant
        });
      }
    });
  });
}
