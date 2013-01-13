var fs = require('fs')
  , csv = require('csv')
  , config = require('./config')
  , mongoose = require('mongoose')
  , models = require('./models')
  , Restaurant = models.Restaurant
  , labels
  , recordObject
  , restaurant
;

mongoose.connect(config.mongodb);

Restaurant.find({}).remove();

csv().from.stream(fs.createReadStream(__dirname + '/restaurantImport.csv'))
  .on('record', function(data, index) {

    if(index == 0) {
      labels = data;
      Restaurant.remove();
    }
    else {
      recordObject = {};
      for(var i = 0; i < data.length; i++) recordObject[labels[i]] = data[i];
      restaurant = new Restaurant();
      restaurant.tourismBoard = recordObject;
      restaurant.markModified('tourismBoard');
      restaurant.save(function(err) {
        if(err) throw err;
      });
    }
  })
  .on('end', function(count){
    console.log('Number of lines: '+ count);
  })
  .on('error', function(error){
    console.log(error.message);
  })
;

