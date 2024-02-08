var express = require("express");
var router = express.Router();

const tripsController = require("../controllers/tripsController");
const eventsController = require("../controllers/eventsController");

//* Trips
router.get("/", tripsController.index);
router.post("/", tripsController.createTrip);

//* Events
router.get("/:tripId", eventsController.validateUser, eventsController.index);
router.post(
  "/:tripId",
  eventsController.validateUser,
  eventsController.createEvent
);

module.exports = router;
