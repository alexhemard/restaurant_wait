var mysql      = require('mysql')
  , mongoose   = require('mongoose')
  , _          = require('underscore')
  , models     = require(__dirname + '/../../models')
  , config     = require(__dirname + '/../')
  , Restaurant = models.Restaurant

var mysqlConn = mysql.createConnection({
  host     : '64.131.88.82',
  port     : '3306',
  user     : 'swagbskt',
  password : 'EQEc4WxYSPJnysDE',
  database : 'waitTimes'
});

mysqlConn.connect();
mongoose.connect(config.mongodb);


// From phone call with JP (1/20/2013):
// Select all the places that are still open
// but avoid the following food types
// bakeries, barFood, coffee, fastFood, desserts, snowballs
mysqlConn.query("select * from places inner join restaurantDetails on places.placeID = restaurantDetails.placeID where places.open = 1 and bakeries <> 1 and barFood <> 1 and coffee <> 1 and fastFood <> 1 and desserts <> 1 and snowballs <> 1",
  function(err, rows, fields) {
    if (err) throw err;

    console.log(fields);

    console.log("Fetched data from mysql...");

    mysqlConn.end();
    console.log("Closed mysql connection...");

    Restaurant.find({}).remove();
    console.log("Emptied out current restaurants from mongo...");

    _.each(rows, function(row, index, list) {

      console.log("Storing data for " + row.name1)
      restaurant = new Restaurant();
      restaurant.tourismBoard = row;

      _(Math.floor(Math.random() * 6) + 1).times(function(n) {
        restaurant.declareWaitTime(Math.floor(Math.random() * 4) + 1, 'swag'+n)
      });

      restaurant.markModified('tourismBoard');
      restaurant.save(function(err) {
        if(err) throw err;
        console.log("Saved " + row.name1);
      });
    });
  }
);
