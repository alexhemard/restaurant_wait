
exports.acceptData = function(req, res, next) {
  console.log('received twilio data');
  console.log(req.body);
  res.send(200);
};
