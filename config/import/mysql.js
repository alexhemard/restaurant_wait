module.exports = function() {
  console.log('MYSQL IMPORT STARTED');

  var mysql        = require('mysql')
    , mongoose     = require('mongoose')
    , _            = require('underscore')
    , slug         = require('slug')
    , models       = require(__dirname + '/../../models')
    , config       = require(__dirname + '/../')
    , twilioImport = require(__dirname + '/twilio')
    , Restaurant   = models.Restaurant
    , restaurants  = []

  var mysqlConn = mysql.createConnection({
    host     : '64.131.88.82',
    port     : '3306',
    user     : 'swagbskt',
    password : 'EQEc4WxYSPJnysDE',
    database : 'waitTimes'
  });

  mysqlConn.connect();
  //mongoose.connect(config.mongodb);

  // From phone call with JP (1/20/2013):
  // Select all the places that are still open
  // but avoid the following food types
  // bakeries, barFood, coffee, fastFood, desserts, snowballs
  mysqlConn.query("select * from places inner join restaurantDetails on places.placeID = restaurantDetails.placeID inner join lookupNeighborhood on places.neighborhood = lookupNeighborhood.neighborhoodID where places.open = 1 and restaurantDetails.bakeries <> 1 and restaurantDetails.barFood <> 1 and restaurantDetails.coffee <> 1 and restaurantDetails.fastFood <> 1 and restaurantDetails.desserts <> 1 and restaurantDetails.snowballs <> 1",
    function(err, rows, fields) {
      if (err) throw err;
      console.log("Fetched data from mysql...");

      fields = _.groupBy(fields, function(field){ return field.orgTable });
      placesFields = _.map(fields.places, function(field) { return field.name; });

      cuisineFields = _.compact(_.map(fields.restaurantDetails, function(field) {
        if (!_.contains(["attireID", "placeID"], field.name)) {
          return field.name;
        }
      }));

      neighborhoodFields = _.compact(_.map(fields.lookupNeighborhood, function(field) {
        console.log(field);
        if (!_.contains(["neighborhoodID", "filter", "detailPage", "neighborhoodURL"], field.name)) {
          return field.name;
        }
      }));

      console.log(neighborhoodFields);
      mysqlConn.end();
      console.log("Closed mysql connection...");

      rows.forEach(function(row) {
        var cuisines = [];
        var neighborhoods = [];
        var details = {};
        _.each(row, function(value, key, list) {
          if (_.contains(cuisineFields, key) && value > 0) {
            cuisines.push(key);
          }
          else if (_.contains(neighborhoodFields, key)) {
            neighborhoods.push(value);
          }
          else if (_.contains(placesFields, key)) {
            details[key] = value;
          }
        });
        createRestaurant(details, cuisines, neighborhoods);
      });

      twilioImport();
    }
  );


  function createRestaurant(details, cuisines, neighborhoods) {
    var restaurant = Restaurant.findOne({ 'tourismBoard.placeID': details.placeID }, function (err, restaurant) {
      if (restaurant == null) {
        restaurant = new Restaurant();
        console.log("Creating record for " + details.name1);
      }
      else {
        console.log("Found record for " + details.name1);
      }
      restaurant.name = details.name1;
      restaurant.slug = slug(details.name1.toLowerCase().replace(/'/gi, ''));
      restaurant.tourismBoard = details;
      restaurant.tourismBoard.cuisines = cuisines;
      restaurant.tourismBoard.neighborhoods = neighborhoods;
      restaurant.location = [details.longitude, details.latitude];

      _(Math.floor(Math.random() * 6) + 1).times(function(n) {
        restaurant.declareWaitTime(Math.floor(Math.random() * 4) + 1, 'swag'+n)
      });

      restaurant.markModified('tourismBoard');
      restaurant.save(function(err, data) {
        if(err) {
          console.log("Mongo error with " + details.name1 + ".  Message is " + err.message);
          // console.log(restaurant);
          // throw err;
        }
        console.log("Saved " + restaurant.tourismBoard.name1);
      });
    });
  }
};
