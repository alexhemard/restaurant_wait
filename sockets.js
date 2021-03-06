var models = require('./models')
  , Restaurant = models.Restaurant
  , cookieParser = require('express/node_modules/cookie')
  , _ = require('underscore')
;

module.exports = function(io) {

  io.configure(function (){
    io.set('authorization', function (handshakeData, callback) {
      // lol idk
      // how did this work before :(
      handshakeData.sessionID = cookieParser.parse(handshakeData.headers.cookie)['connect.sid']
      callback(null,true);
    });
  });

  io.sockets.on('connection', function(socket) {
    socket.on('waitTime', function(data) {

      Restaurant.findById(data.restaurant).populate('vendorWaitTime').exec(function(err, restaurant) {
        restaurant.declareWaitTime(data.option, socket.handshake.sessionID);
        restaurant.save(); // We don't need to wait for the save to succeed

        var vendorWaitTime = restaurant.vendorWaitTime ? restaurant.vendorWaitTime.toJSON() : null;

        io.sockets.emit('update', { restaurantId: restaurant.id, 
                                    waitTimes: restaurant.waitTimes,
                                    vendorWaitTime: vendorWaitTime
                                  });
      });
    });
  });
}
