module.exports = function() {
  console.log('TWILIO NUMBER IMPORT STARTED');

  var twilio       = require('twilio')
    , mongoose     = require('mongoose')
    , async        = require('async')
    , config       = require(__dirname + '/../')
    , models       = require(__dirname + '/../../models')
    , twilioClient = twilio(config.twilio.account, config.twilio.token)
    , Restaurant   = models.Restaurant
  ;

  // mongoose.connect(config.mongodb);

  Restaurant.find({ 'tourismBoard.twilio': 1, 'twilio.phone': undefined }).exec(function(err, restaurants) {
    console.log('PROVISION NUMBERS FOR ' + restaurants.length + ' RESTAURANTS');

    var provisionNumber = function(restaurant, callback) {

      // NOTES FROM JOEL
      // We currently don't handle the case where there are no 504 numbers to purchase.

      // The dev env will use NOTMC test credentials.

      // Info about faking a number purchase is here:
      // http://www.twilio.com/docs/api/rest/test-credentials#test-incoming-phone-numbers
      // (you'll temporarily have to switch to using a 500 instead of a 504 area code).
      // MAKE SURE TO CHANGE AREA CODE TO 504 BEFORE RUNNING IN PRODUCTION.

      // Test credentials don't have application SIDs because they don't have applications.
      // You have to comment out the part where I specify VoiceApplicationSid and
      // SmsApplicationSid to test, BUT THOSE ARE NEEDED IN PRODUCTION.

      // WINNERS DON'T USE DRUGS

      var twilioRequestOptions = {
        method: 'POST',
        url: '/Accounts/' + config.twilio.account + '/IncomingPhoneNumbers',
        form: {
          AreaCode: 500
          // VoiceApplicationSid: config.twilio.application, // wire it up to our application
          // SmsApplicationSid: config.twilio.application // sms too
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
};