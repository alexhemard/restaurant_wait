var models = require('../../models')
, Restaurant = models.Restaurant;

exports.index = function(req, res, next) {
  //TODO return closest restaurants
  Restaurant.find().sort('_id').limit(40).lean().exec(function(err,restaurants) {
    res.jsonData = restaurants;
    next();
  });
};

exports.show = function(req, res, next) {
  var coords = null;
  if(req.body.coords) coords = req.body.coords.split(',').map(function(x) { return parseInt(x, 10); });
  // TODO: Do something with coords

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

  restaurant.save(function(err, restaurant) {
    if(err) throw err;
    res.jsonData = restaurant;
    next();
  });
};


exports.update = function(req, res, next) {
  restaurant.save(function(err, restaurant) {
    if(err) throw err;
    res.jsonData = restaurant;
    next();
  });
};
