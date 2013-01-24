var twilio = require('twilio')
  , config = require('./config')
  , twilioClient = twilio(config.twilio.account, config.twilio.token)
  , mongoose = require('mongoose')
  , models = require('./models')
  , Restaurant = models.Restaurant
  , async = require('async')
  , PREVENT_PURCHASE
;

// !!!!  WARNING WARNING WARNING  !!!!!!
// The PREVENT_PURCHASE flag is set to true until we're sure this script won't accidentally bankrupt NOTMC
// Commenting out this next line will BUY PHONE NUMBERS with REAL MONEY
PREVENT_PURCHASE = true;

mongoose.connect(config.mongodb);

Restaurant.find({ 'tourismBoard.twilio': 1, 'twilio.phone': undefined }).exec(function(err, restaurants) {
  console.log('PROVISION NUMBERS FOR ' + restaurants.length + ' RESTAURANTS');

  var provisionNumber = function(restaurant, callback) {

    var twilioRequestOptions = {
      method: 'POST',
      url: '/Accounts/' + config.twilio.account + '/IncomingPhoneNumbers',
      form: {
        AreaCode: 504, // give us a random new 504 number
        VoiceApplicationSid: config.twilio.application, // wire it up to our application
        SmsApplicationSid: config.twilio.application // sms too
      }
    };

    var twilioRequestCallback = function(err, data) {
      if(err) return callback(err);
      restaurant.twilio = { phone: data.phone_number };
      restaurant.markModified('twilio');
      restaurant.save(callback);
    };

    var fakeRequest = function(options, callback) {
      console.log('BEGIN FAKE TWILIO PURCHASE REQUEST');
      console.log('Printing request options...');
      console.log(options);
      console.log('END FAKE TWILIO PURCHASE REQUEST');
      callback();
    };

    if(PREVENT_PURCHASE) {
      fakeRequest(twilioRequestOptions, callback);
    }
    else {
      twilioClient.request(twilioRequestOptions, twilioRequestCallback);
    }
  };

  async.forEachSeries(restaurants, provisionNumber, function(err) {
    if(err) return console.log(err);
    console.log('FINISHED');
  });
});
