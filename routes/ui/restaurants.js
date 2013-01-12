var restaurants = require('../api/restaurants');

exports.index = function(req, res) {
  restaurants.index(req, res, function() { 
    res.render('restaurants/index', {title:'Restaurants'});
  });
};
