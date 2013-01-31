var models = require('../../models')
, _ = require('underscore')
, Restaurant = models.Restaurant;

exports.index = function(req, res, next) {
  var callback = function(err,restaurants) {
    res.jsonData = _.map(restaurants, function(restaurant) { 
      return restaurant.toJSON();
    });

    next();
  }, result;
  
  var RESULT_LIMIT = 9;

  if(req.query && req.query.location) {
    // IMPORTANT - MongoDB geo coords ordering is LONGITUDE FIRST
    // That's why we're calling reverse() at the end of this next line
    var location = req.query.location.split(',').map(function(x) { return parseFloat(x, 10); }).reverse();
    result = Restaurant.findNear(location)
  } else {
    result = Restaurant.find().sort('_id')
  }

  if(req.query && req.query.page) {
    var skip = (parseInt(req.query.page)-1) * RESULT_LIMIT;
    console.log(skip);
    result.skip(skip);
  }

  result.limit(RESULT_LIMIT).populate('vendorWaitTime').exec(callback);
}


exports.search = function(req, res, next) {

  Restaurant.findByName(req.query.name).limit(10).populate('vendorWaitTime').exec(function (err, restaurants) {
    if (err) return res.send(500);

    res.jsonData = _.map(restaurants, function(restaurant) { 
      return restaurant.toJSON();
    });

    next();
  });
}

exports.show = function(req, res, next) {
  var query = {$or: [{slug: req.params.id}]};
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    query.$or.push({_id: req.params.id});
  }
  Restaurant.findOne(query).populate('vendorWaitTime').exec(function (err, restaurant) {
    if (err) return res.send(500);
    res.jsonData = restaurant.toJSON();
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
