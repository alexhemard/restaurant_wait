var twilio = require('twilio')
  , config = require('./config')
  , twilioClient = twilio(config.twilio.account, config.twilio.token)
  , mongoose = require('mongoose')
  , models = require('./models')
  , Restaurant = models.Restaurant
  , async = require('async')
;


mongoose.connect(config.mongodb);

Restaurant.find({ 'tourismBoard.twilio': 0, 'twilio.phone': undefined }).exec(function(err, restaurants) {
  console.log('PROVISION NUMBERS FOR ' + restaurants.length + ' RESTAURANTS');

  var provisionNumber = function(restaurant, callback) {

    var twilioRequestOptions = {
      method: 'POST',
      url: '/Accounts/' + config.twilio.account + '/IncomingPhoneNumbers',
      form: {
        AreaCode: 504,
        VoiceApplicationSid: config.twilio.application, // wire it up to our application
        SmsApplicationSid: config.twilio.application // sms too
      }
    };

    var twilioRequestCallback = function(err, data) {
      if(err) return callback(err);
      console.log('Purchased ' + data.phone_number + ' for ' + restaurant.tourismBoard.name1);
      restaurant.twilio = { phone: data.phone_number };
      restaurant.markModified('twilio.phone');
      restaurant.save(callback);
    };

    twilioClient.request(twilioRequestOptions, twilioRequestCallback);
  };

  async.forEachSeries(restaurants, provisionNumber, function(err) {
    if(err) return console.log(err);
    console.log('FINISHED');
  });
});
