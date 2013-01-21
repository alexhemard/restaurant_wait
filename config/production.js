exports.loggerFormat = 'dev';
exports.useErrorHandler = true;
exports.mongodb = 'mongodb://nodejitsu_jwietelmann:1j1gaj9jah995h8f1ibuf29r9n@ds043937.mongolab.com:43937/nodejitsu_jwietelmann_nodejitsudb3169538436';
// mongo --host ds043937.mongolab.com --port 43937 -u nodejitsu_jwietelmann -p 1j1gaj9jah995h8f1ibuf29r9n nodejitsu_jwietelmann_nodejitsudb3169538436
//exports.mongodb = 'mongodb://swagbasket:swagbasket@ds047307.mongolab.com:47307/restaurantwait';
exports.sessionSecret = 'sw4gb4$k3t!!!';

exports.socketsRedis = {
  port: 6379,
  url: 'nodejitsudb1346491305.redis.irstack.com',
  password: 'f327cfe980c971946e80b8e975fbebb4',
  authString: url + ':' + password
}

// TODO - Switch to NOTMC account
exports.twilio = {
  account: 'AC6485244d7f813a3c021ae99619461623',
  token: '7f0f4a6d57924d3f0134a4d1b8921b4c'
};

