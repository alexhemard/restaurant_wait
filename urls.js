var config = require('./config')
, routes = require('./routes/');

module.exports = function(app){
  // API routes
  // Do not call res.send(), res.json(), etc. in API route functions
  // Instead, within each API route, set res.jsonData to the JSON data, then call next()
  // This will allow us to write UI route functions that piggyback on the API functions
  //
  // Example API function for /api/me:
  /*
     exports.show = function(req, res, next) {
     res.jsonData = req.user;
     next();
     };
     */
  var sendJson = function(req, res) { res.json(res.jsonData); }
  app.get('/api/restaurants', routes.api.restaurants.index);
  app.post('/api/restaurants', routes.api.restaurants.create);
  app.get('/api/restaurants/:id', routes.api.restaurants.show);
  // twilio stuffs
  app.all('/api/twilio/*', routes.api.twilio.validateRequest);
  app.post('/api/twilio/sms', routes.api.twilio.sms);
  app.post('/api/twilio/voice', routes.api.twilio.voice);
  app.post('/api/twilio/voice/waitEntered', routes.api.twilio.voiceWaitEntered);

  // this catch-all route will send JSON for every API route that falls through to this point in the chain
  // WARNING: Sometimes they don't fall through to this point in the chain! Example:
  //
  // app.get('/api/users/someNonStandardService', routes.api.users.someNonStandardService);
  // app.get('/api/users/:id', routes.api.users.show)
  //
  // In this case the next() of `someNonStandardService` is the `show` route, but we want to send json
  // So explicitly tell the `someNonStandardService` that its `next` is the `sendJson` function:
  //
  // app.get('/api/users/someNonStandardService', routes.api.users.someNonStandardService, sendJson);
  // 
  app.all('/api/*', sendJson);

  // UI routes
  // Within each UI route function, call the corresponding API function.
  // Grab the API response data from res.jsonData and render as needed.
  //
  // Example UI function for /me:
  /*
  var me = require('../api/me');
  exports.show = function(req, res) {
  me.show(req, res, function() {
  res.render('me/index', { title: 'Profile', user: res.jsonData });
  });
  };
  */

  // restuarant stuff
  app.get('/', routes.ui.restaurants.index);
  app.get('/restaurants', routes.ui.restaurants.index);
  app.post('/restaurants', routes.ui.restaurants.create);
  app.get('/restaurants/:id', routes.ui.restaurants.show);
  app.put('/restaurants/:id', routes.ui.restaurants.update)
  app.get('/about', routes.ui.about.index);
  app.delete('/restaurants/:id', routes.ui.restaurants.delete);

}
