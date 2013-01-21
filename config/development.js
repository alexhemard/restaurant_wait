exports.loggerFormat = 'dev';
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

// This is Joel's demo account
exports.twilio = {
  account: 'AC6485244d7f813a3c021ae99619461623',
  token: '7f0f4a6d57924d3f0134a4d1b8921b4c'
};

