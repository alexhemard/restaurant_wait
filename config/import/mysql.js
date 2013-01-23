module.exports = function() {
  console.log('MYSQL IMPORT STARTED');

  var mysql      = require('mysql')
    , mongoose   = require('mongoose')
    , _          = require('underscore')
    , models     = require(__dirname + '/../../models')
    , config     = require(__dirname + '/../')
    , Restaurant = models.Restaurant
    , restaurants = []

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
  mysqlConn.query("select * from places inner join restaurantDetails on places.placeID = restaurantDetails.placeID where places.open = 1 and bakeries <> 1 and barFood <> 1 and coffee <> 1 and fastFood <> 1 and desserts <> 1 and snowballs <> 1",
    function(err, rows, fields) {
      if (err) throw err;
      console.log("Fetched data from mysql...");

      fields = _.groupBy(fields, function(field){ return field.orgTable == "places" });

      placesFields = _.map(fields.true, function(field) { return field.name; });

      cuisineFields = _.compact(_.map(fields.false, function(field) {
        if (!_.contains(["attireID", "placeID"], field.name)) {
          return field.name;
        }
      }));

      mysqlConn.end();
      console.log("Closed mysql connection...");

      // Restaurant.find({}).remove();
      console.log("Emptied out current restaurants from mongo...");

      rows.forEach(function(row) {
        var cuisines = [];
        var details = {};
        _.each(row, function(value, key, list) {
          if (_.contains(cuisineFields, key) && value > 0) {
            cuisines.push(key);
          }
          else if (_.contains(placesFields, key)) {
            details[key] = value;
          }
        });

        createRestaurant(details, cuisines);
      });
    }
  );


  function createRestaurant(details, cuisines) {
    var restaurant = Restaurant.findOne({ 'tourismBoard.placeID': details.placeID }, function (err, restaurant) {
      console.log(restaurant == null);
      if (restaurant == null) {
        restaurant = new Restaurant();
      }
      else {
        console.log(restaurant);
      }

      restaurant.tourismBoard = details;
      restaurant.tourismBoard.cuisines = cuisines;
      restaurant.location = [details.longitude, details.latitude];

      _(Math.floor(Math.random() * 6) + 1).times(function(n) {
        restaurant.declareWaitTime(Math.floor(Math.random() * 4) + 1, 'swag'+n)
      });

      restaurant.markModified('tourismBoard');
      restaurant.save(function(err, data) {
        if(err) throw err;
        console.log("Saved " + restaurant.tourismBoard.name1);
      });
    });
  }
};
