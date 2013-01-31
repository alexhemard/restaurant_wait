exports.loggerFormat = 'dev';
exports.useErrorHandler = true;
exports.mongodb = 'mongodb://localhost/boilerplate';
exports.sessionSecret = 'your secret here';


exports.twilioAreaCode = 504;

exports.useErrorHandler = true;
exports.mongodb = 'mongodb://localhost/boilerplate';
exports.sessionSecret = 'your secret here';

exports.enableGuestLogin = true;
exports.enableEmailLogin = true;
exports.twitter = {
  consumerKey: 'my consumer key',
  consumerSecret: 'my consumer secret'
};
exports.facebook = {
  clientID: 'my client id',
  clientSecret: 'my client secret',
  callbackURL: 'http://127.0.0.1:3000/auth/facebook/callback'
};

// exports.socketsRedis = {
//   port: 9799,
//   url: 'slimehead.redistogo.com',
//   password: '283803f32cc90c73b1270f74e55b3666'
// };

// NOTMC Test Credentials - THESE CANNOT BUY PHONE NUMBERS FOR REAL
exports.twilio = {
  account: 'AC4159d49dcf636c0ee4454747153f470f',
  token: '25674d4e42f21209ba26b64cf4541e18',
  application: 'AP5bf78e6aa4ba48da90b4c01a6ebcdd9d'
};
