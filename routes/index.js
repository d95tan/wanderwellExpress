var express = require('express');
var router = express.Router();
var db = require("../db/index.js")

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.json({msg: "Welcome to the backend"});
});

module.exports = router;
