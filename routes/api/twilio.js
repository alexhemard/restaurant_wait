var twilio = require('twilio')
  , twilioClient = twilio('AC6485244d7f813a3c021ae99619461623', '7f0f4a6d57924d3f0134a4d1b8921b4c')
  , models = require('../../models')
  , Restaurant = models.Restaurant
;

exports.validateRequest = function(req, res, next) {
  if(!twilio.validateExpressRequest(req, '7f0f4a6d57924d3f0134a4d1b8921b4c')) return res.send(404);
  next();
};

exports.sms = function(req, res) {

  var userNumber = req.body.From;
  var serverNumber = req.body.To;
  var msg = req.body.Body;

  var waitTimeOption = parseInt(msg, 10);

  var smsData = {
    to: userNumber,
    from: serverNumber
  };

  var sendSms = function(body) {
    twilioClient.sendSms({
      from: serverNumber,
      to: userNumber,
      body: body
    });
  };

  if(waitTimeOption && waitTimeOption <= 4) {
    Restaurant.findOne({ 'twilio.phone': serverNumber }).exec(function(err, restaurant) {
      if(err) {
        sendSms('This is a valid EatNowNola number but has no associated restaurant');
        return;
      }
      restaurant.declareWaitTime(waitTimeOption, userNumber);
      sendSms('Wait time updated!');
      res.send(200);
    });
  }
  else {
    sendSms('Enter 1 for "No Wait", 2 for "15-30m", 3 for "30-60m", or 4 for "Not Seating"');
    res.send(200);
  }

};

exports.voice = function(req, res) {

  var twilioResponse = new twilio.TwimlResponse();

};
