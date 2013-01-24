exports.loggerFormat = 'dev';
exports.useErrorHandler = true;
exports.mongodb = 'mongodb://nodejitsu_jwietelmann:1j1gaj9jah995h8f1ibuf29r9n@ds043937.mongolab.com:43937/nodejitsu_jwietelmann_nodejitsudb3169538436';
// mongo --host ds043937.mongolab.com --port 43937 -u nodejitsu_jwietelmann -p 1j1gaj9jah995h8f1ibuf29r9n nodejitsu_jwietelmann_nodejitsudb3169538436
//exports.mongodb = 'mongodb://swagbasket:swagbasket@ds047307.mongolab.com:47307/restaurantwait';
exports.sessionSecret = 'sw4gb4$k3t!!!';

exports.socketsRedis = {
  port: 9799,
  url: 'slimehead.redistogo.com',
  password: '283803f32cc90c73b1270f74e55b3666'
};

// This is NOTMC's real account
exports.twilio = {
  account: 'AC20b5cb6e81f6a56c0887dac33d5c10e1',
  token: '2821686ca49e315068dcc0bfbfe3aca0',
  application: 'AP267190721b56867bd1c6cc79c606cc2f'
};
