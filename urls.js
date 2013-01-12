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
  app.get('/api/me', routes.api.me.show);
  app.get('/api/users/:id', routes.api.users.show);
  app.get('/api/restaurants', routes.api.restaurants.index);
  app.get('/api/restaurants/:id', routes.api.restaurants.show);

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

  // home
  app.get('/', routes.ui.home);

  // currently logged-in user
  app.get('/me', routes.ui.me.show);
  app.put('/me', routes.ui.me.update);

  // restuarant stuff
  app.get('/restaurants', routes.ui.restaurants.index);
  app.post('/restaurants', routes.ui.restaurants.create);
  app.put('/restaurants/:id', routes.ui.restaurants.update);
  app.delete('/restaurants/:id', routes.ui.restaurants.delete);

  // user profiles
  app.get('/users/:id', routes.ui.users.show);

  // authentication
  if(config.enableGuestLogin) {
    app.post('/auth/guest', routes.ui.auth.guest);
  }
  if(config.enableEmailLogin) {
    app.post('/auth/registerEmail', routes.ui.auth.registerEmail);
    app.post('/auth/email', routes.ui.auth.email);
  }
  if(config.twitter) {
    app.get('/auth/twitter', routes.ui.auth.twitter);
    app.get('/auth/twitter/callback', routes.ui.auth.twitterCallback);
  }
  if(config.facebook) {
    app.get('/auth/facebook', routes.ui.auth.facebook);
    app.get('/auth/facebook/callback', routes.ui.auth.facebookCallback);
  }
  app.get('/auth/success', routes.ui.auth.success);
  app.get('/auth/failure', routes.ui.auth.failure)
  app.get('/auth/logout', routes.ui.auth.logout);

}
