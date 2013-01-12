exports.show = function(req, res, next) {
  res.jsonData = req.user ? req.user : {};
  next();
};

exports.update = function(req, res, next) {

};
