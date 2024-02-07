const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  let token = req.get("Authorization") || req.query.token;
  req.user = null;
  if (!token) return next();
  
  token = token.replace("Bearer ", "");

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      console.log(err)
      return next();
    }
    req.user = decoded.user; 
    
    return next();
  });
};
