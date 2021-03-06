
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
  , MongoStore = require('connect-mongo')(express)
  , sessionStore = new MongoStore({ url: config.mongodb })
  , sockets = require('./sockets')
  , twilio = require('twilio')
;

// connect the database
mongoose.connect(config.mongodb);

// create app, server, and web sockets
var app = express()
  , server = http.createServer(app)
  , io = global.io = socketIo.listen(server)

var auth = express.basicAuth('notmc', 't0ur1sm');

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

// Heroku doesn't support WebSockets, so use long-polling
io.set("transports", ["xhr-polling"]); 
io.set("polling duration", 10);

// Make socket.io a little quieter
io.set('log level', 1);

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
  app.use(app.router);

  app.use(lessMiddleware({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));

  if(config.useErrorHandler) app.use(express.errorHandler());
});

// Put all the routes in a seperate file -> urls.js
require('./urls')(app, auth);

// Start the sockets
sockets(io);

// Start the web server
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
