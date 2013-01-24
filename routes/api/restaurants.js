var models = require('../../models')
, Restaurant = models.Restaurant;

exports.index = function(req, res, next) {
  var callback = function(err,restaurants) {
    res.jsonData = restaurants;
    next();
  }

  if(req.query && req.query.location) {
    // IMPORTANT - MongoDB geo coords ordering is LONGITUDE FIRST
    // That's why we're calling reverse() at the end of this next line
    var location = req.query.location.split(',').map(function(x) { return parseFloat(x, 10); }).reverse();
    Restaurant.findNear(location).limit(40).lean().exec(callback); 
  } else {
    Restaurant.find().sort('_id').limit(40).lean().exec(callback);
  }
}

exports.show = function(req, res, next) {
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
