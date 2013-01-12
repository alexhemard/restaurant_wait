var models = require('../../models')
, Restaurant = models.Restaurant;

exports.index = function(req, res, next) {
  //TODO return closest restaurants
  Restaurant.find().limit(20).lean().exec(function(err,restaurants) {
    res.jsonData = restaurants;
    next();
  });
};

exports.show = function(req, res, next) {
  Restaurant.findById(req.params.id, function (err, restaurant) {
    if (err) return res.send(500);
    res.jsonData = restaurant;
    next();
  });
};

exports.create = function(req, res, next) {
  var restaurant = new Restaurant();
  restaurant.name = req.body.name;
  restaurant.url = req.body.url;
  restaurant.address = req.body.address;
  restaurant.location.lat = req.body.lat;
  restaurant.location.lon = req.body.lon;
  //TODO finish this

  restaurant.save(function(err, lunch) {
    if(err) throw err;
    res.jsonData = lunch;
    next();
  });
};


exports.update = function(req, res, next) {

};
