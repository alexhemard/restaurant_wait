var twilio = require('twilio')
  , config = require('./config')
  , twilioClient = twilio(config.twilio.account, config.twilio.token)
  , mongoose = require('mongoose')
  , models = require('./models')
  , Restaurant = models.Restaurant
  , async = require('async')
;

mongoose.connect(config.mongodb);

Restaurant.find({ 'tourismBoard.twilio': 0, 'twilio.phone': undefined }).limit(10).exec(function(err, restaurants) {

  var provisionNumber = function(restaurant, callback) {
    twilioClient.request({
      method: 'POST',
      url: '/Accounts/' + config.twilio.account + '/IncomingPhoneNumbers',
      form: {
        AreaCode: 504,
        VoiceApplicationSid: config.twilio.application,
        SmsApplicationSid: config.twilio.application
      }
    }, function(err, data) {
      if(err) return callback(err);
      restaurant.twilio = { phone: data.phone_number };
      restaurant.markModified('twilio');
      restaurant.save(callback);
    });
  };

  async.forEachSeries(restaurants, provisionNumber, function(err) {
    if(err) return console.log(err);
    console.log('FINISHED');
  });
});
