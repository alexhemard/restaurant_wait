
/**
 * Module dependencies.
 */

var config = require('./config')
  , express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , jadeBrowser = require('jade-browser')
  , socketIo = require('socket.io')
  , passportSocketIo = require('passport.socketio')
  , mongoose = require('mongoose')
  , connectAssets = require('connect-assets')
  , lessMiddleware = require('less-middleware')
  , models = require('./models')
  , User = models.User
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , MongoStore = require('connect-mongo')(express)
  , sessionStore = new MongoStore({ url: config.mongodb })
  , sockets = require('./sockets')
  , twilio = require('twilio')
;

// set up passport authentication
if(config.enableGuestLogin) {
  passport.use('guest', new LocalStrategy(
    {
      usernameField: 'name',
    },
    // doesn't actually use password, just records name
    function(name, password, done) {
      process.nextTick(function() {
        User.authGuest(name, done);
      });
    }
  ));
}
if(config.enableEmailLogin) {
  passport.use('email', new LocalStrategy(
    {
      usernameField: 'email'
    },
    function(email, password, done) {
      process.nextTick(function() {
        User.authEmail(email, password, done);
      });
    }
  ));
}
if(config.twitter) {
  passport.use(new TwitterStrategy(
    config.twitter,
    function(token, tokenSecret, profile, done) {
      process.nextTick(function() {
        User.authTwitter(token, tokenSecret, profile, done);
      });
    }
  ));
}
if(config.facebook) {
  passport.use(new FacebookStrategy(
    config.facebook,
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        User.authFacebook(accessToken, refreshToken, profile, done);
      });
    }
  ));
}
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// connect the database
mongoose.connect(config.mongodb);

// create app, server, and web sockets
var app = express()
  , server = http.createServer(app)
  , io = global.io = socketIo.listen(server)
;

// Make socket.io use RedisStore when config.socketsRedis exists
if(config.socketsRedis) (function() {

  var RedisStore = require('socket.io/lib/stores/redis')
    , redis  = require('socket.io/node_modules/redis')
    , url = config.socketsRedis.url
    , port = config.socketsRedis.port
    , password = config.socketsRedis.password
    , pub    = redis.createClient(port, url)
    , sub    = redis.createClient(port, url)
    , client = redis.createClient(port, url)
  ;

  console.log(password);

  if(password) {
    pub.auth(password, function (err) { if (err) throw err; });
    sub.auth(password, function (err) { if (err) throw err; });
    client.auth(password, function (err) { if (err) throw err; });
  }

  io.set('store', new RedisStore({
    redis    : redis,
    redisPub : pub,
    redisSub : sub,
    redisClient : client
  }));

})();

// Make socket.io a little quieter
io.set('log level', 1);
// Give socket.io access to the passport user from Express
io.set('authorization', passportSocketIo.authorize({
  passport: passport,
  sessionKey: 'connect.sid',
  sessionStore: sessionStore,
  sessionSecret: config.sessionSecret,
  success: function(data, accept) {
    accept(null, true);
  },
  fail: function(data, accept) { // keeps socket.io from bombing when user isn't logged in
    accept(null, true);
  }
}));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // export jade templates to reuse on client side
  // This includes a kind of terrible cache-buster hack
  // It generates a new cache-busting query string for the script tag every time the server starts
  // This should probably only happen every time there's a change to the templates.js file
  var jadeTemplatesPath = '/js/templates.js';
  app.use(jadeBrowser(jadeTemplatesPath, ['*.jade', '*/*.jade'], { root: __dirname + '/views', minify: true }));
  var jadeTemplatesCacheBuster = (new Date()).getTime();
  var jadeTemplatesSrc = jadeTemplatesPath + '?' + jadeTemplatesCacheBuster;
  global.jadeTemplates = function() { return '<script src="' + jadeTemplatesSrc + '" type="text/javascript"></script>'; }

  // use the connect assets middleware for Snockets sugar
  app.use(connectAssets());

  app.use(express.favicon());
  app.use(express.logger(config.loggerFormat));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.sessionSecret));
  app.use(express.session({ store: sessionStore }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  
  app.use(lessMiddleware({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));

  if(config.useErrorHandler) app.use(express.errorHandler());
});

// Put all the routes in a seperate file -> urls.js
require('./urls')(app);

// Start the sockets
sockets(io);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
