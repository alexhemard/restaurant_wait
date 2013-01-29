var models = require('../../models')
, _ = require('underscore')
, Restaurant = models.Restaurant;

exports.index = function(req, res) {
  var restaurants = Restaurant.find().sort({"tourismBoard.placeID" : 1}).exec(function(err, restaurants) {
    res.render('admin/index', { restaurants: restaurants});
  });
}
