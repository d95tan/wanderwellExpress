var express = require("express");
var router = express.Router();

const tripsController = require("../controllers/tripsController");

router.get("/", tripsController.index);

router.post("/", tripsController.createTrip);

// router.post("/login", tripsController.login)

module.exports = router;
