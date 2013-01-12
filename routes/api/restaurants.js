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
  Restaurant.findById(id, function (err, restaurant) {
    if (err) return res.send(500);
    return res.jsonData = restaurant;
    next();
  });
};

exports.update = function(req, res, next) {

};
