var express = require('express');
var router = express.Router();
var db = require("../db/index.js")

/* GET home page. */
router.get('/', async function (req, res, next) {
  const result = await db.query("SELECT * FROM BANDS")
  res.json(result);
  // res.json("I'm here");
});

module.exports = router;
