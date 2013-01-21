var twilio = require('twilio')
  , twilioClient = twilio('AC6485244d7f813a3c021ae99619461623', '7f0f4a6d57924d3f0134a4d1b8921b4c')
  , models = require('../../models')
  , Restaurant = models.Restaurant
;

// middleware to check that the request came from Twilio
exports.validateRequest = function(req, res, next) {
  if(!twilio.validateExpressRequest(req, '7f0f4a6d57924d3f0134a4d1b8921b4c')) return res.send(404);
  next();
};

exports.sms = function(req, res) {

  var userNumber = req.body.From;
  var serverNumber = req.body.To;
  var msg = req.body.Body;

  var waitTimeOption = parseInt(msg, 10);

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
        sendSms('This is a valid EatNowNola number, but it has no associated restaurant.');
        return;
      }
      restaurant.declareWaitTime(waitTimeOption, userNumber);
      restaurant.save(); // no need to wait for save to complete
      io.sockets.emit('update', { restaurantId: restaurant.id, waitTimes: restaurant.waitTimes }); // Send the updated waitTimes
      sendSms('Wait time updated!');
    });
  }
  else {
    sendSms('Send 1 for "No Wait", 2 for "15-30m", 3 for "30-60m", or 4 for "Not Seating"');
  }

};

exports.voice = function(req, res) {

  console.log('VOICE CALL');
  console.log(req.body);

  var userNumber = req.body.From;
  var serverNumber = req.body.To;
  var twilres = new twilio.TwimlResponse();

  Restaurant.findOne({ 'twilio.phone': serverNumber }).exec(function(err, restaurant) {
    
    if(err) {
      twilres.say('This is a valid Eat Now Nola number, but it has no associated restaurant.').hangup();
      return;
    }
    else {
      twilres
        .gather({
          numDigits: 1,
          action: '/api/twilio/voice/waitEntered'
        }, function(node) {
          node
            .say('Press 1 for no wait.')
            .say('Press 2 for 15 to 30 minutes')
            .say('Press 3 for 30 minutes to an hour')
            .say('Or press 4 for no availability')
          ;
        })
        .redirect('/api/twilio/voice');
      ;
    }

    res.type('text/xml');
    res.send(twilres.toString());

  });

};

exports.voiceWaitEntered = function(req, res) {

  var userNumber = req.body.From;
  var serverNumber = req.body.To;
  var waitTimeOption = parseInt(req.body.Digits, 10);
  var twilres = new twilio.TwimlResponse();

  if(!waitTimeOption || waitTimeOption > 4) {
    twilres.say('The number you have entered is not valid.').redirect('/api/twilio/voice');

    res.type('text/xml');
    res.send(twilres.toString());
    return;
  }

  Restaurant.findOne({ 'twilio.phone': serverNumber }).exec(function(err, restaurant) {
    if(err) {
      twilres.say('This is a valid Eat Now Nola number, but it has no associated restaurant.').hangup();
    }
    else {
      restaurant.declareWaitTime(waitTimeOption, userNumber);
      restaurant.save(); // no need to wait for save to complete
      io.sockets.emit('update', { restaurantId: restaurant.id, waitTimes: restaurant.waitTimes }); // Send the updated waitTimes
      twilres.say('Thank you. The wait time has been updated. Goodbye.').hangup();
    }

    res.type('text/xml');
    res.send(twilres.toString());
  });
};
