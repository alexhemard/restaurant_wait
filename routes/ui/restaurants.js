var restaurants = require('../api/restaurants');

exports.index = function(req, res) {
  res.render('restaurants/index', { title: 'Restaurants' });
};

exports.create = function(req, res) {
  restaurants.create(req, res, function() {
    res.redirect('/restaurants/'+res.jsonData._id);
  });
};

exports.show = function(req, res) {
  restaurants.show(req, res, function() {
    res.render('restaurants/index', {title:'Restaurant', restaurant:res.jsonData});
  });
};

exports.update = function(req, res) {
  restaurants.update(req, res, function() {
    res.redirect('/restaurants/'+res.jsonData._id);
  });
};

